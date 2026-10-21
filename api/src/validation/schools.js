import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';

const phonePattern = /^[+]?[\d\s()-]{9,20}$/;

const locationSchema = z.object({
  county: z.string().trim().max(120),
  subCounty: z.string().trim().max(120),
  ward: z.string().trim().max(120),
  area: z.string().trim().max(160),
  latitude: z.string().trim().max(32).default(''),
  longitude: z.string().trim().max(32).default(''),
  nearestLandmark: z.string().trim().max(240).default(''),
}).superRefine((location, context) => {
  [
    ['latitude', -90, 90],
    ['longitude', -180, 180],
  ].forEach(([field, minimum, maximum]) => {
    const value = location[field];
    if (value && (!Number.isFinite(Number(value)) || Number(value) < minimum || Number(value) > maximum)) {
      context.addIssue({
        code: 'custom',
        path: [field],
        message: `${field === 'latitude' ? 'Latitude' : 'Longitude'} is outside its valid range.`,
      });
    }
  });
});

const branchSchema = locationSchema
  .extend({
    name: z.string().trim().min(2).max(160),
  })
  .superRefine((location, context) => {
    [
      ['county', 'County is required.'],
      ['subCounty', 'Sub County is required.'],
      ['ward', 'Ward is required.'],
      ['area', 'Area is required.'],
    ].forEach(([field, message]) => {
      if (!location[field]) {
        context.addIssue({ code: 'custom', path: [field], message });
      }
    });
  });

const ownershipSchema = z.object({
  ownershipType: z.enum(['public', 'private']),
  schoolAdminName: z.string().trim().min(2).max(160),
  schoolAdminEmail: z.string().trim().email().max(254),
  schoolAdminMobile: z.string().trim().regex(phonePattern),
  alternativeMobile: z.string().trim().max(20).default('').refine((value) => !value || phonePattern.test(value)),
});

const mutableSchoolFields = {
  schoolSlug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  schoolMotto: z.string().trim().min(3).max(300),
  schoolNemisNo: z.string().trim().max(50).optional(),
  schoolKraPin: z.string().trim().max(32).optional(),
  visionStatement: z.string().trim().min(10).max(3000),
  missionStatement: z.string().trim().min(10).max(3000),
  schoolType: z.enum(['standalone', 'multi-branch']),
  schoolLocation: locationSchema,
  branches: z.array(branchSchema).max(100),
  officialPhone: z.string().trim().min(9).max(20).regex(phonePattern),
  schoolEmail: z.string().trim().email().max(254),
  website: z.string().trim().max(500).refine((value) => !value || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value)),
  headOfficeAddress: z.string().trim().max(500),
  ownerships: z.array(ownershipSchema).min(1).max(50),
};

const locationRefinement = (school, context) => {
  if (school.schoolType === 'standalone') {
    [
      ['county', 'County is required.'],
      ['subCounty', 'Sub County is required.'],
      ['ward', 'Ward is required.'],
      ['area', 'Area is required.'],
    ].forEach(([field, message]) => {
      if (!school.schoolLocation?.[field]) {
        context.addIssue({ code: 'custom', path: ['schoolLocation', field], message });
      }
    });
    return;
  }

  if (school.branches.length === 0) {
    context.addIssue({
      code: 'custom',
      path: ['branches'],
      message: 'A multi-branch school must have at least one branch.',
    });
  }
};

export const createSchoolSchema = z.object({
  schoolName: z.string().trim().min(2).max(200),
  ...mutableSchoolFields,
  confirmedAccurate: z.literal(true).optional(),
}).superRefine(locationRefinement);

export const updateSchoolSchema = z
  .object({
    ...mutableSchoolFields,
    schoolName: z.string().trim().min(2).max(200).optional(),
  })
  .superRefine(locationRefinement);

export const addBranchSchema = branchSchema;

export function sanitizeSchoolData(value) {
  if (typeof value === 'string') {
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
  }
  if (Array.isArray(value)) return value.map(sanitizeSchoolData);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeSchoolData(item)]),
    );
  }
  return value;
}
