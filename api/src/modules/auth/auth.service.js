import argon2 from "argon2";
import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import {
  and,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  ilike,
  isNotNull,
  isNull,
  lt,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { getDatabase } from "../../db/client.js";
import {
  parentStudents,
  parents,
  passwordResetOtps,
  refreshSessions,
  schools,
  staff,
  staffModuleAccess,
  students,
  teachers,
  users,
  userPasswordHistory,
} from "../../db/schema.js";
import { env } from "../../config/env.js";
import { recordAudit } from "../../shared/audit.js";
import {
  assertAuthenticationEmailConfigured,
  sendAuthenticationCode,
  sendLoginOtp,
  sendPasswordResetOtp,
} from "../../shared/email.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
} from "../../shared/errors/AppError.js";

const hashToken = (token) => createHash("sha256").update(token).digest("hex");
const db = () => getDatabase();
const PASSWORD_HISTORY_LIMIT = 5;

export function hashOtp(otp) {
  return createHmac("sha256", env.AUTH_OTP_PEPPER ?? env.JWT_PRIVATE_KEY)
    .update(otp)
    .digest("hex");
}

function verifyOtpHash(storedHash, otp) {
  if (!/^[a-f\d]{64}$/i.test(storedHash)) return false;

  const stored = Buffer.from(storedHash, "hex");
  return [hashOtp(otp), hashToken(otp)].some((candidate) =>
    timingSafeEqual(stored, Buffer.from(candidate, "hex")),
  );
}

export async function matchesPasswordHash(password, passwordHashes) {
  for (const passwordHash of passwordHashes) {
    if (await argon2.verify(passwordHash, password)) return true;
  }
  return false;
}

async function assertPasswordIsNotRecent(client, user, newPassword) {
  const history = await client
    .select({ passwordHash: userPasswordHistory.passwordHash })
    .from(userPasswordHistory)
    .where(eq(userPasswordHistory.userId, user.id))
    .orderBy(desc(userPasswordHistory.createdAt))
    .limit(PASSWORD_HISTORY_LIMIT);
  if (
    await matchesPasswordHash(newPassword, [
      user.passwordHash,
      ...history.map(({ passwordHash }) => passwordHash),
    ])
  ) {
    throw new BadRequestError(
      "You cannot reuse your current or any of your last five passwords.",
    );
  }
}

async function storePreviousPassword(client, userId, passwordHash) {
  await client.insert(userPasswordHistory).values({
    id: randomUUID(),
    userId,
    passwordHash,
  });
  const expiredEntries = await client
    .select({ id: userPasswordHistory.id })
    .from(userPasswordHistory)
    .where(eq(userPasswordHistory.userId, userId))
    .orderBy(desc(userPasswordHistory.createdAt))
    .offset(PASSWORD_HISTORY_LIMIT);
  if (expiredEntries.length) {
    await client.delete(userPasswordHistory).where(
      inArray(
        userPasswordHistory.id,
        expiredEntries.map(({ id }) => id),
      ),
    );
  }
}

export function isImpersonationTargetEligible(user, nodeEnv = env.NODE_ENV) {
  if (!user?.isActive || user.role === "SUPER_ADMIN") return false;
  if (nodeEnv === "production") {
    return ["TEACHER", "PARENT", "STUDENT"].includes(user.role);
  }
  return true;
}

async function activeSchool(dbClient, schoolId) {
  if (!schoolId) return true;
  const [school] = await dbClient
    .select({ isActive: schools.isActive })
    .from(schools)
    .where(eq(schools.id, schoolId))
    .limit(1);
  return Boolean(school?.isActive);
}

async function getChallenge(dbClient, conditions) {
  const [challenge] = await dbClient
    .select()
    .from(passwordResetOtps)
    .where(conditions)
    .limit(1);
  return challenge;
}

async function issueEmailVerificationCode(user) {
  const otp = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + env.LOGIN_OTP_MINUTES * 60000);
  const [challenge] = await db().transaction(async (tx) => {
    await tx
      .update(passwordResetOtps)
      .set({ consumedAt: new Date() })
      .where(
        and(
          eq(passwordResetOtps.userId, user.id),
          eq(passwordResetOtps.purpose, "EMAIL_VERIFICATION"),
          isNull(passwordResetOtps.consumedAt),
        ),
      );
    return tx
      .insert(passwordResetOtps)
      .values({
        id: randomUUID(),
        userId: user.id,
        codeHash: hashOtp(otp),
        purpose: "EMAIL_VERIFICATION",
        expiresAt,
      })
      .returning();
  });

  try {
    await sendAuthenticationCode({
      email: user.email,
      fullName: user.fullName,
      code: otp,
      purpose: "email_verification",
    });
  } catch (error) {
    await db()
      .update(passwordResetOtps)
      .set({ consumedAt: new Date() })
      .where(
        and(
          eq(passwordResetOtps.id, challenge.id),
          isNull(passwordResetOtps.consumedAt),
        ),
      );
    throw error;
  }
}

async function registerFailedAttempt(
  user,
  reason,
  { ipAddress, userAgent } = {},
) {
  await recordAudit({
    action: "AUTH_LOGIN_FAILED",
    actorId: user?.id ?? null,
    schoolId: user?.schoolId ?? null,
    entityType: "User",
    entityId: user?.id ?? null,
    ipAddress,
    userAgent,
    metadata: { reason },
  });
}

