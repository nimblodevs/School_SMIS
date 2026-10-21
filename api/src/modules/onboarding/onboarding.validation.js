import { z } from "zod";
import {
  SCHOOL_PHONE_PATTERN,
  SCHOOL_SLUG_PATTERN,
} from "./onboarding.constants.js";

function blankToUndefined(value) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

function optionalText(max, label) {
  return z.preprocess(
    blankToUndefined,
    z
      .string()
      .trim()
      .max(max, `${label} must be ${max} characters or fewer`)
      .optional(),
  );
}

export const schoolSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(60)
  .regex(
    SCHOOL_SLUG_PATTERN,
    "Slug must use lowercase letters, numbers, and single hyphens",
  );

const schoolInformationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "School name must be at least 3 characters")
    .max(120, "School name must be 120 characters or fewer"),
  schoolNemisNo: z
    .string()
    .trim()
    .min(1, "NEMIS number is required")
    .max(50, "NEMIS number must be 50 characters or fewer"),
  schoolKraPin: optionalText(32, "KRA PIN"),
  slug: z.preprocess(blankToUndefined, schoolSlugSchema.optional()),
  motto: z
    .string()
    .trim()
    .min(3, "Motto is required")
    .max(140, "Motto must be 140 characters or fewer"),
  vision: z
    .string()
    .trim()
    .min(12, "Vision statement is required")
    .max(600, "Vision statement must be 600 characters or fewer"),
  mission: z
    .string()
    .trim()
    .min(12, "Mission statement is required")
    .max(600, "Mission statement must be 600 characters or fewer"),
});

const schoolContactSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(7, "Official phone number is required")
    .max(20, "Phone number must be 20 characters or fewer")
    .regex(
      SCHOOL_PHONE_PATTERN,
      "Enter a valid phone number, e.g. +254 712 345 678",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid school email address")
    .max(120, "Email must be 120 characters or fewer"),
  website: z.preprocess(
    blankToUndefined,
    z
      .string()
      .trim()
      .url("Website must be a full URL starting with https://")
      .max(160, "Website must be 160 characters or fewer")
      .optional(),
  ),
  address: optionalText(160, "Physical address"),
  city: optionalText(80, "City or town"),
  county: optionalText(80, "County"),
  postalCode: z.preprocess(
    blankToUndefined,
    z
      .string()
      .trim()
      .regex(/^\d{4,6}$/, "Postal code is 4 to 6 digits")
      .optional(),
  ),
});

export const submitSchoolOnboardingSchema = schoolInformationSchema
  .merge(schoolContactSchema)
  .extend({
    accurateInformation: z
      .boolean()
      .refine(
        (value) => value === true,
        "Confirm the school details are accurate",
      ),
  });

const wizardLocationSchema = z.object({
  county: z.string().trim().max(120),
  subCounty: z.string().trim().max(120),
  ward: z.string().trim().max(120),
  area: z.string().trim().max(160),
  latitude: z.string().trim().max(32).default(""),
  longitude: z.string().trim().max(32).default(""),
  nearestLandmark: z.string().trim().max(240).default(""),
});

const wizardBranchSchema = wizardLocationSchema.extend({
  name: z.string().trim().min(2).max(160),
});

const wizardOwnershipSchema = z.object({
  ownershipType: z.enum(["public", "private"]),
  schoolAdminName: z.string().trim().min(2).max(160),
  schoolAdminEmail: z.string().trim().toLowerCase().email().max(254),
  schoolAdminMobile: z.string().trim().regex(SCHOOL_PHONE_PATTERN),
  alternativeMobile: z
    .string()
    .trim()
    .max(20)
    .default("")
    .refine((value) => !value || SCHOOL_PHONE_PATTERN.test(value)),
});

function validateWizardLocation(location, path, context) {
  [
    ["county", "County is required"],
    ["subCounty", "Sub County is required"],
    ["ward", "Ward is required"],
    ["area", "Area is required"],
  ].forEach(([field, message]) => {
    if (!location[field]) {
      context.addIssue({
        code: "custom",
        path: [...path, field],
        message,
      });
    }
  });

  [
    ["latitude", -90, 90, "Latitude must be between -90 and 90"],
    ["longitude", -180, 180, "Longitude must be between -180 and 180"],
  ].forEach(([field, minimum, maximum, message]) => {
    const value = location[field];
    if (
      value &&
      (!Number.isFinite(Number(value)) ||
        Number(value) < minimum ||
        Number(value) > maximum)
    ) {
      context.addIssue({
        code: "custom",
        path: [...path, field],
        message,
      });
    }
  });
}

export const schoolWizardSchema = z
  .object({
    schoolCode: z.string().trim().regex(/^[A-Z0-9]{1,4}$/),
    schoolName: z.string().trim().min(2).max(200),
    schoolSlug: schoolSlugSchema,
    schoolNemisNo: z.string().trim().min(1).max(50),
    schoolKraPin: optionalText(32, "KRA PIN"),
    schoolMotto: z.string().trim().min(3).max(300),
    visionStatement: z.string().trim().min(10).max(3000),
    missionStatement: z.string().trim().min(10).max(3000),
    schoolType: z.enum(["standalone", "multi-branch"]),
    schoolLocation: wizardLocationSchema,
    branches: z.array(wizardBranchSchema).max(100),
    officialPhone: z.string().trim().min(9).max(20).regex(SCHOOL_PHONE_PATTERN),
    schoolEmail: z.string().trim().toLowerCase().email().max(254),
    website: z.preprocess(
      blankToUndefined,
      z.string().trim().url().max(500).optional(),
    ),
    headOfficeAddress: optionalText(500, "Head office address"),
    ownerships: z.array(wizardOwnershipSchema).min(1).max(50),
    confirmedAccurate: z.literal(true),
  })
  .superRefine((school, context) => {
    const adminEmails = school.ownerships.map(
        ({ schoolAdminEmail }) => schoolAdminEmail,
    );
    if (new Set(adminEmails).size !== adminEmails.length) {
        context.addIssue({
            code: "custom",
            path: ["ownerships"],
            message: "Each school admin must have a unique email address.",
        });
    }

    if (school.schoolType === "standalone") {
      validateWizardLocation(
        school.schoolLocation,
        ["schoolLocation"],
        context,
      );
      return;
    }

    if (school.branches.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["branches"],
        message: "Add at least one branch before continuing.",
      });
      return;
    }

    school.branches.forEach((branch, index) => {
      validateWizardLocation(branch, ["branches", index], context);
    });
  });

// Availability is a question, not a mutation: values are normalized here and classified by the
// service (AVAILABLE / TAKEN / RESERVED / INVALID) instead of rejected with a 400.
export const onboardingAvailabilityQuerySchema = z
  .object({
    slug: z.preprocess(
      blankToUndefined,
      z.string().trim().toLowerCase().max(80).optional(),
    ),
    phone: z.preprocess(blankToUndefined, z.string().trim().max(24).optional()),
  })
  .refine(
    (value) => Boolean(value.slug || value.phone),
    "Provide at least one of slug or phone",
  );

export const schoolCodeQuerySchema = z.object({
  name: z.string().trim().min(2).max(200),
});
