import argon2 from 'argon2';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { Router } from 'express';
import { and, eq, gt, isNull, lt, ne, sql } from 'drizzle-orm';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import {
  authChallenges,
  authSessions,
  schoolOwnerships,
  schoolUserMemberships,
  users,
} from '../db/schema.js';
import {
  assertAuthenticationEmailConfigured,
  sendAuthenticationCode,
} from '../services/authEmail.js';

const sessionCookieName = 'school_smis_session';
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;
const challengeLifetimeMs = 10 * 60 * 1000;

function positiveIntegerSetting(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return parsed;
}

function emailRateLimitKey(request) {
  const email = request.body?.email;
  if (typeof email !== 'string' || !email.trim()) return ipKeyGenerator(request.ip);
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

function createUserRateLimiter({ limit, windowMs, message }) {
  return rateLimit({
    windowMs,
    limit,
    keyGenerator: emailRateLimitKey,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message } },
  });
}

function createAuthRateLimiters() {
  const loginWindowMs = positiveIntegerSetting('LOGIN_RATE_LIMIT_WINDOW_MINUTES', 15) * 60 * 1000;
  const lockoutWindowMs = positiveIntegerSetting('LOGIN_LOCKOUT_MINUTES', 15) * 60 * 1000;
  const otpWindowMs = positiveIntegerSetting('OTP_RESEND_WINDOW_MINUTES', 10) * 60 * 1000;

  return {
    loginPerIp: rateLimit({
      windowMs: loginWindowMs,
      limit: positiveIntegerSetting('LOGIN_RATE_LIMIT_PER_IP', 10),
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: { code: 'RATE_LIMITED', message: 'Too many sign-in attempts from this network. Try again later.' } },
    }),
    loginPerIdentifier: createUserRateLimiter({
      windowMs: loginWindowMs,
      limit: positiveIntegerSetting('LOGIN_RATE_LIMIT_PER_IDENTIFIER', 5),
      message: 'Too many sign-in requests for this account. Try again later.',
    }),
    loginFailedAttempts: createUserRateLimiter({
      windowMs: lockoutWindowMs,
      limit: positiveIntegerSetting('LOGIN_MAX_ATTEMPTS', 5),
      skipSuccessfulRequests: true,
      message: 'Too many failed sign-in attempts. Try again after the lockout period.',
    }),
    otpPerUser: createUserRateLimiter({
      windowMs: otpWindowMs,
      limit: positiveIntegerSetting('OTP_RATE_LIMIT_PER_USER', 10),
      message: 'Too many verification-code requests for this account. Try again later.',
    }),
    otpResendsPerUser: createUserRateLimiter({
      windowMs: otpWindowMs,
      limit: positiveIntegerSetting('OTP_RESEND_LIMIT', 3),
      message: 'Too many verification-code resends. Try again later.',
    }),
  };
}

const emailSchema = z.string().trim().email().max(254).transform((email) => email.toLowerCase());
const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: emailSchema,
  password: z.string().min(10).max(128),
});
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});
const emailCodeSchema = z.object({
  email: emailSchema,
  code: z.string().regex(/^\d{6}$/),
});
const resetPasswordSchema = emailCodeSchema.extend({
  password: z.string().min(10).max(128),
});
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(10).max(128),
});

function asyncRoute(handler) {
  return (request, response, next) => Promise.resolve(handler(request, response, next)).catch(next);
}

function publicUser(user) {
  return { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header.split(';').map((part) => {
      const separator = part.indexOf('=');
      if (separator < 0) return ['', ''];
      const key = part.slice(0, separator).trim();
      try {
        return [key, decodeURIComponent(part.slice(separator + 1).trim())];
      } catch {
        return [key, ''];
      }
    }).filter(([key]) => key),
  );
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function validationError(response, parsed) {
  return response.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Check the submitted information and try again.',
      details: parsed.error.issues.map(({ path, message }) => ({ path, message })),
    },
  });
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
  };
}

function sendError(response, status, code, message) {
  return response.status(status).json({ error: { code, message } });
}

