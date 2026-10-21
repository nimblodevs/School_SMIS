import argon2 from "argon2";
import { randomBytes, randomUUID } from "node:crypto";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { getDatabase, setDatabaseRlsContext } from "../../db/client.js";
import {
  schoolBranches,
  schoolDocuments,
  schoolOwnerships,
  schoolSettings,
  schools,
  users,
} from "../../db/schema.js";
import { recordAudit } from "../../shared/audit.js";
import {
  assertTemporaryCredentialsEmailConfigured,
  sendTemporaryCredentials,
} from "../../shared/email.js";
import {
  deleteSchoolDocument,
  deleteSchoolLogo,
  uploadSchoolDocument,
  uploadSchoolLogo,
} from "../../shared/object-storage.js";
import {
  generateSchoolCode,
  previewSchoolCode as generateSchoolCodePreview,
} from "../../shared/school-code.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from "../../shared/errors/AppError.js";
import {
  AVAILABILITY_REASONS,
  RESERVED_SCHOOL_SLUGS,
} from "./onboarding.constants.js";
import {
  buildOnboardingReference,
  buildPortalUrl,
  isPhoneFormat,
  isSlugFormat,
  normalizePhoneNumber,
  toSchoolSlug,
} from "./onboarding.utils.js";

function verdict(value, available, reason) {
  return { value, available, reason };
}

