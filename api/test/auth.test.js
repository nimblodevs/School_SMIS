import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createAuthRouter } from '../src/routes/auth.js';
import { assertAuthenticationEmailConfigured } from '../src/services/authEmail.js';

function createApp(resolveDb = () => null) {
  const app = express();
  app.use(express.json());
  app.use('/auth', createAuthRouter({ resolveDb, logger: { error() {} } }));
  return app;
}

describe('authentication endpoints', () => {
  it('limits failed sign-ins using the configured attempt and lockout settings', async () => {
    const keys = [
      'LOGIN_MAX_ATTEMPTS',
      'LOGIN_LOCKOUT_MINUTES',
      'LOGIN_RATE_LIMIT_WINDOW_MINUTES',
      'LOGIN_RATE_LIMIT_PER_IP',
      'LOGIN_RATE_LIMIT_PER_IDENTIFIER',
    ];
    const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
    Object.assign(process.env, {
      LOGIN_MAX_ATTEMPTS: '2',
      LOGIN_LOCKOUT_MINUTES: '15',
      LOGIN_RATE_LIMIT_WINDOW_MINUTES: '15',
      LOGIN_RATE_LIMIT_PER_IP: '10',
      LOGIN_RATE_LIMIT_PER_IDENTIFIER: '5',
    });
    const app = createApp();

    try {
      const statuses = [];
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const response = await request(app)
          .post('/auth/login')
          .send({ email: 'locked@example.test', password: 'password12345' });
        statuses.push(response.status);
      }

      expect(statuses).toEqual([503, 503, 429]);
    } finally {
      for (const [key, value] of Object.entries(original)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });

  it('accepts Gmail SMTP configuration without an explicit sender address', () => {
    const original = Object.fromEntries(
      ['GMAIL_HOST', 'GMAIL_USER', 'GMAIL_PASSWORD', 'SMTP_PORT', 'GMAIL_SECURE', 'AUTH_EMAIL_FROM']
        .map((key) => [key, process.env[key]]),
    );
    Object.assign(process.env, {
      GMAIL_HOST: 'smtp.gmail.com',
      GMAIL_USER: 'school@example.test',
      GMAIL_PASSWORD: 'app-password',
      SMTP_PORT: '587',
      GMAIL_SECURE: 'false',
    });
    delete process.env.AUTH_EMAIL_FROM;

    try {
      expect(assertAuthenticationEmailConfigured).not.toThrow();
    } finally {
      for (const [key, value] of Object.entries(original)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });

  it('requires a valid session for the current-user endpoint', async () => {
    const response = await request(createApp()).get('/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
  });

  it('does not authenticate requests when no database is configured', async () => {
    const response = await request(createApp())
      .post('/auth/login')
      .send({ email: 'user@example.test', password: 'correct horse battery staple' });

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe('DATABASE_NOT_CONFIGURED');
  });

  it('validates code purpose rather than accepting arbitrary challenge types', async () => {
    const response = await request(createApp())
      .post('/auth/resend-code')
      .send({ email: 'user@example.test', purpose: 'login' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('clears the cookie on logout when there is no database connection', async () => {
    const response = await request(createApp()).post('/auth/logout');

    expect(response.status).toBe(204);
    expect(response.headers['set-cookie'][0]).toContain('school_smis_session=');
    expect(response.headers['set-cookie'][0]).toContain('Expires=Thu, 01 Jan 1970');
  });
});