async function invalidateChallenges(db, userId, purpose) {
  await db
    .update(authChallenges)
    .set({ consumedAt: new Date() })
    .where(and(
      eq(authChallenges.userId, userId),
      eq(authChallenges.purpose, purpose),
      isNull(authChallenges.consumedAt),
    ));
}

async function issueCode(db, user, purpose) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const now = new Date();
  await invalidateChallenges(db, user.id, purpose);
  const [challenge] = await db
    .insert(authChallenges)
    .values({
      id: uuidv7(),
      userId: user.id,
      purpose,
      codeHash: await argon2.hash(code, { type: argon2.argon2id }),
      expiresAt: new Date(now.getTime() + challengeLifetimeMs),
    })
    .returning();

  try {
    await sendAuthenticationCode({ email: user.email, fullName: user.fullName, code, purpose });
  } catch (error) {
    await db
      .update(authChallenges)
      .set({ consumedAt: new Date() })
      .where(eq(authChallenges.id, challenge.id));
    if (error.code === 'AUTH_EMAIL_NOT_CONFIGURED') throw error;
    const deliveryError = new Error('Authentication email delivery failed.', { cause: error });
    deliveryError.code = 'AUTH_EMAIL_DELIVERY_FAILED';
    throw deliveryError;
  }
}

async function findAndConsumeCode(db, userId, purpose, code) {
  const maxChallengeAttempts = positiveIntegerSetting('OTP_MAX_ATTEMPTS', 10);
  const now = new Date();
  const [challenge] = await db
    .select()
    .from(authChallenges)
    .where(and(
      eq(authChallenges.userId, userId),
      eq(authChallenges.purpose, purpose),
      isNull(authChallenges.consumedAt),
      gt(authChallenges.expiresAt, now),
    ))
    .orderBy(sql`${authChallenges.createdAt} desc`)
    .limit(1);

  if (!challenge || challenge.attempts >= maxChallengeAttempts) return false;

  const [attempt] = await db
    .update(authChallenges)
    .set({ attempts: sql`${authChallenges.attempts} + 1` })
    .where(and(
      eq(authChallenges.id, challenge.id),
      isNull(authChallenges.consumedAt),
      lt(authChallenges.attempts, maxChallengeAttempts),
    ))
    .returning({ id: authChallenges.id });
  if (!attempt) return false;

  if (!(await argon2.verify(challenge.codeHash, code))) return false;

  const [consumed] = await db
    .update(authChallenges)
    .set({ consumedAt: now })
    .where(and(eq(authChallenges.id, challenge.id), isNull(authChallenges.consumedAt)))
    .returning({ id: authChallenges.id });
  return Boolean(consumed);
}

async function createSession(db, user, response) {
  const rawToken = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + sessionLifetimeMs);
  await db.insert(authSessions).values({
    id: uuidv7(),
    userId: user.id,
    tokenHash: sha256(rawToken),
    expiresAt,
  });
  response.cookie(sessionCookieName, rawToken, {
    ...cookieOptions(),
    maxAge: sessionLifetimeMs,
  });
}

export function createAuthenticationMiddleware({ resolveDb }) {
  return asyncRoute(async (request, response, next) => {
    const rawToken = parseCookies(request.headers.cookie)[sessionCookieName];
    if (!rawToken) return sendError(response, 401, 'AUTHENTICATION_REQUIRED', 'Sign in to continue.');
    const db = resolveDb();
    if (!db) return sendError(response, 503, 'DATABASE_NOT_CONFIGURED', 'Authentication is unavailable until the database is configured.');

    const now = new Date();
    const [session] = await db
      .select({ sessionId: authSessions.id, user: users })
      .from(authSessions)
      .innerJoin(users, eq(authSessions.userId, users.id))
      .where(and(eq(authSessions.tokenHash, sha256(rawToken)), gt(authSessions.expiresAt, now)))
      .limit(1);

    if (!session) {
      response.clearCookie(sessionCookieName, cookieOptions());
      return sendError(response, 401, 'SESSION_EXPIRED', 'Your session has expired. Sign in again.');
    }
    request.auth = { sessionId: session.sessionId, user: session.user };
    request.authDb = db;
    next();
  });
}

