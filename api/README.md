# School SMIS API

Express API for Neon PostgreSQL-backed school profiles, branches, onboarding documents, directory search, and authentication.

## Development setup

1. Use Node.js 20 or later.
2. Copy `.env.example` to `.env`; configure `DATABASE_URL`, `WEB_ORIGIN`, and SMTP settings.
3. Configure `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `NEON_OBJECT_STORAGE_BUCKET` for school document and logo uploads.
4. Install dependencies with `npm install`.
5. Apply database migrations with `npm run db:migrate`.
6. Start the API using `npm run dev`.

The API listens on port `3000` by default. The Vite development server proxies `/api` to it. Keep the frontend and API on the same site in production so the secure, HttpOnly session cookie can be sent with API requests.

## Authentication configuration

For Gmail, set `GMAIL_HOST=smtp.gmail.com`, `GMAIL_USER`, `GMAIL_PASSWORD`, `SMTP_PORT=587`, and `GMAIL_SECURE=false`. Use a Google App Password for `GMAIL_PASSWORD`, not your Google account password. `AUTH_EMAIL_FROM` is optional and defaults to `GMAIL_USER`. The API also accepts the legacy `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_SECURE` variables. The API sends six-digit email verification and password-reset codes that expire after ten minutes. Email verification and password recovery return an explicit configuration/delivery error when mail cannot be sent.

Passwords are hashed with Argon2id. Successful sign-in creates a random opaque session; only its SHA-256 hash is stored in PostgreSQL. The session cookie is HttpOnly, SameSite=Lax, scoped to `/api`, and expires after seven days. Password reset revokes all existing sessions, while changing a password revokes all other sessions.

New users are `school_admin` accounts. School API access requires a valid session; each school profile and its nested resources are restricted to users with a membership created during onboarding.

## Authentication routes

- `POST /api/auth/register` — create an account and send an email verification code.
- `POST /api/auth/verify-email` — verify an email code.
- `POST /api/auth/resend-code` — resend an email-verification or password-reset code.
- `POST /api/auth/login` — verify credentials and create a session for verified accounts.
- `GET /api/auth/me` — return the current session user.
- `POST /api/auth/logout` — revoke the current session and clear its cookie.
- `POST /api/auth/forgot-password` — send a password-reset code without disclosing whether the account exists.
- `POST /api/auth/reset-password` — set a new password using a valid reset code.
- `POST /api/auth/change-password` — change a password for the current session.

Authentication endpoints are rate limited. Email codes expire after ten minutes and allow at most `OTP_MAX_ATTEMPTS` attempts (default 10).

Login and OTP rate limits can be tuned with the `LOGIN_*` and `OTP_*` variables in `.env.example`. Failed sign-in attempts are limited per email identifier during the lockout window, with additional per-identifier and per-IP request limits. OTP attempts are limited per code, and verification-code requests and resends are throttled per email. These limits use the process-local memory store; use a shared rate-limit store when running multiple API instances. `TRUST_PROXY` is unset by default; configure it only when deployed behind a known proxy, using the exact hop count or trusted proxy IP/CIDR list. School uploads currently use Neon Object Storage, so `LOCAL_UPLOAD_DIR` is reserved and does not change upload behavior.

## School API routes

- `GET /api/schools?page=1&pageSize=10&search=&schoolType=all&ownershipType=all&sort=asc`
- `POST /api/schools` — create an onboarding school profile using multipart form data; registration and fire-safety certificates are required.
- `GET /api/schools/:schoolId` — read the current user's school profile.
- `PUT /api/schools/:schoolId` — update profile fields.
- `POST /api/schools/:schoolId/branches` — add a branch.
- `POST /api/schools/:schoolId/logo` and `DELETE /api/schools/:schoolId/logo`
- `GET /api/schools/:schoolId/profile.pdf`

School endpoints require authentication. Profile and nested operations also require membership in the requested school. Responses use `{ data, pagination, summary }`; validation and service errors use `{ error: { code, message, details? } }`.

## Storage and configuration

Never commit `.env`. Logo and onboarding documents use Neon Object Storage's S3-compatible API and short-lived signed URLs. PostgreSQL, SMTP, and object-storage credentials are read from environment variables only.
