import {
  boolean,
  integer,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const schools = pgTable(
  'schools',
  {
    id: uuid('id').primaryKey(),
    schoolName: text('school_name').notNull(),
    schoolCode: text('school_code').notNull(),
    schoolSlug: text('school_slug').notNull(),
    schoolMotto: text('school_motto').notNull(),
    visionStatement: text('vision_statement').notNull(),
    missionStatement: text('mission_statement').notNull(),
    schoolType: text('school_type').notNull(),
    schoolLocation: jsonb('school_location'),
    officialPhone: text('official_phone').notNull(),
    schoolEmail: text('school_email').notNull(),
    website: text('website').notNull().default(''),
    headOfficeAddress: text('head_office_address').notNull().default(''),
    logoObjectKey: text('logo_object_key'),
    logoContentType: text('logo_content_type'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('schools_school_code_unique').on(table.schoolCode),
    uniqueIndex('schools_school_slug_unique').on(table.schoolSlug),
    index('schools_school_name_idx').on(table.schoolName),
  ],
);

export const schoolBranches = pgTable(
  'school_branches',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    county: text('county').notNull(),
    subCounty: text('sub_county').notNull(),
    ward: text('ward').notNull(),
    area: text('area').notNull(),
    latitude: text('latitude').notNull().default(''),
    longitude: text('longitude').notNull().default(''),
    nearestLandmark: text('nearest_landmark').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('school_branches_school_id_idx').on(table.schoolId)],
);

export const schoolOwnerships = pgTable(
  'school_ownerships',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    ownershipType: text('ownership_type').notNull(),
    schoolAdminName: text('school_admin_name').notNull(),
    schoolAdminEmail: text('school_admin_email').notNull(),
    schoolAdminMobile: text('school_admin_mobile').notNull(),
    alternativeMobile: text('alternative_mobile').notNull().default(''),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('school_ownerships_school_id_idx').on(table.schoolId)],
);

export const schoolDocuments = pgTable(
  'school_documents',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    documentType: text('document_type').notNull(),
    originalName: text('original_name').notNull(),
    contentType: text('content_type').notNull(),
    objectKey: text('object_key').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('school_documents_school_id_idx').on(table.schoolId)],
);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey(),
    fullName: text('full_name').notNull(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: text('role').notNull().default('school_admin'),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('users_email_unique').on(table.email)],
);

export const authSessions = pgTable(
  'auth_sessions',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('auth_sessions_token_hash_unique').on(table.tokenHash),
    index('auth_sessions_user_id_idx').on(table.userId),
    index('auth_sessions_expires_at_idx').on(table.expiresAt),
  ],
);

export const authChallenges = pgTable(
  'auth_challenges',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    purpose: text('purpose').notNull(),
    codeHash: text('code_hash').notNull(),
    attempts: integer('attempts').notNull().default(0),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('auth_challenges_user_purpose_idx').on(table.userId, table.purpose),
    index('auth_challenges_expires_at_idx').on(table.expiresAt),
  ],
);

export const schoolUserMemberships = pgTable(
  'school_user_memberships',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('school_user_memberships_user_school_unique').on(table.userId, table.schoolId),
    index('school_user_memberships_school_id_idx').on(table.schoolId),
  ],
);
