# Users module

The users API provisions teacher and staff accounts for an existing school. It is mounted at `/api/v1/users` and uses the shared Drizzle schema in `src/db/schema.js`.

## Routes

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/teachers` | Authenticated user with `users:create` permission | Create teacher account and profile |
| POST | `/staff` | Authenticated user with `users:create` permission | Create staff account and profile |

The application adds the `/api/v1` prefix. The actor's school is the default tenant; a platform administrator may provide a `schoolId`. The service verifies that the school exists and is active, and rejects duplicate email addresses or usernames.

## Provisioning behavior

Each request supplies username, email, first and last names, hire date, and exactly one national-ID or passport number. Phone, middle name, job group, and statutory identifiers are optional. Staff requests additionally require department and job title.

Within a database transaction, the service allocates a school-scoped employee sequence, records an employee number, creates the user with a temporary credential and forced password change, and creates the corresponding teacher or staff profile. Employee numbers use a role prefix, school-name initials, and a sequence number. The generated employee key links the profile to the employee-number record.

Temporary credentials are emailed after the transaction. If delivery fails, the already-created account is deactivated and the request returns an error; the transaction is not rolled back after this external email failure. In non-production environments the response may include the temporary password for development. Production responses do not.

## Authorization and integrity

- All routes require authentication and the `users:create` permission.
- School resolution is enforced by the service; clients must not use a supplied school identifier to cross tenant boundaries.
- Composite foreign keys ensure each teacher/staff profile, linked user account, and optional job group belongs to the same school. The employee-number row is created in the same provisioning transaction.
- Employee profile creation and sequence allocation are transactional. Audit records include the actor and school after successful credential delivery.

## Related modules

- [Schools](../schools/README.md) establishes and manages the tenant.
- [Authentication](../auth/README.md) supplies credentials, sessions, roles, and permissions.