export function createAuthRouter({ resolveDb, logger }) {
  const router = Router();
  const requireAuthentication = createAuthenticationMiddleware({ resolveDb });
  const rateLimiters = createAuthRateLimiters();

  router.post('/register', rateLimiters.otpPerUser, asyncRoute(async (request, response) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) return validationError(response, parsed);
    assertAuthenticationEmailConfigured();
    const db = resolveDb();
    if (!db) return sendError(response, 503, 'DATABASE_NOT_CONFIGURED', 'Authentication is unavailable until the database is configured.');

    const passwordHash = await argon2.hash(parsed.data.password, { type: argon2.argon2id });
    let user;
    try {
      [user] = await db
        .insert(users)
        .values({
          id: uuidv7(),
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          passwordHash,
        })
        .returning();
    } catch (error) {
      if (error.code === '23505') return sendError(response, 409, 'EMAIL_ALREADY_REGISTERED', 'An account with this email already exists.');
      throw error;
    }

    const existingSchoolRows = await db
      .select({ schoolId: schoolOwnerships.schoolId })
      .from(schoolOwnerships)
      .where(sql`lower(${schoolOwnerships.schoolAdminEmail}) = ${user.email}`);
    const existingSchoolIds = [...new Set(existingSchoolRows.map(({ schoolId }) => schoolId))];
    if (existingSchoolIds.length) {
      await db.insert(schoolUserMemberships).values(
        existingSchoolIds.map((schoolId) => ({
          id: uuidv7(),
          userId: user.id,
          schoolId,
        })),
      );
    }
    await issueCode(db, user, 'email_verification');
    response.status(201).json({
      data: { email: user.email },
      message: 'Check your email for a verification code.',
    });
  }));

  router.post(
    '/login',
    rateLimiters.loginPerIp,
    rateLimiters.loginPerIdentifier,
    rateLimiters.loginFailedAttempts,
    asyncRoute(async (request, response) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) return validationError(response, parsed);
    const db = resolveDb();
    if (!db) return sendError(response, 503, 'DATABASE_NOT_CONFIGURED', 'Authentication is unavailable until the database is configured.');

    const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    const validPassword = user && await argon2.verify(user.passwordHash, parsed.data.password);
    if (!validPassword) return sendError(response, 401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
    if (!user.emailVerifiedAt) {
      await issueCode(db, user, 'email_verification');
      return sendError(response, 403, 'EMAIL_NOT_VERIFIED', 'Verify your email using the code we just sent.');
    }

    await createSession(db, user, response);
    response.json({ data: { user: publicUser(user) } });
    }),
  );

  router.post('/verify-email', rateLimiters.otpPerUser, asyncRoute(async (request, response) => {
    const parsed = emailCodeSchema.safeParse(request.body);
    if (!parsed.success) return validationError(response, parsed);
    const db = resolveDb();
    if (!db) return sendError(response, 503, 'DATABASE_NOT_CONFIGURED', 'Authentication is unavailable until the database is configured.');
    const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    if (!user) return sendError(response, 400, 'INVALID_VERIFICATION_CODE', 'The verification code is invalid or expired.');
    if (user.emailVerifiedAt) return response.json({ data: { email: user.email }, message: 'Email address is already verified.' });

    const consumed = await findAndConsumeCode(db, user.id, 'email_verification', parsed.data.code);
    if (!consumed) return sendError(response, 400, 'INVALID_VERIFICATION_CODE', 'The verification code is invalid or expired.');
    const [verified] = await db
      .update(users)
      .set({ emailVerifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();
    response.json({ data: { email: verified.email }, message: 'Email verified. You can now sign in.' });
  }));

  router.post('/resend-code', rateLimiters.otpPerUser, rateLimiters.otpResendsPerUser, asyncRoute(async (request, response) => {
    const parsed = z.object({ email: emailSchema, purpose: z.enum(['email_verification', 'password_reset']) }).safeParse(request.body);
    if (!parsed.success) return validationError(response, parsed);
    assertAuthenticationEmailConfigured();
    const db = resolveDb();
    if (!db) return sendError(response, 503, 'DATABASE_NOT_CONFIGURED', 'Authentication is unavailable until the database is configured.');
    const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    if (user && (parsed.data.purpose === 'password_reset' || !user.emailVerifiedAt)) {
      await issueCode(db, user, parsed.data.purpose);
    }
    response.json({ message: 'If an eligible account exists, a new code has been sent.' });
  }));

  router.post('/forgot-password', rateLimiters.otpPerUser, rateLimiters.otpResendsPerUser, asyncRoute(async (request, response) => {
    const parsed = z.object({ email: emailSchema }).safeParse(request.body);
    if (!parsed.success) return validationError(response, parsed);
    assertAuthenticationEmailConfigured();
    const db = resolveDb();
    if (!db) return sendError(response, 503, 'DATABASE_NOT_CONFIGURED', 'Authentication is unavailable until the database is configured.');
    const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    if (user) await issueCode(db, user, 'password_reset');
    response.json({ message: 'If an account exists for this email, password reset instructions have been sent.' });
  }));

  router.post('/reset-password', rateLimiters.otpPerUser, asyncRoute(async (request, response) => {
    const parsed = resetPasswordSchema.safeParse(request.body);
    if (!parsed.success) return validationError(response, parsed);
    const db = resolveDb();
    if (!db) return sendError(response, 503, 'DATABASE_NOT_CONFIGURED', 'Authentication is unavailable until the database is configured.');
    const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    if (!user || !(await findAndConsumeCode(db, user.id, 'password_reset', parsed.data.code))) {
      return sendError(response, 400, 'INVALID_RESET_CODE', 'The reset code is invalid or expired.');
    }
    const passwordHash = await argon2.hash(parsed.data.password, { type: argon2.argon2id });
    await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));
    await db.delete(authSessions).where(eq(authSessions.userId, user.id));
    response.clearCookie(sessionCookieName, cookieOptions());
    response.json({ message: 'Password updated. Sign in with your new password.' });
  }));

  router.get('/me', requireAuthentication, (request, response) => {
    response.json({ data: { user: publicUser(request.auth.user) } });
  });

  router.post('/logout', asyncRoute(async (request, response) => {
    const rawToken = parseCookies(request.headers.cookie)[sessionCookieName];
    if (rawToken) {
      const db = resolveDb();
      if (db) await db.delete(authSessions).where(eq(authSessions.tokenHash, sha256(rawToken)));
    }
    response.clearCookie(sessionCookieName, cookieOptions());
    response.status(204).end();
  }));

  router.post('/change-password', requireAuthentication, asyncRoute(async (request, response) => {
    const parsed = changePasswordSchema.safeParse(request.body);
    if (!parsed.success) return validationError(response, parsed);
    const { user, sessionId } = request.auth;
    const validPassword = await argon2.verify(user.passwordHash, parsed.data.currentPassword);
    if (!validPassword) return sendError(response, 400, 'INVALID_CURRENT_PASSWORD', 'Current password is incorrect.');
    if (parsed.data.currentPassword === parsed.data.newPassword) {
      return sendError(response, 400, 'PASSWORD_UNCHANGED', 'Choose a password different from your current password.');
    }
    const passwordHash = await argon2.hash(parsed.data.newPassword, { type: argon2.argon2id });
    await request.authDb.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));
    await request.authDb
      .delete(authSessions)
      .where(and(eq(authSessions.userId, user.id), ne(authSessions.id, sessionId)));
    response.json({ data: { user: publicUser({ ...user, passwordHash }) }, message: 'Password updated.' });
  }));

  router.post('/resend-verification', rateLimiters.otpPerUser, rateLimiters.otpResendsPerUser, asyncRoute(async (request, response) => {
    const parsed = z.object({ email: emailSchema }).safeParse(request.body);
    if (!parsed.success) return validationError(response, parsed);
    assertAuthenticationEmailConfigured();
    const db = resolveDb();
    if (!db) return sendError(response, 503, 'DATABASE_NOT_CONFIGURED', 'Authentication is unavailable until the database is configured.');
    const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    if (user && !user.emailVerifiedAt) await issueCode(db, user, 'email_verification');
    response.json({ message: 'If an unverified account exists for this email, a verification code has been sent.' });
  }));

  router.use((error, _request, response, next) => {
    logger?.error({ err: error }, 'Authentication route failed');
    next(error);
  });

  return router;
}

export { sessionCookieName };
