import { z } from 'zod';

const phonePattern = /^[+]?[\d\s()-]{9,20}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const locationDetailsShape = {
  county: z.string().trim(),
  subCounty: z.string().trim(),
  ward: z.string().trim(),
  area: z.string().trim(),
  latitude: z.string().trim(),
  longitude: z.string().trim(),
  nearestLandmark: z.string().trim(),
};
const locationDetailsSchema = z.object(locationDetailsShape);
const branchSchema = locationDetailsSchema.extend({
  name: z.string().trim(),
});

export const schoolInformationSchema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(2, 'School name must be at least 2 characters'),
  schoolCode: z
    .string()
    .trim()
    .min(2, 'School code is required')
    .max(20, 'School code must be 20 characters or fewer')
    .regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers, and hyphens only'),
  schoolSlug: z
    .string()
    .trim()
    .min(2, 'School slug is required')
    .regex(slugPattern, 'Use lowercase letters, numbers, and hyphens only'),
  schoolMotto: z.string().trim().min(3, 'School motto is required'),
  visionStatement: z
    .string()
    .trim()
    .min(10, 'Vision statement must be at least 10 characters'),
  missionStatement: z
    .string()
    .trim()
    .min(10, 'Mission statement must be at least 10 characters'),
  schoolType: z.enum(['standalone', 'multi-branch']),
});

export const schoolLocationSchema = z.object({
  schoolLocation: locationDetailsSchema,
  branches: z.array(branchSchema),
});

function validateLocationDetails(location, path, context) {
  const requiredFields = [
    ['county', 'County is required'],
    ['subCounty', 'Sub County is required'],
    ['ward', 'Ward is required'],
    ['area', 'Area is required'],
  ];

  requiredFields.forEach(([field, message]) => {
    if (!location[field]) {
      context.addIssue({
        code: 'custom',
        path: [...path, field],
        message,
      });
    }
  });

  [
    ['latitude', -90, 90, 'Latitude must be between -90 and 90'],
    ['longitude', -180, 180, 'Longitude must be between -180 and 180'],
  ].forEach(([field, min, max, message]) => {
    const value = location[field];
    if (value && (!Number.isFinite(Number(value)) || Number(value) < min || Number(value) > max)) {
      context.addIssue({
        code: 'custom',
        path: [...path, field],
        message,
      });
    }
  });
}

export const schoolBranchSchema = branchSchema
  .extend({
    name: z.string().trim().min(2, 'Branch name is required'),
  })
  .superRefine((branch, context) => {
    validateLocationDetails(branch, [], context);
  });

function validateSchoolLocations({ schoolType, schoolLocation, branches }, context) {
  if (schoolType === 'standalone') {
    validateLocationDetails(schoolLocation, ['schoolLocation'], context);
    return;
  }

  if (branches.length === 0) {
    context.addIssue({
      code: 'custom',
      path: ['schoolType'],
      message: 'Add at least one branch before continuing.',
    });
    return;
  }

  branches.forEach((branch, index) => {
    if (!branch.name) {
      context.addIssue({
        code: 'custom',
        path: ['branches', index, 'name'],
        message: 'Branch name is required',
      });
    }
    validateLocationDetails(branch, ['branches', index], context);
  });
}

export const schoolContactSchema = z.object({
  officialPhone: z
    .string()
    .trim()
    .min(9, 'Official phone number is required')
    .regex(phonePattern, 'Enter a valid phone number'),
  schoolEmail: z
    .string()
    .trim()
    .min(1, 'School email is required')
    .email('Enter a valid email address'),
  website: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => !value || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value),
      'Enter a valid URL including http:// or https://',
    ),
  headOfficeAddress: z.string().optional(),
});

const ownershipEntrySchema = z.object({
  ownershipType: z
    .string()
    .trim()
    .min(1, 'Select an ownership type')
    .refine((value) => value === 'public' || value === 'private', 'Choose Public or Private'),
  schoolAdminName: z.string().trim().min(2, 'School admin name is required'),
  schoolAdminEmail: z
    .string()
    .trim()
    .min(1, 'School admin email is required')
    .email('Enter a valid email address'),
  schoolAdminMobile: z
    .string()
    .trim()
    .min(1, 'School admin mobile is required')
    .regex(phonePattern, 'Enter a valid mobile number'),
  alternativeMobile: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || phonePattern.test(value), 'Enter a valid mobile number'),
});

export const schoolOwnershipSchema = z.object({
  ownerships: z.array(ownershipEntrySchema).min(1, 'Add at least one ownership entry'),
});

export const reviewSchema = z.object({
  confirmedAccurate: z
    .boolean()
    .refine((value) => value === true, 'Please confirm that the information is accurate'),
});

export const onboardingSchema = schoolInformationSchema
  .merge(schoolLocationSchema)
  .merge(schoolContactSchema)
  .merge(schoolOwnershipSchema)
  .merge(reviewSchema)
  .superRefine(validateSchoolLocations);

export const STEP_SCHEMAS = [
  schoolInformationSchema.passthrough(),
  schoolInformationSchema
    .merge(schoolLocationSchema)
    .passthrough()
    .superRefine(validateSchoolLocations),
  schoolInformationSchema
    .merge(schoolLocationSchema)
    .passthrough()
    .superRefine(validateSchoolLocations),
  schoolInformationSchema
    .merge(schoolLocationSchema)
    .merge(schoolContactSchema)
    .merge(schoolOwnershipSchema)
    .passthrough(),
  onboardingSchema,
];

export const defaultOnboardingValues = {
  schoolName: '',
  schoolCode: '',
  schoolSlug: '',
  schoolMotto: '',
  visionStatement: '',
  missionStatement: '',
  schoolType: 'standalone',
  schoolLocation: {
    county: '',
    subCounty: '',
    ward: '',
    area: '',
    latitude: '',
    longitude: '',
    nearestLandmark: '',
  },
  branches: [],
  officialPhone: '',
  schoolEmail: '',
  website: '',
  headOfficeAddress: '',
  ownerships: [
    {
      ownershipType: '',
      schoolAdminName: '',
      schoolAdminEmail: '',
      schoolAdminMobile: '',
      alternativeMobile: '',
    },
  ],
  confirmedAccurate: false,
};

export const STEP_FIELDS = {
  0: [
    'schoolName',
    'schoolCode',
    'schoolSlug',
    'schoolMotto',
    'visionStatement',
    'missionStatement',
    'schoolType',
  ],
  1: ['schoolType', 'schoolLocation', 'branches'],
  2: [],
  3: ['officialPhone', 'schoolEmail', 'website', 'headOfficeAddress', 'ownerships'],
  4: ['confirmedAccurate'],
};
