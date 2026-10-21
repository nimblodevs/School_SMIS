# School SMIS API

Express API for school onboarding, tenant administration, authentication, academic records, finance, and HR. The API uses Neon PostgreSQL with Drizzle ORM; the schema is maintained in `src/db/schema.js`.

## Development setup

1. Use Node.js 20 or later.
2. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `WEB_ORIGIN`, SMTP settings, and object-storage credentials as needed. Set `MIGRATION_DATABASE_URL` when migrations should use a separate database-owner connection.
3. Install dependencies with `npm install`.
4. Start the API with `npm run dev`. It listens on port `3000` by default; set `PORT` to override it.
5. Run the API tests with `npm test`.

To seed a development platform super-admin, set `SUPER_ADMIN_SEED_EMAIL` and either `SUPER_ADMIN_SEED_PASSWORD` or the existing `AUTH_SEED_PASSWORD`, then run `npm run db:seed:super-admin`. The password must be at least 12 characters. The command refuses to run in production, does not overwrite an existing account, and requires the email to be a real inbox for login OTP delivery.

The web app proxies `/api` to `http://localhost:3000` by default. The API exposes `GET /api/health`, `GET /api/openapi.json`, and the Swagger UI at `/api/docs`.

## Database and migrations

Generate a migration after changing the schema with `npm run db:generate`. Review the generated SQL and snapshots before applying migrations with `npm run db:migrate`.

The school table uses canonical fields such as `schoolName`, `schoolSlug`, `schoolCode`, `schoolNemisNo`, `schoolMotto`, `visionStatement`, `missionStatement`, `officialPhone`, `schoolEmail`, and `schoolKraPin`. School codes are generated from up to four initials; collisions are resolved with a numeric suffix within the four-character limit.

The schema uses database constraints to strengthen tenant and business-data integrity, including same-school foreign keys, financial and date checks, and conditional uniqueness for current academic years and primary accounts. The latest integrity migrations are `0008_modern_ozymandias.sql`, `0009_shiny_the_phantom.sql`, and `0010_nifty_iron_monger.sql`. Before applying them to an existing database, check for cross-school references, duplicate current years or primary records, and rows that violate the new checks. Back up production data, resolve conflicts, and review the migration plan before deployment. Migrations are not applied by schema generation.

### Row-level security

Migration `0011_tenant_rls_policies.sql` enables and forces RLS on school-owned, authentication, and tenant-relation tables. API requests run inside a transaction and set tenant context with transaction-local PostgreSQL settings. Missing tenant context denies access to tenant rows; platform administrators receive cross-school access after their session is verified. Migration `0012_numerous_tomas.sql` adds optional, school-validated branch assignments for student, teacher, and staff profiles; existing profiles remain unassigned.

Run `npm run db:migrate` using the database owner/migration connection. The migration creates a restricted `school_smis_app` role without `LOGIN` or `BYPASSRLS`, and grants the API table permissions. In Neon, set a strong password and enable login for this role. Set `DATABASE_URL` to the app role's connection URL and `MIGRATION_DATABASE_URL` to the owner URL. Do not run the application with the owner role: owner or `BYPASSRLS` connections bypass row security, even when policies are enabled. Keep the owner URL only for migrations and administrative tasks. Verify the app connection reports `rolbypassrls = false` before deploying.

Row-level constraints cannot enforce aggregate rules such as active payment allocations not exceeding the payment total. Enforce those rules in transactional application logic or a database trigger.

## API surfaces

The API exposes modular administration routes:

- `/api/v1/auth` — OTP sign-in, Google sign-in, password recovery, refresh sessions, profile management, and administrative user operations.
- `/api/v1/onboarding` — school-tenant availability checks and onboarding.
- `/api/v1/schools` — current-school lookup, school profile and settings management, and platform administration.
- `/api/v1/users` — teacher and staff account provisioning.

Authentication and authorization requirements differ by endpoint; consult the module READMEs and route definitions before integrating a client.

### Modular authentication

`/api/v1/auth/login` validates a password and sends a short-lived email OTP; `/verify-login-otp` completes sign-in. Browser clients receive HttpOnly access and refresh cookies. Native clients can send `x-client-type: mobile` to receive tokens in the response and must store them securely. Refresh tokens rotate, and password changes or resets revoke sessions. Production deployments must set both `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY`.

Authentication and OTP throttles use process-local memory stores. Configure a shared rate-limit store before scaling to multiple API instances. Set `TRUST_PROXY` only to the exact proxy hop count or trusted proxy addresses/CIDRs.

### School onboarding and identifiers

Onboarding checks portal-slug and official-phone availability. The server generates the school code from the school name; clients must not submit a code. The school slug, code, NEMIS number, KRA PIN, and official phone are protected by database uniqueness rules (optional identifiers use conditional unique indexes).

## Authentication email

SMTP settings are read from environment variables. `SMTP_*` is canonical; legacy `GMAIL_*` variables are supported. The API sends login and password-reset verification codes, and reports an explicit error if email is not configured or cannot be delivered. Never commit `.env` or credentials.

## Object storage

School logos and onboarding documents use Neon Object Storage through its S3-compatible API. Configure `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`, and set `NEON_OBJECT_STORAGE_BUCKET` (defaults to `assets`). Signed URLs are short-lived; do not expose storage credentials to clients.

## Further documentation

- [Authentication module](src/modules/auth/README.md)
- [Onboarding module](src/modules/onboarding/README.md)
- [Schools module](src/modules/schools/README.md)
- [Users module](src/modules/users/README.md)