export class AuthService {
  static async register({ fullName, email, password }) {
    assertAuthenticationEmailConfigured();
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    let user;
    try {
      [user] = await db()
        .insert(users)
        .values({
          id: randomUUID(),
          fullName,
          email,
          passwordHash,
        })
        .returning();
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictError("An account with this email already exists.");
      }
      throw error;
    }

    await issueEmailVerificationCode(user);
    return { email: user.email };
  }

  static async verifyEmail({ email, code }) {
    const now = new Date();
    const outcome = await db().transaction(async (tx) => {
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .for("update");
      if (!user || !user.isActive) return { invalid: true };
      if (user.emailVerifiedAt) return { verified: true, email: user.email };

      const [challenge] = await tx
        .select()
        .from(passwordResetOtps)
        .where(
          and(
            eq(passwordResetOtps.userId, user.id),
            eq(passwordResetOtps.purpose, "EMAIL_VERIFICATION"),
            isNull(passwordResetOtps.consumedAt),
            gt(passwordResetOtps.expiresAt, now),
          ),
        )
        .orderBy(desc(passwordResetOtps.createdAt))
        .limit(1)
        .for("update");
      if (!challenge || challenge.attempts >= env.OTP_MAX_ATTEMPTS)
        return { invalid: true };
      if (!verifyOtpHash(challenge.codeHash, code)) {
        await tx
          .update(passwordResetOtps)
          .set({ attempts: sql`${passwordResetOtps.attempts} + 1` })
          .where(eq(passwordResetOtps.id, challenge.id));
        return { invalid: true };
      }

      await tx
        .update(passwordResetOtps)
        .set({ consumedAt: now })
        .where(eq(passwordResetOtps.id, challenge.id));
      await tx
        .update(users)
        .set({ emailVerifiedAt: now, updatedAt: now })
        .where(eq(users.id, user.id));
      return { verified: true, email: user.email };
    });

    if (!outcome.verified)
      throw new UnauthorizedError("Invalid or expired verification code");
    return { email: outcome.email };
  }

  static async resendCode({ email, purpose }, options = {}) {
    if (purpose === "email_verification") {
      const [user] = await db()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (user?.isActive && !user.emailVerifiedAt) {
        assertAuthenticationEmailConfigured();
        await issueEmailVerificationCode(user);
      }
      return;
    }
    await this.forgotPassword(email, options);
  }

  static hashToken(token) {
    return hashToken(token);
  }

  static signAccessToken(user, sessionId, extraClaims = {}) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        sessionId,
        ...extraClaims,
      },
      env.JWT_PRIVATE_KEY,
      {
        algorithm: "RS256",
        expiresIn: env.JWT_EXPIRES_IN,
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      },
    );
  }

  static async createRefreshSession(
    userId,
    {
      ipAddress,
      userAgent,
      familyId = randomUUID(),
      isImpersonated = false,
      impersonatedUserId = null,
      actorSessionId = null,
    } = {},
    client = db(),
  ) {
    const refreshToken = randomUUID() + randomUUID();
    await client.insert(refreshSessions).values({
      id: randomUUID(),
      userId,
      tokenHash: hashToken(refreshToken),
      familyId,
      expiresAt: new Date(
        Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 86400000,
      ),
      isImpersonated,
      impersonatedUserId,
      actorSessionId,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    });
    return refreshToken;
  }

  static async issueTokens(
    user,
    {
      ipAddress,
      userAgent,
      isImpersonated = false,
      targetUserId = null,
      actorId = null,
      actorSessionId = null,
      refreshUserId = user.id,
    } = {},
    client = db(),
  ) {
    const sessionId = randomUUID();
    if (!isImpersonated) {
      await client
        .update(refreshSessions)
        .set({ revokedAt: new Date(), updatedAt: new Date() })
        .where(
          and(
            eq(refreshSessions.userId, refreshUserId),
            isNull(refreshSessions.revokedAt),
          ),
        );
    }
    const refreshToken = await this.createRefreshSession(
      refreshUserId,
      {
        ipAddress,
        userAgent,
        isImpersonated,
        impersonatedUserId: targetUserId,
        actorSessionId,
      },
      client,
    );
    if (!isImpersonated) {
      await client
        .update(users)
        .set({ currentSessionId: sessionId })
        .where(eq(users.id, user.id));
    }
    return {
      accessToken: this.signAccessToken(user, sessionId, {
        isImpersonated,
        ...(targetUserId ? { targetUserId } : {}),
        ...(actorId ? { actorId } : {}),
        ...(actorSessionId ? { actorSessionId } : {}),
      }),
      refreshToken,
    };
  }

  static async login({ email, password, userAgent, ipAddress }) {
    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) {
      await registerFailedAttempt(null, "invalid_credentials", {
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedError("Invalid email or password");
    }
    if (!user.isActive) {
      await registerFailedAttempt(user, "inactive_account", {
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedError(
        "Your account has been deactivated. Contact your administrator.",
      );
    }
    if (!(await activeSchool(db(), user.schoolId))) {
      await registerFailedAttempt(user, "inactive_school", {
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedError(
        "The school account associated with your user profile is inactive.",
      );
    }
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await registerFailedAttempt(user, "account_locked", {
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedError("Invalid email or password");
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      const failedLoginAttempts = user.failedLoginAttempts + 1;
      const lockedUntil =
        failedLoginAttempts >= env.LOGIN_MAX_ATTEMPTS
          ? new Date(Date.now() + env.LOGIN_LOCKOUT_MINUTES * 60000)
          : null;
      await db()
        .update(users)
        .set({ failedLoginAttempts, lockedUntil })
        .where(eq(users.id, user.id));
      await recordAudit({
        action: lockedUntil ? "ACCOUNT_LOCKED" : "AUTH_LOGIN_FAILED",
        actorId: user.id,
        schoolId: user.schoolId,
        entityType: "User",
        entityId: user.id,
        ipAddress,
        userAgent,
        metadata: { reason: "invalid_credentials", failedLoginAttempts },
      });
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.emailVerifiedAt) {
      assertAuthenticationEmailConfigured();
      await issueEmailVerificationCode(user);
      throw new ForbiddenError(
        "Verify your email using the code we just sent.",
        {
          code: "EMAIL_NOT_VERIFIED",
        },
      );
    }

    const otp = String(randomInt(100000, 1000000));
    const challengeToken = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + env.LOGIN_OTP_MINUTES * 60000);
    const [challenge] = await db().transaction(async (tx) => {
      await tx
        .update(passwordResetOtps)
        .set({ consumedAt: new Date() })
        .where(
          and(
            eq(passwordResetOtps.userId, user.id),
            eq(passwordResetOtps.purpose, "LOGIN"),
            isNull(passwordResetOtps.consumedAt),
          ),
        );
      return tx
        .insert(passwordResetOtps)
        .values({
          id: randomUUID(),
          userId: user.id,
          codeHash: hashOtp(otp),
          challengeTokenHash: hashToken(challengeToken),
          purpose: "LOGIN",
          expiresAt,
        })
        .returning();
    });
    try {
      await sendLoginOtp({ to: user.email, otp });
    } catch (error) {
      await db()
        .update(passwordResetOtps)
        .set({ consumedAt: new Date() })
        .where(
          and(
            eq(passwordResetOtps.id, challenge.id),
            isNull(passwordResetOtps.consumedAt),
          ),
        );
      throw error;
    }

    await recordAudit({
      action: "AUTH_LOGIN_SUCCESS",
      actorId: user.id,
      schoolId: user.schoolId,
      entityType: "User",
      entityId: user.id,
      ipAddress,
      userAgent,
      metadata: { stage: "credentials_validated", otpRequired: true },
    });
    return {
      requiresOtp: true,
      challengeToken,
      email: user.email,
      expiresAt: challenge.expiresAt.toISOString(),
    };
  }

  static async verifyLoginOtp(
    { challengeToken, otp },
    { ipAddress, userAgent } = {},
  ) {
    const now = new Date();
    const challenge = await getChallenge(
      db(),
      and(
        eq(passwordResetOtps.challengeTokenHash, hashToken(challengeToken)),
        eq(passwordResetOtps.purpose, "LOGIN"),
        isNull(passwordResetOtps.consumedAt),
        gt(passwordResetOtps.expiresAt, now),
      ),
    );
    if (!challenge || challenge.attempts >= env.OTP_MAX_ATTEMPTS) {
      throw new UnauthorizedError("Invalid or expired login verification code");
    }

    const result = await db().transaction(async (tx) => {
      const [attempt] = await tx
        .update(passwordResetOtps)
        .set({ attempts: sql`${passwordResetOtps.attempts} + 1` })
        .where(
          and(
            eq(passwordResetOtps.id, challenge.id),
            isNull(passwordResetOtps.consumedAt),
            gt(passwordResetOtps.expiresAt, now),
            lt(passwordResetOtps.attempts, env.OTP_MAX_ATTEMPTS),
          ),
        )
        .returning();
      if (!attempt || !verifyOtpHash(attempt.codeHash, otp)) return null;
      const [consumed] = await tx
        .update(passwordResetOtps)
        .set({ consumedAt: now })
        .where(
          and(
            eq(passwordResetOtps.id, challenge.id),
            eq(passwordResetOtps.codeHash, attempt.codeHash),
            isNull(passwordResetOtps.consumedAt),
          ),
        )
        .returning({ id: passwordResetOtps.id });
      if (!consumed) return null;

      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, challenge.userId))
        .limit(1);
      if (!user?.isActive) {
        throw new UnauthorizedError(
          "Your account has been deactivated. Contact your administrator.",
        );
      }
      if (!(await activeSchool(tx, user.schoolId))) {
        throw new UnauthorizedError(
          "The school account associated with your user profile is inactive.",
        );
      }
      await tx
        .update(users)
        .set({
          lastLoginAt: now,
          lastLoginIp: ipAddress ?? null,
          failedLoginAttempts: 0,
          lockedUntil: null,
        })
        .where(eq(users.id, user.id));
      const tokens = await this.issueTokens(user, { ipAddress, userAgent }, tx);
      return { user, tokens };
    });
    if (!result)
      throw new UnauthorizedError("Invalid or expired login verification code");

    await recordAudit({
      action: "AUTH_LOGIN_SUCCESS",
      actorId: result.user.id,
      schoolId: result.user.schoolId,
      entityType: "User",
      entityId: result.user.id,
      ipAddress,
      userAgent,
    });
    return {
      ...result.tokens,
      requiresPasswordReset: result.user.mustChangePassword,
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
        schoolId: result.user.schoolId,
      },
    };
  }

  static async resendLoginOtp(challengeToken, { ipAddress, userAgent } = {}) {
    const tokenHash = hashToken(challengeToken);
    const now = new Date();
    const resendWindowStart = new Date(
      Date.now() - env.OTP_RESEND_WINDOW_MINUTES * 60000,
    );
    const [challenge] = await db()
      .select({ challenge: passwordResetOtps, user: users })
      .from(passwordResetOtps)
      .innerJoin(users, eq(passwordResetOtps.userId, users.id))
      .where(
        and(
          eq(passwordResetOtps.challengeTokenHash, tokenHash),
          eq(passwordResetOtps.purpose, "LOGIN"),
        ),
      )
      .limit(1);
    const user = challenge?.user;
    const otpChallenge = challenge?.challenge;
    if (
      !otpChallenge ||
      otpChallenge.createdAt < resendWindowStart ||
      !user?.isActive ||
      !(await activeSchool(db(), user.schoolId))
    ) {
      throw new UnauthorizedError("Unable to resend login verification code");
    }

    const otp = String(randomInt(100000, 1000000));
    const nextChallengeToken = randomBytes(32).toString("base64url");
    const rotated = await db().transaction(async (tx) => {
      const [{ resendCount }] = await tx
        .select({ resendCount: count() })
        .from(passwordResetOtps)
        .where(
          and(
            eq(passwordResetOtps.userId, user.id),
            eq(passwordResetOtps.purpose, "LOGIN"),
            eq(passwordResetOtps.isResend, true),
            gte(passwordResetOtps.createdAt, resendWindowStart),
          ),
        );
      if (Number(resendCount) >= env.OTP_RESEND_LIMIT) return { limited: true };
      if (!otpChallenge.consumedAt) {
        const [claimed] = await tx
          .update(passwordResetOtps)
          .set({ consumedAt: now })
          .where(
            and(
              eq(passwordResetOtps.id, otpChallenge.id),
              eq(passwordResetOtps.challengeTokenHash, tokenHash),
              isNull(passwordResetOtps.consumedAt),
            ),
          )
          .returning({ id: passwordResetOtps.id });
        if (!claimed) return null;
      }
      const [nextChallenge] = await tx
        .insert(passwordResetOtps)
        .values({
          id: randomUUID(),
          userId: user.id,
          codeHash: hashOtp(otp),
          challengeTokenHash: hashToken(nextChallengeToken),
          purpose: "LOGIN",
          isResend: true,
          expiresAt: new Date(Date.now() + env.LOGIN_OTP_MINUTES * 60000),
        })
        .returning();
      return { challenge: nextChallenge };
    });
    if (rotated?.limited)
      throw new RateLimitError("Too many OTP resends. Try again later.");
    if (!rotated)
      throw new UnauthorizedError("Unable to resend login verification code");
    try {
      await sendLoginOtp({ to: user.email, otp });
    } catch (error) {
      await db()
        .update(passwordResetOtps)
        .set({ consumedAt: new Date() })
        .where(
          and(
            eq(passwordResetOtps.id, rotated.challenge.id),
            isNull(passwordResetOtps.consumedAt),
          ),
        );
      throw error;
    }
    await recordAudit({
      action: "AUTH_LOGIN_SUCCESS",
      actorId: user.id,
      schoolId: user.schoolId,
      entityType: "User",
      entityId: user.id,
      ipAddress,
      userAgent,
      metadata: { stage: "otp_resent" },
    });
    return {
      challengeToken: nextChallengeToken,
      expiresAt: rotated.challenge.expiresAt.toISOString(),
    };
  }

  static async logout(
    userId,
    {
      ipAddress,
      userAgent,
      refreshToken,
      isImpersonated = false,
      actorId = null,
    } = {},
  ) {
    const sessionUserId = isImpersonated && actorId ? actorId : userId;
    const [user] = await db()
      .update(users)
      .set({ currentSessionId: null })
      .where(eq(users.id, sessionUserId))
      .returning({ id: users.id, schoolId: users.schoolId });
    if (!user) throw new NotFoundError("User profile not found");
    if (refreshToken) {
      await db()
        .update(refreshSessions)
        .set({ revokedAt: new Date(), updatedAt: new Date() })
        .where(
          and(
            eq(refreshSessions.userId, sessionUserId),
            eq(refreshSessions.tokenHash, hashToken(refreshToken)),
            isNull(refreshSessions.revokedAt),
          ),
        );
    }
    await recordAudit({
      action: "AUTH_LOGOUT",
      actorId: isImpersonated && actorId ? actorId : user.id,
      schoolId: user.schoolId,
      entityType: "User",
      entityId: userId,
      ipAddress,
      userAgent,
      metadata: isImpersonated ? { impersonatedUserId: userId } : null,
    });
    return { message: "Logged out successfully" };
  }

  static async changePassword(
    userId,
    { currentPassword, newPassword, ipAddress, userAgent },
  ) {
    const outcome = await db().transaction(async (tx) => {
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .for("update");
      if (!user) return { notFound: true };
      if (!(await argon2.verify(user.passwordHash, currentPassword))) {
        return { invalidCurrentPassword: true };
      }
      await assertPasswordIsNotRecent(tx, user, newPassword);
      const now = new Date();
      await storePreviousPassword(tx, user.id, user.passwordHash);
      const passwordHash = await argon2.hash(newPassword, {
        type: argon2.argon2id,
      });
      await tx
        .update(users)
        .set({
          passwordHash,
          currentSessionId: null,
          mustChangePassword: false,
        })
        .where(eq(users.id, userId));
      await tx
        .update(refreshSessions)
        .set({ revokedAt: now, updatedAt: now })
        .where(
          and(
            eq(refreshSessions.userId, userId),
            isNull(refreshSessions.revokedAt),
          ),
        );
      return { changed: true };
    });
    if (outcome.notFound) throw new NotFoundError("User profile not found");
    if (outcome.invalidCurrentPassword) {
      await recordAudit({
        action: "PASSWORD_CHANGE_FAILED",
        actorId: userId,
        entityType: "User",
        entityId: userId,
        ipAddress,
        userAgent,
        metadata: { reason: "invalid_current_password" },
      });
      throw new UnauthorizedError("Current password is incorrect");
    }
    await recordAudit({
      action: "PASSWORD_CHANGED",
      actorId: userId,
      entityType: "User",
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  static async revokeRefreshFamily(session, { ipAddress, userAgent } = {}) {
    const reusedAt = new Date();
    await db().transaction(async (tx) => {
      await tx
        .update(refreshSessions)
        .set({ revokedAt: reusedAt, reusedAt, updatedAt: reusedAt })
        .where(
          and(
            eq(refreshSessions.familyId, session.familyId),
            isNull(refreshSessions.revokedAt),
          ),
        );
      await tx
        .update(refreshSessions)
        .set({ revokedAt: reusedAt, updatedAt: reusedAt })
        .where(
          and(
            eq(refreshSessions.userId, session.userId),
            isNull(refreshSessions.revokedAt),
            ne(refreshSessions.familyId, session.familyId),
          ),
        );
      await tx
        .update(users)
        .set({ currentSessionId: null })
        .where(eq(users.id, session.userId));
    });
    await recordAudit({
      action: "AUTH_REFRESH_TOKEN_REUSE",
      actorId: session.userId,
      schoolId: session.user.schoolId,
      entityType: "RefreshSession",
      entityId: session.id,
      ipAddress,
      userAgent,
      metadata: {
        familyId: session.familyId,
        replacedById: session.replacedById,
      },
    });
    throw new UnauthorizedError(
      "Refresh token reuse detected; all sessions were revoked",
    );
  }

  static async refresh(refreshToken, { ipAddress, userAgent } = {}) {
    const tokenHash = hashToken(refreshToken);
    const [row] = await db()
      .select({ session: refreshSessions, user: users })
      .from(refreshSessions)
      .innerJoin(users, eq(refreshSessions.userId, users.id))
      .where(eq(refreshSessions.tokenHash, tokenHash))
      .limit(1);
    if (!row)
      throw new UnauthorizedError("Refresh token is invalid or expired");
    const session = { ...row.session, user: row.user };
    if (session.revokedAt)
      return this.revokeRefreshFamily(session, { ipAddress, userAgent });
    const now = new Date();
    if (session.expiresAt <= now || !session.user.isActive) {
      throw new UnauthorizedError("Refresh token is invalid or expired");
    }

    const nextRefreshToken = randomUUID() + randomUUID();
    const nextTokenHash = hashToken(nextRefreshToken);
    const accessSessionId = randomUUID();
    const rotated = await db().transaction(async (tx) => {
      const [actor] = await tx
        .select()
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);
      if (!actor?.isActive || !actor.currentSessionId) return { invalid: true };
      let tokenUser = actor;
      if (session.isImpersonated) {
        if (
          !session.impersonatedUserId ||
          !session.actorSessionId ||
          actor.currentSessionId !== session.actorSessionId ||
          !["ADMIN", "SUPER_ADMIN"].includes(actor.role)
        ) {
          return { invalid: true };
        }
        const [target] = await tx
          .select()
          .from(users)
          .where(eq(users.id, session.impersonatedUserId))
          .limit(1);
        if (
          !target?.isActive ||
          !isImpersonationTargetEligible(target) ||
          !(await activeSchool(tx, target.schoolId)) ||
          (actor.role !== "SUPER_ADMIN" && target.schoolId !== actor.schoolId)
        ) {
          return { invalid: true };
        }
        tokenUser = target;
      } else if (!(await activeSchool(tx, actor.schoolId))) {
        return { invalid: true };
      }
      const [claim] = await tx
        .update(refreshSessions)
        .set({ revokedAt: now, replacedById: nextTokenHash, updatedAt: now })
        .where(
          and(
            eq(refreshSessions.id, session.id),
            eq(refreshSessions.tokenHash, tokenHash),
            isNull(refreshSessions.revokedAt),
            gt(refreshSessions.expiresAt, now),
          ),
        )
        .returning({ id: refreshSessions.id });
      if (!claim) return { reused: true };
      await tx.insert(refreshSessions).values({
        id: randomUUID(),
        userId: session.userId,
        tokenHash: nextTokenHash,
        familyId: session.familyId,
        expiresAt: new Date(
          now.getTime() + env.REFRESH_TOKEN_EXPIRES_DAYS * 86400000,
        ),
        isImpersonated: session.isImpersonated,
        impersonatedUserId: session.impersonatedUserId,
        actorSessionId: session.actorSessionId,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      });
      if (!session.isImpersonated) {
        await tx
          .update(users)
          .set({ currentSessionId: accessSessionId })
          .where(eq(users.id, session.userId));
      }
      return { tokenUser };
    });
    if (rotated?.reused)
      return this.revokeRefreshFamily(session, { ipAddress, userAgent });
    if (rotated?.invalid)
      throw new UnauthorizedError("Refresh token is invalid or expired");

    const claims = session.isImpersonated
      ? {
          isImpersonated: true,
          targetUserId: session.impersonatedUserId,
          actorId: session.userId,
          actorSessionId: session.actorSessionId,
        }
      : {};
    return {
      accessToken: this.signAccessToken(
        rotated.tokenUser,
        accessSessionId,
        claims,
      ),
      refreshToken: nextRefreshToken,
    };
  }

  static async forgotPassword(email, { ipAddress, userAgent } = {}) {
    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) return;
    const otp = String(randomInt(100000, 1000000));
    const [challenge] = await db().transaction(async (tx) => {
      await tx
        .update(passwordResetOtps)
        .set({ consumedAt: new Date() })
        .where(
          and(
            eq(passwordResetOtps.userId, user.id),
            eq(passwordResetOtps.purpose, "PASSWORD_RESET"),
            isNull(passwordResetOtps.consumedAt),
          ),
        );
      return tx
        .insert(passwordResetOtps)
        .values({
          id: randomUUID(),
          userId: user.id,
          codeHash: hashOtp(otp),
          purpose: "PASSWORD_RESET",
          expiresAt: new Date(
            Date.now() + env.PASSWORD_RESET_OTP_MINUTES * 60000,
          ),
        })
        .returning();
    });
    try {
      await sendPasswordResetOtp({ to: user.email, otp });
    } catch (error) {
      await db()
        .update(passwordResetOtps)
        .set({ consumedAt: new Date() })
        .where(
          and(
            eq(passwordResetOtps.id, challenge.id),
            isNull(passwordResetOtps.consumedAt),
          ),
        );
      throw error;
    }
    await recordAudit({
      action: "AUTH_LOGIN_FAILED",
      actorId: user.id,
      schoolId: user.schoolId,
      entityType: "PasswordReset",
      ipAddress,
      userAgent,
      metadata: { reason: "otp_requested" },
    });
  }

  static async resetPassword(
    { email, otp, newPassword },
    { ipAddress, userAgent } = {},
  ) {
    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!user) throw new UnauthorizedError("Invalid or expired reset code");
    const now = new Date();
    const reset = await getChallenge(
      db(),
      and(
        eq(passwordResetOtps.userId, user.id),
        eq(passwordResetOtps.purpose, "PASSWORD_RESET"),
        isNull(passwordResetOtps.consumedAt),
        gt(passwordResetOtps.expiresAt, now),
      ),
    );
    if (!reset || reset.attempts >= 5 || !verifyOtpHash(reset.codeHash, otp)) {
      if (reset) {
        await db()
          .update(passwordResetOtps)
          .set({ attempts: sql`${passwordResetOtps.attempts} + 1` })
          .where(
            and(
              eq(passwordResetOtps.id, reset.id),
              isNull(passwordResetOtps.consumedAt),
              gt(passwordResetOtps.expiresAt, now),
              lt(passwordResetOtps.attempts, 5),
            ),
          );
      }
      throw new UnauthorizedError("Invalid or expired reset code");
    }
    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });
    const outcome = await db().transaction(async (tx) => {
      const [lockedUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1)
        .for("update");
      if (!lockedUser) return { claimed: false };
      const [claim] = await tx
        .update(passwordResetOtps)
        .set({ consumedAt: now })
        .where(
          and(
            eq(passwordResetOtps.id, reset.id),
            eq(passwordResetOtps.codeHash, reset.codeHash),
            isNull(passwordResetOtps.consumedAt),
            gt(passwordResetOtps.expiresAt, now),
            lt(passwordResetOtps.attempts, 5),
          ),
        )
        .returning({ id: passwordResetOtps.id });
      if (!claim) return { claimed: false };
      await assertPasswordIsNotRecent(tx, lockedUser, newPassword);
      await storePreviousPassword(tx, lockedUser.id, lockedUser.passwordHash);
      await tx
        .update(users)
        .set({
          passwordHash,
          currentSessionId: null,
          mustChangePassword: false,
        })
        .where(eq(users.id, lockedUser.id));
      await tx
        .update(refreshSessions)
        .set({ revokedAt: now, updatedAt: now })
        .where(
          and(
            eq(refreshSessions.userId, lockedUser.id),
            isNull(refreshSessions.revokedAt),
          ),
        );
      return { claimed: true, user: lockedUser };
    });
    if (!outcome.claimed)
      throw new UnauthorizedError("Invalid or expired reset code");
    await recordAudit({
      action: "PASSWORD_CHANGED",
      actorId: outcome.user.id,
      schoolId: outcome.user.schoolId,
      entityType: "User",
      entityId: outcome.user.id,
      ipAddress,
      userAgent,
      metadata: { method: "otp" },
    });
  }

  static async verifyOtp({ email, otp }) {
    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const now = new Date();
    const reset = user
      ? await getChallenge(
          db(),
          and(
            eq(passwordResetOtps.userId, user.id),
            eq(passwordResetOtps.purpose, "PASSWORD_RESET"),
            isNull(passwordResetOtps.consumedAt),
            gt(passwordResetOtps.expiresAt, now),
          ),
        )
      : null;
    if (!reset || reset.attempts >= 5 || !verifyOtpHash(reset.codeHash, otp)) {
      if (reset) {
        await db()
          .update(passwordResetOtps)
          .set({ attempts: sql`${passwordResetOtps.attempts} + 1` })
          .where(
            and(
              eq(passwordResetOtps.id, reset.id),
              isNull(passwordResetOtps.consumedAt),
              gt(passwordResetOtps.expiresAt, now),
              lt(passwordResetOtps.attempts, 5),
            ),
          );
      }
      throw new UnauthorizedError("Invalid or expired reset code");
    }
  }

  static async listUsers({
    schoolId,
    role,
    search,
    branchId,
    page = 1,
    pageSize = 50,
  }) {
    const filters = [];
    if (schoolId) filters.push(eq(users.schoolId, schoolId));
    if (role) filters.push(eq(users.role, role));
    if (branchId === "unassigned") {
      filters.push(
        or(
          and(
            eq(users.role, "TEACHER"),
            isNotNull(teachers.id),
            isNull(teachers.branchId),
          ),
          and(
            eq(users.role, "STAFF"),
            isNotNull(staff.id),
            isNull(staff.branchId),
          ),
          and(
            eq(users.role, "STUDENT"),
            isNotNull(students.id),
            isNull(students.branchId),
          ),
        ),
      );
    } else if (branchId) {
      filters.push(
        or(
          and(eq(users.role, "TEACHER"), eq(teachers.branchId, branchId)),
          and(eq(users.role, "STAFF"), eq(staff.branchId, branchId)),
          and(eq(users.role, "STUDENT"), eq(students.branchId, branchId)),
        ),
      );
    }
    if (search) {
      const term = `%${search}%`;
      filters.push(
        or(
          ilike(users.fullName, term),
          ilike(users.email, term),
          ilike(users.phone, term),
        ),
      );
    }
    const where = filters.length ? and(...filters) : undefined;
    const [rows, [{ total }]] = await Promise.all([
      db()
        .select({
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          phone: users.phone,
          role: users.role,
          schoolId: users.schoolId,
          isActive: users.isActive,
          mustChangePassword: users.mustChangePassword,
          authProvider: users.authProvider,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .leftJoin(teachers, eq(teachers.userId, users.id))
        .leftJoin(staff, eq(staff.userId, users.id))
        .leftJoin(students, eq(students.userId, users.id))
        .where(where)
        .orderBy(desc(users.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db()
        .select({ total: count() })
        .from(users)
        .leftJoin(teachers, eq(teachers.userId, users.id))
        .leftJoin(staff, eq(staff.userId, users.id))
        .leftJoin(students, eq(students.userId, users.id))
        .where(where),
    ]);
    return {
      users: rows,
      total: Number(total),
      page,
      pageSize,
      totalPages: Math.ceil(Number(total) / pageSize),
    };
  }

  static async googleLogin(idToken, { ipAddress, userAgent } = {}) {
    if (!env.GOOGLE_CLIENT_ID)
      throw new UnauthorizedError("Google login is not configured");
    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified || !payload.sub) {
      throw new UnauthorizedError("Google account is not verified");
    }
    const email = payload.email.toLowerCase();
    const [existing] = await db()
      .select()
      .from(users)
      .where(or(eq(users.googleSubject, payload.sub), eq(users.email, email)))
      .limit(1);
    let user = existing;
    if (!user) {
      const randomPassword = await argon2.hash(randomUUID(), {
        type: argon2.argon2id,
      });
      [user] = await db()
        .insert(users)
        .values({
          id: randomUUID(),
          fullName: payload.name || email.split("@")[0],
          username: `${email.split("@")[0].replace(/[^A-Za-z0-9._-]/g, "")}-${randomUUID().slice(0, 8)}`,
          email,
          passwordHash: randomPassword,
          role: "PARENT",
          authProvider: "GOOGLE",
          googleSubject: payload.sub,
        })
        .returning();
    } else if (!user.googleSubject) {
      [user] = await db()
        .update(users)
        .set({ googleSubject: payload.sub, authProvider: "GOOGLE" })
        .where(eq(users.id, user.id))
        .returning();
    }
    if (!user.isActive)
      throw new UnauthorizedError("User account is deactivated");
    const tokens = await this.issueTokens(user, { ipAddress, userAgent });
    await recordAudit({
      action: "AUTH_LOGIN_SUCCESS",
      actorId: user.id,
      schoolId: user.schoolId,
      entityType: "User",
      entityId: user.id,
      ipAddress,
      userAgent,
      metadata: { provider: "GOOGLE" },
    });
    return {
      ...tokens,
      requiresPasswordReset: false,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
      },
    };
  }

  static async startImpersonation(
    actor,
    targetUserId,
    { ipAddress, userAgent } = {},
  ) {
    const [target] = await db()
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        schoolId: users.schoolId,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);
    if (!isImpersonationTargetEligible(target)) {
      throw new UnauthorizedError(
        "Target user is not eligible for support access",
      );
    }
    if (target.schoolId && !(await activeSchool(db(), target.schoolId))) {
      throw new UnauthorizedError("Target user belongs to an inactive school");
    }
    if (actor.role !== "SUPER_ADMIN" && target.schoolId !== actor.schoolId) {
      throw new UnauthorizedError(
        "Support access is limited to users in your school",
      );
    }
    const tokens = await this.issueTokens(target, {
      ipAddress,
      userAgent,
      isImpersonated: true,
      targetUserId: target.id,
      actorId: actor.id,
      actorSessionId: actor.sessionId,
      refreshUserId: actor.id,
    });
    const [targetSchool] = target.schoolId
      ? await db()
          .select({
            id: schools.id,
            name: schools.schoolName,
            slug: schools.schoolSlug,
          })
          .from(schools)
          .where(eq(schools.id, target.schoolId))
          .limit(1)
      : [];
    await recordAudit({
      action: "IMPERSONATION_STARTED",
      actorId: actor.id,
      schoolId: actor.schoolId,
      entityType: "User",
      entityId: target.id,
      ipAddress,
      userAgent,
      metadata: { targetRole: target.role },
    });
    return { ...tokens, user: { ...target, school: targetSchool ?? null } };
  }

  static async stopImpersonation(actorContext, { ipAddress, userAgent } = {}) {
    if (
      !actorContext.isImpersonated ||
      !actorContext.actorId ||
      !actorContext.actorSessionId
    ) {
      throw new UnauthorizedError("There is no active impersonation session");
    }
    const [actor] = await db()
      .select()
      .from(users)
      .where(eq(users.id, actorContext.actorId))
      .limit(1);
    if (
      !actor?.isActive ||
      !["ADMIN", "SUPER_ADMIN"].includes(actor.role) ||
      actor.currentSessionId !== actorContext.actorSessionId
    ) {
      throw new UnauthorizedError(
        "The original administrator session is no longer valid",
      );
    }
    const tokens = await this.issueTokens(actor, { ipAddress, userAgent });
    await recordAudit({
      action: "IMPERSONATION_ENDED",
      actorId: actor.id,
      schoolId: actorContext.schoolId,
      entityType: "User",
      entityId: actorContext.id,
      ipAddress,
      userAgent,
      metadata: { targetUserId: actorContext.id },
    });
    return {
      ...tokens,
      user: {
        id: actor.id,
        email: actor.email,
        fullName: actor.fullName,
        role: actor.role,
        schoolId: actor.schoolId,
      },
    };
  }

  static async getMe(userId) {
    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) throw new NotFoundError("User profile not found");
    const [school] = user.schoolId
      ? await db()
          .select({
            id: schools.id,
            name: schools.schoolName,
            slug: schools.schoolSlug,
          })
          .from(schools)
          .where(eq(schools.id, user.schoolId))
          .limit(1)
      : [];
    const [teacher] = await db()
      .select()
      .from(teachers)
      .where(eq(teachers.userId, userId))
      .limit(1);
    const [staffProfile] = await db()
      .select()
      .from(staff)
      .where(eq(staff.userId, userId))
      .limit(1);
    const [student] = await db()
      .select()
      .from(students)
      .where(eq(students.userId, userId))
      .limit(1);
    const [parent] = await db()
      .select()
      .from(parents)
      .where(eq(parents.userId, userId))
      .limit(1);
    const accessRows = await db()
      .select({ module: staffModuleAccess.module })
      .from(staffModuleAccess)
      .where(eq(staffModuleAccess.userId, userId));
    const parentStudentRows = parent
      ? await db()
          .select({ student: students })
          .from(parentStudents)
          .innerJoin(students, eq(parentStudents.studentId, students.id))
          .where(eq(parentStudents.parentId, parent.id))
      : [];
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      schoolId: user.schoolId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      school: school ?? null,
      teacher: teacher ?? null,
      staff: staffProfile ?? null,
      student: student ?? null,
      parent: parent
        ? {
            ...parent,
            students: parentStudentRows.map(({ student: child }) => ({
              student: child,
            })),
          }
        : null,
      modulePermissions: accessRows.map(({ module }) => module),
    };
  }

  static async updateMyProfile(
    userId,
    profileData,
    { ipAddress, userAgent } = {},
  ) {
    const updated = await db().transaction(async (tx) => {
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (!user) throw new NotFoundError("User profile not found");
      const nameIsBeingUpdated = ["firstName", "middleName", "lastName"].some(
        (field) => profileData[field] !== undefined,
      );
      const [teacher] = await tx
        .select({ id: teachers.id })
        .from(teachers)
        .where(eq(teachers.userId, userId))
        .limit(1);
      const [staffProfile] = await tx
        .select({ id: staff.id })
        .from(staff)
        .where(eq(staff.userId, userId))
        .limit(1);
      const [student] = await tx
        .select({ id: students.id })
        .from(students)
        .where(eq(students.userId, userId))
        .limit(1);
      const [parent] = await tx
        .select({ id: parents.id })
        .from(parents)
        .where(eq(parents.userId, userId))
        .limit(1);
      const linked = [
        [teachers, teacher],
        [staff, staffProfile],
        [students, student],
        [parents, parent],
      ].filter(([, profile]) => profile);
      if (nameIsBeingUpdated && !linked.length) {
        throw new BadRequestError(
          "This account does not have a linked profile name to edit",
        );
      }
      const userPatch = {};
      if (profileData.phone !== undefined) userPatch.phone = profileData.phone;
      const [userUpdate] = await tx
        .update(users)
        .set(userPatch)
        .where(eq(users.id, userId))
        .returning({ id: users.id, phone: users.phone });
      if (nameIsBeingUpdated) {
        const namePatch = {};
        for (const field of ["firstName", "middleName", "lastName"]) {
          if (profileData[field] !== undefined)
            namePatch[field] = profileData[field] || null;
        }
        for (const [table, profile] of linked) {
          await tx
            .update(table)
            .set({
              ...namePatch,
              ...(table === parents && profileData.phone !== undefined
                ? { phone: profileData.phone }
                : {}),
            })
            .where(eq(table.id, profile.id));
        }
      } else if (parent && profileData.phone !== undefined) {
        await tx
          .update(parents)
          .set({ phone: profileData.phone })
          .where(eq(parents.id, parent.id));
      }
      return userUpdate;
    });
    await recordAudit({
      action: "UPDATE",
      actorId: userId,
      entityType: "User",
      entityId: userId,
      ipAddress,
      userAgent,
      metadata: {
        phoneUpdated: profileData.phone !== undefined,
        nameUpdated: ["firstName", "middleName", "lastName"].some(
          (field) => profileData[field] !== undefined,
        ),
      },
    });
    return updated;
  }
}
