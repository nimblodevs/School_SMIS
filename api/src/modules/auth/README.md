# Authentication module

The modular authentication API is mounted at `/api/v1/auth`. It uses Drizzle ORM through `src/db/client.js`; account, OTP, and refresh-session data are defined in `src/db/schema.js`.

## Sign-in and sessions

1. `POST /login` validates email and password and emails a login OTP.
2. `POST /verify-login-otp` verifies the challenge and creates an access token and refresh session.
3. `POST /refresh` rotates the refresh token and issues a new access token.
4. `POST /logout` revokes the current refresh session.

Browser clients receive HttpOnly cookies. A native client may send `x-client-type: mobile` to receive access and refresh tokens in the response body; it must keep them in secure device storage. The access-token cookie is configured with a seven-day max age, while the JWT itself expires according to `JWT_EXPIRES_IN` (10 minutes by default). The refresh-token cookie lasts 30 days by default; refresh-token expiry can be configured with `REFRESH_TOKEN_EXPIRES_DAYS`.

The access token is an RS256 JWT. Production must configure both `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY`; outside production the service can generate a process-local key pair when neither is configured. Passwords are hashed with Argon2id. Password changes and resets reject the current password and the five most recently replaced passwords; password-history entries are also stored as Argon2id hashes. Refresh tokens are stored as hashes, rotated on refresh, and revoked on logout or password changes.

## Routes

| Method     | Path                   | Access                         | Purpose                                                                  |
| ---------- | ---------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| POST       | `/login`               | Public                         | Validate credentials and send login OTP                                  |
| POST       | `/verify-login-otp`    | Public                         | Verify login challenge and issue tokens                                  |
| POST       | `/resend-login-otp`    | Public                         | Resend login OTP                                                         |
| POST       | `/google`              | Public                         | Sign in with a Google ID token                                           |
| POST       | `/forgot-password`     | Public                         | Request a password-reset OTP                                             |
| POST       | `/verify-otp`          | Public                         | Verify a password-reset OTP                                              |
| POST       | `/reset-password`      | Public                         | Reset password using a valid OTP                                         |
| POST       | `/refresh`             | Public, refresh token required | Rotate tokens                                                            |
| POST       | `/logout`              | Authenticated                  | Revoke session                                                           |
| GET, PATCH | `/me`                  | Authenticated                  | Read or update the current user profile                                  |
| POST       | `/change-password`     | Authenticated                  | Change password and revoke sessions                                      |
| POST       | `/impersonate/:userId` | ADMIN, SUPER_ADMIN             | Start an audited impersonation session                                   |
| POST       | `/stop-impersonation`  | Active impersonation           | Restore the original administrator session                               |
| GET        | `/users`               | ADMIN, SUPER_ADMIN             | List users in the resolved school context, optionally filtered by branch |

The module router exposes the authentication API at `/api/v1/auth`.

## Authorization and auditing

- Protected routes require a valid JWT and an active refresh-session record.
- Role checks and school-context resolution are applied per route. Authentication alone does not grant access to school data.
- Impersonation records the actor and target; sensitive actions should continue to preserve that audit context.
- In development and test, super admins may impersonate any active non-super-admin account in a school; school admins remain restricted to their own school. Production retains the existing teacher, parent, and student support roles. The `branchId` filter accepts a branch ID or `unassigned` and applies to student, teacher, and staff profiles only. Other school data remains school-wide.
- Self-service profile updates are restricted to the authenticated account and its linked profile.

## Throttling and OTP configuration

Login, refresh, OTP verification, and resend routes use IP and/or identifier-based rate limits. Defaults and limits are configurable with the `LOGIN_*`, `REFRESH_*`, and `OTP_*` environment variables. Login and email-verification OTPs expire after three minutes by default; password-reset OTPs expire after ten minutes. OTP verification also enforces a maximum attempt count. OTPs are stored in `password_reset_otps.code_hash` as keyed HMAC-SHA-256 digests, never as plaintext. Set a stable, random `AUTH_OTP_PEPPER` of at least 32 characters in production; if omitted, the JWT private key is used. Keep the pepper stable while codes are valid. Legacy unkeyed OTP hashes remain verifiable until they expire.

The current rate-limit store is process-local. Multi-instance deployments need a shared store so limits are consistent across API instances. Configure `TRUST_PROXY` only for known proxy hops or trusted proxy addresses/CIDRs.

## Development seed data

With `DATABASE_URL` configured, run `npm run db:seed:schools` to create the 19 development schools in `seed/data.js`, then run `npm run db:seed:auth` with `AUTH_SEED_PASSWORD` set to a password of at least 12 characters to create 20 users per school. The scripts live in `seed/`, refuse to run when `NODE_ENV=production`, and are safe to rerun without overwriting existing user rows. All seed accounts use the configured password; their emails use the reserved `.test` domain. The user roles are one `ADMIN`, one `MANAGER`, eight `TEACHER`, five `STAFF`, two `BURSAR`, two `PARENT`, and one `STUDENT` per school.
