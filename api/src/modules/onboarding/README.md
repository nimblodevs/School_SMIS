# School onboarding module

The onboarding API is mounted at `/api/v1/onboarding`. It creates school tenants in the shared Drizzle schema (`src/db/schema.js`) and is intended for an authenticated administrator who is not yet assigned to a school, or a platform `SUPER_ADMIN`.

## Routes

| Method | Path | Roles | Purpose |
| --- | --- | --- | --- |
| GET | `/availability` | ADMIN, SUPER_ADMIN | Check supplied portal slug and/or phone |
| GET | `/school-code` | ADMIN, SUPER_ADMIN | Preview the collision-aware school code for a name |
| POST | `/school` | ADMIN, SUPER_ADMIN | Validate and create a school tenant |
| POST | `/school/wizard` | ADMIN, SUPER_ADMIN | Submit the full school onboarding wizard and its files |

The application adds the `/api/v1` prefix. All routes require authentication. Submissions are limited to 10 per account per 15 minutes; availability checks are subject to the global API limiter.

### Availability

Provide at least one query parameter: `slug` and/or `phone`. Each supplied value returns a verdict: `AVAILABLE`, `TAKEN`, `RESERVED`, or `INVALID`. Phone values are normalized before checking. Availability checks do not reserve identifiers, so the final create operation rechecks uniqueness inside its transaction.

Example response:

```json
{
  "success": true,
  "data": {
    "slug": {
      "value": "green-valley-high-school",
      "available": true,
      "reason": "AVAILABLE"
    }
  }
}
```

### Create a school

The request includes school identity (`name`, optional `slug`, `schoolNemisNo`, and `schoolKraPin`), motto and vision/mission statements, contact details (`phone` and `email`), optional address/location and website fields, and `accurateInformation: true`. If no slug is supplied, one is generated from the school name. Reserved platform route names cannot be used.

The server derives `schoolCode` from up to four initials of the school name. If the code exists, it generates a numeric-suffix variant while keeping the code at no more than four characters. The wizard can submit only the server-generated Step 1 preview; the server revalidates it during final creation.

The wizard calls `/school-code?name=...` in Step 1 and displays that value in the Step 5 review. The final submit verifies the same code under the school-code generation lock; if another school took it while the wizard was open, submission is rejected with a prompt to refresh the code rather than silently assigning a different one.

The create transaction inserts the canonical school fields and default settings. A non-platform administrator is linked to the new school only if their account is still unassigned; a `SUPER_ADMIN` remains platform-scoped. The audit record is written after the transaction commits. Success returns `201` with an onboarding reference, portal URL, timestamp, owner-link status, and school details. Identifier conflicts return a conflict response with field-specific details.

### Full wizard submission

The wizard endpoint accepts `multipart/form-data` with a JSON `school` field and file fields named `logo`, `registrationCertificate`, `fireSafetyCertificate`, `publicHealthCertificate`, `operatingLicence`, and `otherSupportingDocument`. Registration and fire-safety files are required; the other files are optional. It stores the school location or branches, ownership/admin entries, uploaded file metadata, school profile, and one `ADMIN` user for each distinct admin email in the same onboarding transaction. Each admin receives a cryptographically generated temporary password by email and is required to change it after signing in. Existing user emails and duplicate admin emails are rejected rather than having existing accounts overwritten. Credential delivery requires SMTP configuration; if delivery fails after school creation, the newly created admin accounts are deactivated and an explicit error is returned.

The optional logo must be a PNG, JPG, or WebP image no larger than 2 MB. Documents must be PDF, PNG, or JPG files no larger than 10 MB each. The server validates file signatures as well as declared content types.

## Validation and tenant identifiers

- Slugs are lowercase, 3–60 characters, and use letters, digits, and single hyphens; reserved platform paths are rejected.
- Official phone numbers are validated and normalized, then protected by a unique database index.
- School code and slug are unique. Optional NEMIS number and KRA PIN values are unique when non-empty.
- Required text, email, URL, phone, postal-code, and confirmation fields are validated by the server independently of frontend validation.

## Related modules

- [Schools](../schools/README.md) manages school profiles and settings after onboarding.
- [Authentication](../auth/README.md) provides the authenticated account and actor role.
- [Users](../users/README.md) provisions employees after the school tenant exists.