function schoolResponse(row) {
  return {
    id: row.id,
    name: row.schoolName,
    schoolName: row.schoolName,
    slug: row.schoolSlug,
    schoolSlug: row.schoolSlug,
    schoolCode: row.schoolCode,
    schoolNemisNo: row.schoolNemisNo,
    schoolKraPin: row.schoolKraPin,
    motto: row.schoolMotto,
    schoolMotto: row.schoolMotto,
    vision: row.visionStatement,
    visionStatement: row.visionStatement,
    mission: row.missionStatement,
    missionStatement: row.missionStatement,
    address: row.headOfficeAddress,
    city: row.schoolLocation?.area ?? "",
    county: row.schoolLocation?.county ?? "",
    postalCode: row.schoolLocation?.postalCode ?? "",
    phone: row.officialPhone,
    officialPhone: row.officialPhone,
    email: row.schoolEmail,
    schoolEmail: row.schoolEmail,
    website: row.website,
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

const schoolDocumentFields = [
  "registrationCertificate",
  "fireSafetyCertificate",
  "publicHealthCertificate",
  "operatingLicence",
  "otherSupportingDocument",
];

const fileExtensions = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

function hasValidSignature(file) {
  const { buffer, mimetype } = file;
  if (mimetype === "application/pdf") {
    return buffer.subarray(0, 5).equals(Buffer.from("%PDF-"));
  }
  if (mimetype === "image/png") {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimetype === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }
  if (mimetype === "image/webp") {
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }
  return false;
}

function validateWizardFiles(documents) {
  const missingRequired = [
    ["registrationCertificate", "school registration certificate"],
    ["fireSafetyCertificate", "fire safety certificate"],
  ]
    .filter(([field]) => !documents[field])
    .map(([, label]) => label);
  if (missingRequired.length) {
    throw new BadRequestError(
      `Upload the required ${missingRequired.join(" and ")}.`,
    );
  }

  if (documents.logo && documents.logo.size > 2 * 1024 * 1024) {
    throw new BadRequestError("School logo must be 2 MB or smaller.");
  }

  for (const field of schoolDocumentFields) {
    const file = documents[field];
    if (file && file.size > 10 * 1024 * 1024) {
      throw new BadRequestError(
        "Each school document must be 10 MB or smaller.",
      );
    }
  }

  for (const [field, file] of Object.entries(documents)) {
    const allowedTypes =
      field === "logo"
        ? new Set(["image/png", "image/jpeg", "image/webp"])
        : new Set(["application/pdf", "image/png", "image/jpeg"]);
    if (
      !allowedTypes.has(file.mimetype) ||
      !file.buffer?.length ||
      !hasValidSignature(file)
    ) {
      throw new BadRequestError(`The uploaded ${field} file is invalid.`);
    }
  }
}

function storedFile(file) {
  return { ...file, mimeType: file.mimetype };
}

function safeOriginalName(file) {
  return file.originalname
    .replace(/^.*[\\/]/, "")
    .replace(/[\u0000-\u001f\u007f]/g, "_")
    .slice(0, 255);
}

export class OnboardingService {
  static async previewSchoolCode(schoolName, actor) {
    this.resolveActorScope(actor);
    return generateSchoolCodePreview(getDatabase(), schoolName);
  }

  static async checkAvailability({ slug, phone }) {
    const slugIsReserved =
      Boolean(slug) && RESERVED_SCHOOL_SLUGS.includes(slug);
    const slugIsWellFormed = Boolean(slug) && isSlugFormat(slug);
    const normalizedPhone = phone ? normalizePhoneNumber(phone) : "";
    const phoneIsWellFormed = Boolean(phone) && isPhoneFormat(phone);
    const database = getDatabase();
    const [slugMatch, phoneMatch] = await Promise.all([
      slugIsWellFormed && !slugIsReserved
        ? database
            .select({ id: schools.id })
            .from(schools)
            .where(eq(schools.schoolSlug, slug))
            .limit(1)
        : [],
      phoneIsWellFormed
        ? database
            .select({ id: schools.id })
            .from(schools)
            .where(eq(schools.officialPhone, normalizedPhone))
            .limit(1)
        : [],
    ]);
    return {
      ...(slug
        ? {
            slug: !slugIsWellFormed
              ? verdict(slug, false, AVAILABILITY_REASONS.invalid)
              : slugIsReserved
                ? verdict(slug, false, AVAILABILITY_REASONS.reserved)
                : verdict(
                    slug,
                    !slugMatch.length,
                    slugMatch.length
                      ? AVAILABILITY_REASONS.taken
                      : AVAILABILITY_REASONS.available,
                  ),
          }
        : {}),
      ...(phone
        ? {
            phone: phoneIsWellFormed
              ? verdict(
                  normalizedPhone,
                  !phoneMatch.length,
                  phoneMatch.length
                    ? AVAILABILITY_REASONS.taken
                    : AVAILABILITY_REASONS.available,
                )
              : verdict(phone, false, AVAILABILITY_REASONS.invalid),
          }
        : {}),
    };
  }

  static resolveActorScope(actor) {
    if (actor.role === "SUPER_ADMIN") return "PLATFORM";
    if (actor.schoolId) {
      throw new ForbiddenError(
        "Your account already belongs to a school. A platform operator must onboard a new school.",
      );
    }
    return "OWNER";
  }

  static async submit(input, actor, { ipAddress, userAgent } = {}) {
    const scope = this.resolveActorScope(actor);
    const slug = input.slug || toSchoolSlug(input.name);
    const phone = normalizePhoneNumber(input.phone);
    if (!isSlugFormat(slug)) {
      throw new ConflictError(
        "A valid portal address could not be created from the school name",
        {
          slug: AVAILABILITY_REASONS.invalid,
        },
      );
    }
    if (RESERVED_SCHOOL_SLUGS.includes(slug)) {
      throw new ConflictError(
        "This portal address is reserved by the platform",
        {
          slug: AVAILABILITY_REASONS.reserved,
        },
      );
    }

    let school;
    try {
      school = await getDatabase().transaction(async (tx) => {
        const [slugMatch] = await tx
          .select({ id: schools.id })
          .from(schools)
          .where(eq(schools.schoolSlug, slug))
          .limit(1);
        const [phoneMatch] = await tx
          .select({ id: schools.id })
          .from(schools)
          .where(eq(schools.officialPhone, phone))
          .limit(1);
        const collisions = {
          ...(slugMatch ? { slug: AVAILABILITY_REASONS.taken } : {}),
          ...(phoneMatch ? { phone: AVAILABILITY_REASONS.taken } : {}),
        };
        if (Object.keys(collisions).length) {
          const messages = [];
          if (collisions.slug)
            messages.push("That portal address is already in use.");
          if (collisions.phone)
            messages.push(
              "That phone number is already registered to another school.",
            );
          throw new ConflictError(messages.join(" "), collisions);
        }

        const location = {
          area: input.city ?? "",
          county: input.county ?? "",
          postalCode: input.postalCode ?? "",
        };
        const schoolCode = await generateSchoolCode(tx, input.name);
        const [created] = await tx
          .insert(schools)
          .values({
            id: randomUUID(),
            name: input.name.toUpperCase(),
            slug,
            schoolName: input.name.toUpperCase(),
            schoolCode,
            schoolSlug: slug,
            schoolNemisNo: input.schoolNemisNo || null,
            schoolKraPin: input.schoolKraPin || null,
            motto: input.motto,
            schoolMotto: input.motto,
            vision: input.vision,
            visionStatement: input.vision,
            mission: input.mission,
            missionStatement: input.mission,
            schoolType: "standalone",
            address: input.address ?? "",
            city: input.city ?? "",
            county: input.county ?? "",
            postalCode: input.postalCode ?? "",
            schoolLocation: location,
            phone,
            officialPhone: phone,
            email: input.email,
            schoolEmail: input.email,
            website: input.website ?? "",
            headOfficeAddress: input.address ?? "",
            isActive: true,
          })
          .returning();
        await setDatabaseRlsContext({ schoolId: created.id });
        await tx
          .insert(schoolSettings)
          .values({ id: randomUUID(), schoolId: created.id })
          .onConflictDoNothing();
        if (scope === "OWNER") {
          const [owner] = await tx
            .update(users)
            .set({ schoolId: created.id })
            .where(and(eq(users.id, actor.id), isNull(users.schoolId)))
            .returning({ id: users.id });
          if (!owner) {
            throw new ForbiddenError(
              "Your account already belongs to a school. A platform operator must onboard a new school.",
            );
          }
        }
        return created;
      });
    } catch (error) {
      if (error.code !== "23505") throw error;
      const details = {};
      if (error.constraint?.includes("school_slug"))
        details.slug = AVAILABILITY_REASONS.taken;
      if (error.constraint?.includes("school_code"))
        details.schoolCode = AVAILABILITY_REASONS.taken;
      if (error.constraint?.includes("official_phone"))
        details.phone = AVAILABILITY_REASONS.taken;
      throw new ConflictError(
        "One or more school identifiers are already in use",
        details,
      );
    }

    const ownerLinked = scope === "OWNER";
    const onboardingReference = buildOnboardingReference({
      id: school.id,
      schoolCode: school.schoolCode,
    });
    await recordAudit({
      action: "CREATE",
      actorId: actor.id,
      schoolId: school.id,
      entityType: "School",
      entityId: school.id,
      ipAddress,
      userAgent,
      metadata: {
        source: "SCHOOL_ONBOARDING",
        onboardingReference,
        slug,
        schoolCode: school.schoolCode,
        ownerLinked,
      },
    });
    return {
      onboardingReference,
      portalUrl: buildPortalUrl(slug),
      submittedAt: school.createdAt.toISOString(),
      ownerLinked,
      school: schoolResponse(school),
    };
  }

  static async submitWizard(
    input,
    documents,
    actor,
    { ipAddress, userAgent } = {},
  ) {
    const scope = this.resolveActorScope(actor);
    const slug = input.schoolSlug;
    const phone = normalizePhoneNumber(input.officialPhone);
    if (!isSlugFormat(slug)) {
      throw new ConflictError(
        "A valid portal address could not be created from the school name",
        { slug: AVAILABILITY_REASONS.invalid },
      );
    }
    if (RESERVED_SCHOOL_SLUGS.includes(slug)) {
      throw new ConflictError(
        "This portal address is reserved by the platform",
        {
          slug: AVAILABILITY_REASONS.reserved,
        },
      );
    }

    validateWizardFiles(documents);
    assertTemporaryCredentialsEmailConfigured();

    const adminAccounts = await Promise.all(
      input.ownerships.map(async (ownership) => {
        const temporaryPassword = `SMIS-${input.schoolCode}-${randomBytes(12).toString("base64url")}`;
        return {
          id: randomUUID(),
          email: ownership.schoolAdminEmail,
          fullName: ownership.schoolAdminName,
          temporaryPassword,
          passwordHash: await argon2.hash(temporaryPassword, {
            type: argon2.argon2id,
          }),
        };
      }),
    );

    const database = getDatabase();
    const [slugMatch, phoneMatch] = await Promise.all([
      database
        .select({ id: schools.id })
        .from(schools)
        .where(eq(schools.schoolSlug, slug))
        .limit(1),
      database
        .select({ id: schools.id })
        .from(schools)
        .where(eq(schools.officialPhone, phone))
        .limit(1),
    ]);
    const collisions = {
      ...(slugMatch.length ? { slug: AVAILABILITY_REASONS.taken } : {}),
      ...(phoneMatch.length ? { phone: AVAILABILITY_REASONS.taken } : {}),
    };
    if (Object.keys(collisions).length) {
      throw new ConflictError(
        "One or more school identifiers are already in use",
        collisions,
      );
    }

    const schoolId = randomUUID();
    const uploadedObjects = [];
    let createdAdminIds = [];
    let school;
    try {
      let logoObjectKey = null;
      if (documents.logo) {
        logoObjectKey = await uploadSchoolLogo(
          schoolId,
          storedFile(documents.logo),
          fileExtensions[documents.logo.mimetype],
        );
        uploadedObjects.push({ key: logoObjectKey, kind: "logo" });
      }

      const storedDocuments = [];
      for (const documentType of schoolDocumentFields) {
        const file = documents[documentType];
        if (!file) continue;
        const objectKey = await uploadSchoolDocument(
          schoolId,
          storedFile(file),
          fileExtensions[file.mimetype],
          documentType,
        );
        uploadedObjects.push({ key: objectKey, kind: "document" });
        storedDocuments.push({
          id: randomUUID(),
          schoolId,
          documentType,
          originalName: safeOriginalName(file),
          contentType: file.mimetype,
          objectKey,
        });
      }

      school = await database.transaction(async (tx) => {
        const [existingSlug] = await tx
          .select({ id: schools.id })
          .from(schools)
          .where(eq(schools.schoolSlug, slug))
          .limit(1);
        const [existingPhone] = await tx
          .select({ id: schools.id })
          .from(schools)
          .where(eq(schools.officialPhone, phone))
          .limit(1);
        if (existingSlug || existingPhone) {
          throw new ConflictError(
            "One or more school identifiers are already in use",
            {
              ...(existingSlug ? { slug: AVAILABILITY_REASONS.taken } : {}),
              ...(existingPhone ? { phone: AVAILABILITY_REASONS.taken } : {}),
            },
          );
        }

        const schoolCode = await generateSchoolCode(tx, input.schoolName);
        if (schoolCode !== input.schoolCode) {
          throw new ConflictError(
            "The generated school code is no longer available. Return to Step 1 and refresh it.",
            { schoolCode },
          );
        }
        const [created] = await tx
          .insert(schools)
          .values({
            id: schoolId,
            schoolName: input.schoolName.toUpperCase(),
            schoolCode,
            schoolSlug: slug,
            schoolNemisNo: input.schoolNemisNo || null,
            schoolKraPin: input.schoolKraPin || null,
            schoolMotto: input.schoolMotto,
            visionStatement: input.visionStatement,
            missionStatement: input.missionStatement,
            schoolType: input.schoolType,
            schoolLocation: input.schoolLocation,
            officialPhone: phone,
            schoolEmail: input.schoolEmail,
            website: input.website ?? "",
            headOfficeAddress: input.headOfficeAddress ?? "",
            logoObjectKey,
            logoContentType: documents.logo?.mimetype ?? null,
          })
          .returning();

        await setDatabaseRlsContext({ schoolId });
        if (input.branches.length) {
          await tx.insert(schoolBranches).values(
            input.branches.map((branch) => ({
              id: randomUUID(),
              schoolId,
              ...branch,
            })),
          );
        }
        await tx.insert(schoolOwnerships).values(
          input.ownerships.map((ownership, index) => ({
            id: randomUUID(),
            schoolId,
            ...ownership,
            isPrimary: index === 0,
          })),
        );
        const createdAdmins = await tx
          .insert(users)
          .values(
            adminAccounts.map((admin) => ({
              id: admin.id,
              fullName: admin.fullName,
              email: admin.email,
              passwordHash: admin.passwordHash,
              role: "ADMIN",
              schoolId,
              mustChangePassword: true,
            })),
          )
          .onConflictDoNothing({ target: users.email })
          .returning({ email: users.email });
        if (createdAdmins.length !== adminAccounts.length) {
          const createdEmails = new Set(
            createdAdmins.map(({ email }) => email),
          );
          throw new ConflictError(
            "One or more school admin emails already belong to an account.",
            {
              adminEmails: adminAccounts
                .filter(({ email }) => !createdEmails.has(email))
                .map(({ email }) => email),
            },
          );
        }
        createdAdminIds = adminAccounts.map(({ id }) => id);
        if (storedDocuments.length) {
          await tx.insert(schoolDocuments).values(storedDocuments);
        }
        await tx
          .insert(schoolSettings)
          .values({ id: randomUUID(), schoolId })
          .onConflictDoNothing();
        if (scope === "OWNER") {
          const [owner] = await tx
            .update(users)
            .set({ schoolId })
            .where(and(eq(users.id, actor.id), isNull(users.schoolId)))
            .returning({ id: users.id });
          if (!owner) {
            throw new ForbiddenError(
              "Your account already belongs to a school. A platform operator must onboard a new school.",
            );
          }
        }
        return created;
      });
    } catch (error) {
      const cleanupErrors = [];
      for (const uploaded of uploadedObjects) {
        try {
          if (uploaded.kind === "logo") {
            await deleteSchoolLogo(uploaded.key);
          } else {
            await deleteSchoolDocument(uploaded.key);
          }
        } catch (cleanupError) {
          cleanupErrors.push(cleanupError);
        }
      }
      if (cleanupErrors.length) {
        throw new AggregateError(
          [error, ...cleanupErrors],
          "School onboarding failed and uploaded files could not all be removed.",
        );
      }
      if (error.code === "23505") {
        const details = {};
        if (error.constraint?.includes("school_slug")) {
          details.slug = AVAILABILITY_REASONS.taken;
        }
        if (error.constraint?.includes("official_phone")) {
          details.phone = AVAILABILITY_REASONS.taken;
        }
        if (error.constraint?.includes("school_nemis_no")) {
          details.schoolNemisNo = AVAILABILITY_REASONS.taken;
        }
        if (error.constraint?.includes("school_kra_pin")) {
          details.schoolKraPin = AVAILABILITY_REASONS.taken;
        }
        if (error.constraint?.includes("users_email")) {
          throw new ConflictError(
            "One or more school admin emails already belong to an account.",
          );
        }
        throw new ConflictError(
          "One or more school identifiers are already in use",
          details,
        );
      }
      throw error;
    }

    try {
      for (const admin of adminAccounts) {
        await sendTemporaryCredentials({
          to: admin.email,
          firstName: admin.fullName.split(/\s+/)[0],
          role: "School Admin",
          temporaryPassword: admin.temporaryPassword,
        });
      }
    } catch (error) {
      await database
        .update(users)
        .set({ isActive: false, updatedAt: new Date() })
        .where(inArray(users.id, createdAdminIds));
      throw new BadRequestError(
        "The school was created, but admin credentials could not be delivered. The new admin accounts have been deactivated; contact a platform administrator.",
        null,
        { cause: error },
      );
    }

    const ownerLinked = scope === "OWNER";
    const onboardingReference = buildOnboardingReference({
      id: school.id,
      schoolCode: school.schoolCode,
    });
    const primaryOwnership = input.ownerships[0];
    const responseSchool = {
      ...schoolResponse(school),
      schoolType: school.schoolType,
      schoolLocation: input.schoolLocation,
      branches: input.branches,
      ownerships: input.ownerships,
      primaryAdmin: {
        userId: adminAccounts[0].id,
        name: primaryOwnership.schoolAdminName,
        email: primaryOwnership.schoolAdminEmail,
        mobile: primaryOwnership.schoolAdminMobile,
        alternativeMobile: primaryOwnership.alternativeMobile,
      },
    };
    await recordAudit({
      action: "CREATE",
      actorId: actor.id,
      schoolId: school.id,
      entityType: "School",
      entityId: school.id,
      ipAddress,
      userAgent,
      metadata: {
        source: "SCHOOL_ONBOARDING_WIZARD",
        onboardingReference,
        slug,
        schoolCode: school.schoolCode,
        ownerLinked,
        adminAccounts: adminAccounts.map(({ email }) => email),
        credentialsDelivered: true,
      },
    });

    return {
      onboardingReference,
      portalUrl: buildPortalUrl(slug),
      submittedAt: school.createdAt.toISOString(),
      ownerLinked,
      school: responseSchool,
    };
  }
}
