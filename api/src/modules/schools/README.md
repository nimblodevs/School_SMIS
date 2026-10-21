# Schools module

The modular school API is mounted at `/api/v1/schools`. It manages canonical school profile and settings records using Drizzle ORM and the shared PostgreSQL schema in `src/db/schema.js`.

## Routes

| Method | Path | Roles | Purpose |
| --- | --- | --- | --- |
| GET | `/current` | Authenticated | Get the current user's school |
| GET | `/:schoolId/branches` | ADMIN, SUPER_ADMIN | List branches in a school |
| POST | `/:schoolId/branches` | ADMIN, SUPER_ADMIN | Add a school branch |
| GET | `/:schoolId` | ADMIN, SUPER_ADMIN | Get a school profile |
| PATCH | `/:schoolId` | ADMIN, SUPER_ADMIN | Update a school profile |
| GET | `/:schoolId/settings` | ADMIN, SUPER_ADMIN | Read M-Pesa settings |
| PATCH | `/:schoolId/settings` | ADMIN, SUPER_ADMIN | Update M-Pesa settings |
| GET | `/` | SUPER_ADMIN | List and search schools |
| POST | `/` | SUPER_ADMIN | Create a school directly |

School-scoped users may access only their assigned school. `SUPER_ADMIN` can access any school and list or create platform-wide tenants. Although `ADMIN` may update their own school, only `SUPER_ADMIN` can change protected identity/contact fields such as name, slug, email, phone, or active status.

Student, teacher, and staff profiles may optionally reference one branch in their school. Unassigned existing profiles remain valid and can be listed using the auth user-list `branchId=unassigned` filter.

## Canonical school data

The `schools` table uses `schoolName`, `schoolSlug`, `schoolCode`, `schoolNemisNo`, `schoolMotto`, `visionStatement`, `missionStatement`, `officialPhone`, `schoolEmail`, and `schoolKraPin`, along with school type/location, website, head-office address, logo metadata, active status, and sequence counters. Address, city, county, and postal code are exposed through the profile API; the location components are stored in `schoolLocation`.

School codes are generated server-side from up to four initials. Numeric suffixes resolve collisions without exceeding four characters. Unique indexes protect the school code and slug, non-empty official phone, and non-empty NEMIS and KRA PIN values.

## Tenant integrity

The Drizzle schema declares school ownership on tenant records and composite same-school foreign keys for related data across the academic, assessment, finance, and HR domains. Database checks enforce defined date and numeric ranges, and conditional unique indexes prevent multiple current academic years per school or multiple primary bank accounts per employee. The schema also limits each school to one primary ownership record.

Before deploying integrity migrations to an existing database, identify and resolve cross-school references, duplicate primary/current records, and rows that violate new checks. Cross-row totals, such as payment allocations exceeding a payment, still require transaction-level application logic or a database trigger.

## Transactions and audit

School creation writes the school and default settings in a transaction. Settings updates use an upsert keyed by school. Profile and settings changes write audit records with the actor, school, and changed field names.

## Related modules

- [Onboarding](../onboarding/README.md) handles wizard-driven tenant creation and code generation.
- [Authentication](../auth/README.md) resolves the current actor and school context.
- [Users](../users/README.md) creates teacher and staff accounts within a school.
# Schools module

The module router exposes the school administration API at `/api/v1/schools`.
