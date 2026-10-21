import {
  boolean,
  check,
  date,
  foreignKey,
  integer,
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  time,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const roleEnum = pgEnum('Role', [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'TEACHER',
  'STAFF',
  'STUDENT',
  'PARENT',
  'BURSAR',
]);
export const genderEnum = pgEnum('Gender', ['MALE', 'FEMALE', 'OTHER']);
export const parentRelationEnum = pgEnum('ParentRelation', ['MOTHER', 'FATHER', 'GUARDIAN']);
export const staffModuleEnum = pgEnum('StaffModule', [
  'STUDENTS',
  'ATTENDANCE',
  'TIMETABLE',
  'EXAMS',
  'CBC',
  'FEES',
  'REPORTS',
]);
export const auditActionEnum = pgEnum('AuditAction', [
  'CREATE',
  'UPDATE',
  'DELETE',
  'AUTH_LOGIN_SUCCESS',
  'AUTH_LOGIN_FAILED',
  'AUTH_REFRESH_TOKEN_REUSE',
  'AUTH_LOGOUT',
  'PASSWORD_CHANGED',
  'PASSWORD_CHANGE_FAILED',
  'ACCOUNT_LOCKED',
  'IMPERSONATION_STARTED',
  'IMPERSONATED_ACTION',
  'IMPERSONATION_ENDED',
  'PAYMENT_RECORDED',
  'PAYMENT_ALLOCATED',
  'PAYMENT_REFUNDED',
  'INVOICE_ISSUED',
  'PAYROLL_PROCESSED',
  'INVITE',
]);
export const bloodGroupEnum = pgEnum('BloodGroup', [
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
]);
export const admissionApplicationStatusEnum = pgEnum('AdmissionApplicationStatus', [
  'SUBMITTED',
  'RESUBMITTED',
  'UNDER_REVIEW',
  'RETURNED',
  'ACCEPTED',
  'WAITLISTED',
  'REJECTED',
  'WITHDRAWN',
  'ENROLLED',
]);
export const enrollmentStatusEnum = pgEnum('EnrollmentStatus', [
  'ACTIVE',
  'COMPLETED',
  'TRANSFERRED',
  'GRADUATED',
  'WITHDRAWN',
]);
export const curriculumEnum = pgEnum('Curriculum', ['KCSE', 'CBC', 'CAMBRIDGE', 'IB']);
export const curriculumFrameworkStatusEnum = pgEnum('CurriculumFrameworkStatus', [
  'DRAFT',
  'ACTIVE',
  'ARCHIVED',
  'LEGACY',
]);
export const weekdayEnum = pgEnum('Weekday', [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]);
export const attendanceStatusEnum = pgEnum('AttendanceStatus', [
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED',
]);
export const assessmentTypeEnum = pgEnum('AssessmentType', [
  'DIAGNOSTIC',
  'FORMATIVE',
  'SCHOOL_BASED_ASSESSMENT',
  'PROJECT',
  'PRACTICAL',
  'OBSERVATION',
  'PORTFOLIO',
  'ORAL',
  'WRITTEN',
  'PERFORMANCE',
  'NATIONAL_ASSESSMENT',
]);
export const competencyLevelEnum = pgEnum('CompetencyLevel', [
  'EXCEEDING_EXPECTATION',
  'MEETING_EXPECTATION',
  'APPROACHING_EXPECTATION',
  'BELOW_EXPECTATION',
]);
export const invoiceStatusEnum = pgEnum('InvoiceStatus', [
  'UNPAID',
  'PARTIALLY_PAID',
  'PAID',
  'OVERDUE',
]);
export const allocationStatusEnum = pgEnum('AllocationStatus', ['ACTIVE', 'REVERSED']);
export const creditNoteStatusEnum = pgEnum('CreditNoteStatus', [
  'ISSUED',
  'PARTIALLY_APPLIED',
  'APPLIED',
  'REFUNDED',
  'VOIDED',
]);
export const refundStatusEnum = pgEnum('RefundStatus', [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]);
export const feeReminderProviderEnum = pgEnum('FeeReminderProvider', ['GMAIL', 'OUTLOOK']);
export const feeReminderStatusEnum = pgEnum('FeeReminderStatus', [
  'PENDING',
  'SENT',
  'FAILED',
  'SKIPPED',
]);
export const creditNoteReasonEnum = pgEnum('CreditNoteReason', [
  'OVERPAYMENT',
  'REFUND',
  'REVERSAL',
  'ADJUSTMENT',
  'WRONG_INVOICE',
  'DUPLICATE',
  'CHARGEBACK',
]);
export const paymentMethodEnum = pgEnum('PaymentMethod', [
  'MPESA',
  'CASH',
  'CHEQUE',
  'BANK_DEPOSIT',
  'BANK_TRANSFER',
  'CARD',
]);
export const paymentStatusEnum = pgEnum('PaymentStatus', ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']);
export const ledgerDirectionEnum = pgEnum('LedgerDirection', ['DEBIT', 'CREDIT']);
export const allowanceApplicabilityEnum = pgEnum('AllowanceApplicability', [
  'ALL_EMPLOYEES',
  'TEACHERS',
  'STAFF',
  'JOB_GROUP',
]);
export const loanStatusEnum = pgEnum('LoanStatus', [
  'ACTIVE',
  'PARTIALLY_PAID',
  'COMPLETED',
  'DEFAULTED',
]);
export const loanRequestStatusEnum = pgEnum('LoanRequestStatus', [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
]);
export const loanSourceTypeEnum = pgEnum('LoanSourceType', ['SCHOOL', 'BANK', 'SACCO', 'OTHER']);
export const payrollStatusEnum = pgEnum('PayrollStatus', [
  'PENDING',
  'DRAFT',
  'PROCESSING',
  'PENDING_APPROVAL',
  'APPROVED',
  'PAID',
]);
export const contractTypeEnum = pgEnum('ContractType', [
  'PERMANENT',
  'CONTRACT',
  'FIXED_TERM',
  'CASUAL',
  'INTERNSHIP',
]);
export const leaveStatusEnum = pgEnum('LeaveStatus', ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);
export const resignationStatusEnum = pgEnum('ResignationStatus', [
  'PENDING',
  'REVIEWED',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
]);

export const schools = pgTable(
  'schools',
  {
    id: uuid('id').primaryKey(),
    schoolName: text('school_name').notNull(),
    schoolCode: text('school_code').notNull(),
    schoolSlug: text('school_slug').notNull(),
    schoolNemisNo: text('school_nemis_no'),
    schoolKraPin: text('school_kra_pin'),
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
    isActive: boolean('is_active').notNull().default(true),
    nextTeacherSequence: integer('next_teacher_sequence').notNull().default(0),
    nextStaffSequence: integer('next_staff_sequence').notNull().default(0),
    nextStudentSequence: integer('next_student_sequence').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('schools_school_code_unique').on(table.schoolCode),
    uniqueIndex('schools_school_slug_unique').on(table.schoolSlug),
    uniqueIndex('schools_school_nemis_no_unique')
      .on(table.schoolNemisNo)
      .where(sql`${table.schoolNemisNo} IS NOT NULL AND ${table.schoolNemisNo} <> ''`),
    uniqueIndex('schools_school_kra_pin_unique')
      .on(table.schoolKraPin)
      .where(sql`${table.schoolKraPin} IS NOT NULL AND ${table.schoolKraPin} <> ''`),
    uniqueIndex('schools_official_phone_nonempty_unique')
      .on(table.officialPhone)
      .where(sql`${table.officialPhone} <> ''`),
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
  (table) => [
    uniqueIndex('school_branches_id_school_unique').on(table.id, table.schoolId),
    index('school_branches_school_id_idx').on(table.schoolId),
  ],
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
  (table) => [
    uniqueIndex('school_ownerships_one_primary_per_school_unique')
      .on(table.schoolId)
      .where(sql`${table.isPrimary}`),
    index('school_ownerships_school_id_idx').on(table.schoolId),
  ],
);

export const jobGroups = pgTable(
  'job_groups',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    code: text('code').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('job_groups_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('job_groups_school_code_unique').on(table.schoolId, table.code),
    index('job_groups_school_id_idx').on(table.schoolId),
  ],
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
    username: text('username'),
    email: text('email').notNull(),
    phone: text('phone'),
    passwordHash: text('password_hash').notNull(),
    role: roleEnum('role').notNull().default('ADMIN'),
    schoolId: uuid('school_id').references(() => schools.id, { onDelete: 'set null' }),
    isActive: boolean('is_active').notNull().default(true),
    mustChangePassword: boolean('must_change_password').notNull().default(false),
    authProvider: text('auth_provider').notNull().default('LOCAL'),
    googleSubject: text('google_subject'),
    currentSessionId: uuid('current_session_id'),
    failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
    lockedUntil: timestamp('locked_until', { withTimezone: true }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    lastLoginIp: text('last_login_ip'),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('users_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('users_email_unique').on(table.email),
    uniqueIndex('users_username_unique').on(table.username),
    uniqueIndex('users_phone_unique').on(table.phone),
    uniqueIndex('users_google_subject_unique').on(table.googleSubject),
    index('users_school_id_idx').on(table.schoolId),
  ],
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

export const schoolSettings = pgTable(
  'school_settings',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    mpesaShortcode: text('mpesa_shortcode'),
    mpesaEnabled: boolean('mpesa_enabled').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('school_settings_school_id_unique').on(table.schoolId),
    uniqueIndex('school_settings_mpesa_shortcode_unique').on(table.mpesaShortcode),
  ],
);

export const userPasswordHistory = pgTable(
  'user_password_history',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('user_password_history_user_created_idx').on(table.userId, table.createdAt)],
);

export const passwordResetOtps = pgTable(
  'password_reset_otps',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    codeHash: text('code_hash').notNull(),
    challengeTokenHash: text('challenge_token_hash'),
    purpose: text('purpose').notNull(),
    isResend: boolean('is_resend').notNull().default(false),
    attempts: integer('attempts').notNull().default(0),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('password_reset_otps_user_purpose_created_idx').on(
      table.userId,
      table.purpose,
      table.createdAt,
    ),
    uniqueIndex('password_reset_otps_challenge_token_unique').on(table.challengeTokenHash),
  ],
);

export const refreshSessions = pgTable(
  'refresh_sessions',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    familyId: uuid('family_id').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    replacedById: text('replaced_by_id'),
    reusedAt: timestamp('reused_at', { withTimezone: true }),
    isImpersonated: boolean('is_impersonated').notNull().default(false),
    impersonatedUserId: uuid('impersonated_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    actorSessionId: uuid('actor_session_id'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('refresh_sessions_token_hash_unique').on(table.tokenHash),
    index('refresh_sessions_user_id_idx').on(table.userId),
    index('refresh_sessions_family_id_idx').on(table.familyId),
  ],
);

export const staffModuleAccess = pgTable(
  'staff_module_access',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    module: staffModuleEnum('module').notNull(),
    grantedById: uuid('granted_by_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('staff_module_access_user_module_unique').on(table.userId, table.module),
    index('staff_module_access_school_id_idx').on(table.schoolId),
  ],
);

function employeeProfileColumns() {
  return {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id'),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),
    nationalIdNumber: text('national_id_number'),
    passportNumber: text('passport_number'),
    employeeKey: text('employee_key')
      .notNull()
      .references(() => employeeNumbers.ownerKey),
    nssfNumber: text('nssf_number'),
    kraPin: text('kra_pin'),
    shaNumber: text('sha_number'),
    jobGroupId: uuid('job_group_id').references(() => jobGroups.id),
    hireDate: timestamp('hire_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  };
}

export const teachers = pgTable(
  'teachers',
  employeeProfileColumns(),
  (table) => [
    uniqueIndex('teachers_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.branchId, table.schoolId],
      foreignColumns: [schoolBranches.id, schoolBranches.schoolId],
      name: 'teachers_branch_school_fk',
    }),
    foreignKey({
      columns: [table.userId, table.schoolId],
      foreignColumns: [users.id, users.schoolId],
      name: 'teachers_user_school_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.jobGroupId, table.schoolId],
      foreignColumns: [jobGroups.id, jobGroups.schoolId],
      name: 'teachers_job_group_school_fk',
    }),
    uniqueIndex('teachers_user_id_unique').on(table.userId),
    uniqueIndex('teachers_employee_key_unique').on(table.employeeKey),
    index('teachers_school_id_idx').on(table.schoolId),
    uniqueIndex('teachers_school_nssf_unique').on(table.schoolId, table.nssfNumber),
    uniqueIndex('teachers_school_kra_unique').on(table.schoolId, table.kraPin),
    uniqueIndex('teachers_school_sha_unique').on(table.schoolId, table.shaNumber),
    uniqueIndex('teachers_school_national_id_unique').on(table.schoolId, table.nationalIdNumber),
    uniqueIndex('teachers_school_passport_unique').on(table.schoolId, table.passportNumber),
  ],
);

export const staff = pgTable(
  'staff',
  {
    ...employeeProfileColumns(),
    department: text('department').notNull(),
    jobTitle: text('job_title').notNull(),
  },
  (table) => [
    uniqueIndex('staff_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.branchId, table.schoolId],
      foreignColumns: [schoolBranches.id, schoolBranches.schoolId],
      name: 'staff_branch_school_fk',
    }),
    foreignKey({
      columns: [table.userId, table.schoolId],
      foreignColumns: [users.id, users.schoolId],
      name: 'staff_user_school_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.jobGroupId, table.schoolId],
      foreignColumns: [jobGroups.id, jobGroups.schoolId],
      name: 'staff_job_group_school_fk',
    }),
    uniqueIndex('staff_user_id_unique').on(table.userId),
    uniqueIndex('staff_employee_key_unique').on(table.employeeKey),
    index('staff_school_id_idx').on(table.schoolId),
    uniqueIndex('staff_school_nssf_unique').on(table.schoolId, table.nssfNumber),
    uniqueIndex('staff_school_kra_unique').on(table.schoolId, table.kraPin),
    uniqueIndex('staff_school_sha_unique').on(table.schoolId, table.shaNumber),
    uniqueIndex('staff_school_national_id_unique').on(table.schoolId, table.nationalIdNumber),
    uniqueIndex('staff_school_passport_unique').on(table.schoolId, table.passportNumber),
  ],
);

export const students = pgTable(
  'students',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id'),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),
    nationalIdNumber: text('national_id_number'),
    passportNumber: text('passport_number'),
    birthCertificateNumber: text('birth_certificate_number'),
    admissionNo: text('admission_no'),
    dateOfBirth: date('date_of_birth'),
    gender: genderEnum('gender'),
    bloodGroup: bloodGroupEnum('blood_group'),
    admissionDate: date('admission_date').notNull().defaultNow(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.branchId, table.schoolId],
      foreignColumns: [schoolBranches.id, schoolBranches.schoolId],
      name: 'students_branch_school_fk',
    }),
    uniqueIndex('students_user_id_unique').on(table.userId),
    index('students_school_id_idx').on(table.schoolId),
    uniqueIndex('students_school_admission_no_unique').on(table.schoolId, table.admissionNo),
    uniqueIndex('students_school_national_id_unique').on(table.schoolId, table.nationalIdNumber),
    uniqueIndex('students_school_birth_certificate_unique').on(table.schoolId, table.birthCertificateNumber),
    uniqueIndex('students_school_passport_unique').on(table.schoolId, table.passportNumber),
    uniqueIndex('students_id_school_unique').on(table.id, table.schoolId),
  ],
);

export const parents = pgTable(
  'parents',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),
    nationalIdNumber: text('national_id_number'),
    passportNumber: text('passport_number'),
    phone: text('phone'),
    email: text('email'),
    relation: parentRelationEnum('relation'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('parents_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('parents_user_id_unique').on(table.userId),
    index('parents_school_id_idx').on(table.schoolId),
    uniqueIndex('parents_school_national_id_unique').on(table.schoolId, table.nationalIdNumber),
    uniqueIndex('parents_school_phone_unique').on(table.schoolId, table.phone),
    uniqueIndex('parents_school_email_unique').on(table.schoolId, table.email),
    uniqueIndex('parents_school_passport_unique').on(table.schoolId, table.passportNumber),
  ],
);

export const parentStudents = pgTable(
  'student_parents',
  {
    parentId: uuid('parent_id')
      .notNull()
      .references(() => parents.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    isPrimaryContact: boolean('is_primary_contact').notNull().default(false),
    isFinanciallyResponsible: boolean('is_financially_responsible').notNull().default(false),
    canPickUp: boolean('can_pick_up').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.studentId, table.parentId] }),
  ],
);

export const employeeNumbers = pgTable(
  'employee_numbers',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    employeeNo: text('employee_no').notNull(),
    ownerKey: text('owner_key').notNull(),
  },
  (table) => [
    uniqueIndex('employee_numbers_school_employee_no_unique').on(table.schoolId, table.employeeNo),
    uniqueIndex('employee_numbers_owner_key_unique').on(table.ownerKey),
  ],
);

export const systemSequences = pgTable('system_sequences', {
  key: text('key').primaryKey(),
  nextSchoolCode: integer('next_school_code').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey(),
    action: auditActionEnum('action').notNull(),
    actorId: uuid('actor_id'),
    schoolId: uuid('school_id').references(() => schools.id, { onDelete: 'set null' }),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    traceId: text('trace_id').notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('audit_logs_school_id_idx').on(table.schoolId),
    index('audit_logs_entity_type_entity_id_idx').on(table.entityType, table.entityId),
    index('audit_logs_action_created_at_idx').on(table.action, table.createdAt),
  ],
);

export const activationTokens = pgTable(
  'activation_tokens',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    isUsed: boolean('is_used').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('activation_tokens_token_hash_unique').on(table.tokenHash),
    index('activation_tokens_user_expires_idx').on(table.userId, table.expiresAt),
  ],
);

export const admissionSequences = pgTable(
  'admission_sequences',
  {
    schoolId: uuid('school_id').notNull(),
    year: integer('year').notNull(),
    nextVal: integer('next_val').notNull().default(1),
  },
  (table) => [primaryKey({ columns: [table.schoolId, table.year] })],
);

export const admissionApplicationSequences = pgTable(
  'admission_application_sequences',
  {
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id),
    year: integer('year').notNull(),
    nextVal: integer('next_val').notNull().default(1),
  },
  (table) => [primaryKey({ columns: [table.schoolId, table.year] })],
);

export const fileUploads = pgTable(
  'file_uploads',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id),
    fileName: text('file_name').notNull(),
    originalName: text('original_name').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    storageKey: text('storage_key').notNull(),
    storageBucket: text('storage_bucket').notNull(),
    url: text('url'),
    relatedType: text('related_type'),
    relatedId: text('related_id'),
    uploadedById: uuid('uploaded_by_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('file_uploads_related_idx').on(table.relatedType, table.relatedId)],
);

export const backgroundJobs = pgTable(
  'background_jobs',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').references(() => schools.id),
    type: text('type').notNull(),
    status: text('status').notNull().default('QUEUED'),
    payload: jsonb('payload').notNull(),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(3),
    availableAt: timestamp('available_at', { withTimezone: true }).notNull().defaultNow(),
    lockedAt: timestamp('locked_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    error: text('error'),
    result: jsonb('result'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('background_jobs_status_available_idx').on(table.status, table.availableAt),
    index('background_jobs_school_type_status_idx').on(table.schoolId, table.type, table.status),
  ],
);

export const admissionApplications = pgTable(
  'admission_applications',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id),
    applicationNo: text('application_no').notNull(),
    academicYearId: uuid('academic_year_id').notNull(),
    requestedStreamId: uuid('requested_stream_id').notNull(),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),
    nationalIdNumber: text('national_id_number'),
    birthCertificateNumber: text('birth_certificate_number').notNull(),
    passportNumber: text('passport_number'),
    dateOfBirth: date('date_of_birth').notNull(),
    gender: genderEnum('gender').notNull(),
    guardianFirstName: text('guardian_first_name'),
    guardianMiddleName: text('guardian_middle_name'),
    guardianLastName: text('guardian_last_name'),
    guardianPhone: text('guardian_phone'),
    guardianEmail: text('guardian_email'),
    guardianRelation: parentRelationEnum('guardian_relation'),
    guardianNationalIdNumber: text('guardian_national_id_number'),
    guardianPassportNumber: text('guardian_passport_number'),
    status: admissionApplicationStatusEnum('status').notNull().default('SUBMITTED'),
    notes: text('notes'),
    createdById: uuid('created_by_id').notNull(),
    reviewedById: uuid('reviewed_by_id'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    convertedStudentId: uuid('converted_student_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.academicYearId, table.schoolId],
      foreignColumns: [academicYears.id, academicYears.schoolId],
    }),
    foreignKey({
      columns: [table.requestedStreamId, table.schoolId],
      foreignColumns: [streams.id, streams.schoolId],
    }),
    foreignKey({
      columns: [table.convertedStudentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'admission_applications_converted_student_school_fk',
    }),
    uniqueIndex('admission_applications_school_application_no_unique').on(
      table.schoolId,
      table.applicationNo,
    ),
    uniqueIndex('admission_applications_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('admission_applications_converted_student_school_unique').on(
      table.convertedStudentId,
      table.schoolId,
    ),
    index('admission_applications_school_status_created_idx').on(
      table.schoolId,
      table.status,
      table.createdAt,
    ),
    index('admission_applications_school_year_idx').on(table.schoolId, table.academicYearId),
  ],
);

export const admissionApplicationEvents = pgTable(
  'admission_application_events',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id')
      .notNull()
      .references(() => schools.id),
    applicationId: uuid('application_id').notNull(),
    actorId: uuid('actor_id').notNull(),
    fromStatus: admissionApplicationStatusEnum('from_status'),
    toStatus: admissionApplicationStatusEnum('to_status').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.applicationId, table.schoolId],
      foreignColumns: [admissionApplications.id, admissionApplications.schoolId],
      name: 'admission_app_events_application_school_fk',
      onDelete: 'cascade',
    }),
    index('admission_app_events_school_application_created_idx').on(
      table.schoolId,
      table.applicationId,
      table.createdAt,
    ),
  ],
);

export const academicYears = pgTable(
  'academic_years',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    isCurrent: boolean('is_current').notNull().default(false),
  },
  (table) => [
    uniqueIndex('academic_years_school_name_unique').on(table.schoolId, table.name),
    uniqueIndex('academic_years_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('academic_years_one_current_per_school_unique')
      .on(table.schoolId)
      .where(sql`${table.isCurrent}`),
    check('academic_years_date_range_check', sql`${table.endDate} >= ${table.startDate}`),
    index('academic_years_school_id_idx').on(table.schoolId),
  ],
);

export const terms = pgTable(
  'terms',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    academicYearId: uuid('academic_year_id').notNull().references(() => academicYears.id),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
  },
  (table) => [
    uniqueIndex('terms_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.academicYearId, table.schoolId],
      foreignColumns: [academicYears.id, academicYears.schoolId],
      name: 'terms_academic_year_school_fk',
    }),
    uniqueIndex('terms_academic_year_name_unique').on(table.academicYearId, table.name),
    check('terms_date_range_check', sql`${table.endDate} >= ${table.startDate}`),
    index('terms_school_id_idx').on(table.schoolId),
  ],
);

export const curriculumFrameworks = pgTable(
  'curriculum_frameworks',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    code: text('code').notNull(),
    name: text('name').notNull(),
    version: text('version'),
    startYear: integer('start_year'),
    endYear: integer('end_year'),
    status: curriculumFrameworkStatusEnum('status').notNull().default('ACTIVE'),
    isDefault: boolean('is_default').notNull().default(false),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('curriculum_frameworks_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('curriculum_frameworks_school_code_unique').on(table.schoolId, table.code),
    index('curriculum_frameworks_school_id_idx').on(table.schoolId),
  ],
);

export const educationLevels = pgTable(
  'education_levels',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    curriculumFrameworkId: uuid('curriculum_framework_id')
      .notNull()
      .references(() => curriculumFrameworks.id),
    name: text('name').notNull(),
    code: text('code').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    parentId: uuid('parent_id'),
  },
  (table) => [
    uniqueIndex('education_levels_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('education_levels_id_framework_unique').on(table.id, table.curriculumFrameworkId),
    uniqueIndex('education_levels_framework_code_unique').on(table.curriculumFrameworkId, table.code),
    foreignKey({
      columns: [table.curriculumFrameworkId, table.schoolId],
      foreignColumns: [curriculumFrameworks.id, curriculumFrameworks.schoolId],
      name: 'education_levels_framework_school_fk',
    }),
    foreignKey({
      columns: [table.parentId, table.curriculumFrameworkId],
      foreignColumns: [table.id, table.curriculumFrameworkId],
      name: 'education_levels_parent_framework_fk',
    }),
    index('education_levels_school_id_idx').on(table.schoolId),
  ],
);

export const grades = pgTable(
  'grades',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    curriculumFrameworkId: uuid('curriculum_framework_id')
      .notNull()
      .references(() => curriculumFrameworks.id),
    educationLevelId: uuid('education_level_id').notNull().references(() => educationLevels.id),
    name: text('name').notNull(),
    code: text('code').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    active: boolean('active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('grades_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('grades_framework_code_unique').on(table.curriculumFrameworkId, table.code),
    foreignKey({
      columns: [table.curriculumFrameworkId, table.schoolId],
      foreignColumns: [curriculumFrameworks.id, curriculumFrameworks.schoolId],
      name: 'grades_framework_school_fk',
    }),
    foreignKey({
      columns: [table.educationLevelId, table.schoolId],
      foreignColumns: [educationLevels.id, educationLevels.schoolId],
      name: 'grades_education_level_school_fk',
    }),
    index('grades_school_id_idx').on(table.schoolId),
  ],
);

export const pathways = pgTable(
  'pathways',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    curriculumFrameworkId: uuid('curriculum_framework_id')
      .notNull()
      .references(() => curriculumFrameworks.id),
    code: text('code').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    active: boolean('active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('pathways_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('pathways_framework_code_unique').on(table.curriculumFrameworkId, table.code),
    foreignKey({
      columns: [table.curriculumFrameworkId, table.schoolId],
      foreignColumns: [curriculumFrameworks.id, curriculumFrameworks.schoolId],
      name: 'pathways_framework_school_fk',
    }),
    index('pathways_school_id_idx').on(table.schoolId),
  ],
);

export const classLevels = pgTable(
  'class_levels',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    curriculum: curriculumEnum('curriculum').notNull().default('KCSE'),
  },
  (table) => [
    uniqueIndex('class_levels_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('class_levels_school_name_unique').on(table.schoolId, table.name),
    index('class_levels_school_id_idx').on(table.schoolId),
  ],
);

export const streams = pgTable(
  'streams',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    classLevelId: uuid('class_level_id').notNull().references(() => classLevels.id),
    gradeId: uuid('grade_id').references(() => grades.id),
  },
  (table) => [
    foreignKey({
      columns: [table.classLevelId, table.schoolId],
      foreignColumns: [classLevels.id, classLevels.schoolId],
      name: 'streams_class_level_school_fk',
    }),
    foreignKey({
      columns: [table.gradeId, table.schoolId],
      foreignColumns: [grades.id, grades.schoolId],
      name: 'streams_grade_school_fk',
    }),
    uniqueIndex('streams_class_level_name_unique').on(table.classLevelId, table.name),
    uniqueIndex('streams_id_school_unique').on(table.id, table.schoolId),
    index('streams_school_id_idx').on(table.schoolId),
  ],
);

export const subjects = pgTable(
  'subjects',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    code: text('code').notNull(),
    curriculum: curriculumEnum('curriculum').notNull().default('KCSE'),
  },
  (table) => [
    uniqueIndex('subjects_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('subjects_school_code_unique').on(table.schoolId, table.code),
    index('subjects_school_id_idx').on(table.schoolId),
  ],
);

export const teacherSubjects = pgTable(
  'teacher_subjects',
  {
    teacherId: uuid('teacher_id')
      .notNull()
      .references(() => teachers.id),
    subjectId: uuid('subject_id')
      .notNull()
      .references(() => subjects.id),
  },
  (table) => [primaryKey({ columns: [table.teacherId, table.subjectId] })],
);

export const classSubjects = pgTable(
  'class_subjects',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    streamId: uuid('stream_id').notNull().references(() => streams.id),
    subjectId: uuid('subject_id').notNull().references(() => subjects.id),
    teacherId: uuid('teacher_id').notNull().references(() => teachers.id),
  },
  (table) => [
    uniqueIndex('class_subjects_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.streamId, table.schoolId],
      foreignColumns: [streams.id, streams.schoolId],
      name: 'class_subjects_stream_school_fk',
    }),
    foreignKey({
      columns: [table.subjectId, table.schoolId],
      foreignColumns: [subjects.id, subjects.schoolId],
      name: 'class_subjects_subject_school_fk',
    }),
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'class_subjects_teacher_school_fk',
    }),
    uniqueIndex('class_subjects_stream_subject_unique').on(table.streamId, table.subjectId),
    index('class_subjects_school_id_idx').on(table.schoolId),
  ],
);

export const timetableSlots = pgTable(
  'timetable_slots',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    streamId: uuid('stream_id').notNull().references(() => streams.id),
    classSubjectId: uuid('class_subject_id').notNull().references(() => classSubjects.id),
    day: weekdayEnum('day').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    room: text('room'),
  },
  (table) => [
    foreignKey({
      columns: [table.streamId, table.schoolId],
      foreignColumns: [streams.id, streams.schoolId],
      name: 'timetable_slots_stream_school_fk',
    }),
    foreignKey({
      columns: [table.classSubjectId, table.schoolId],
      foreignColumns: [classSubjects.id, classSubjects.schoolId],
      name: 'timetable_slots_class_subject_school_fk',
    }),
    check('timetable_slots_time_range_check', sql`${table.endTime} > ${table.startTime}`),
    index('timetable_slots_school_id_idx').on(table.schoolId),
  ],
);

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    streamId: uuid('stream_id').notNull().references(() => streams.id),
    academicYearId: uuid('academic_year_id').notNull().references(() => academicYears.id),
    gradeId: uuid('grade_id').references(() => grades.id),
    pathwayId: uuid('pathway_id').references(() => pathways.id),
    enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow(),
    status: enrollmentStatusEnum('status').notNull().default('ACTIVE'),
  },
  (table) => [
    uniqueIndex('enrollments_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'enrollments_student_school_fk',
    }),
    foreignKey({
      columns: [table.streamId, table.schoolId],
      foreignColumns: [streams.id, streams.schoolId],
      name: 'enrollments_stream_school_fk',
    }),
    foreignKey({
      columns: [table.academicYearId, table.schoolId],
      foreignColumns: [academicYears.id, academicYears.schoolId],
      name: 'enrollments_academic_year_school_fk',
    }),
    foreignKey({
      columns: [table.gradeId, table.schoolId],
      foreignColumns: [grades.id, grades.schoolId],
      name: 'enrollments_grade_school_fk',
    }),
    foreignKey({
      columns: [table.pathwayId, table.schoolId],
      foreignColumns: [pathways.id, pathways.schoolId],
      name: 'enrollments_pathway_school_fk',
    }),
    uniqueIndex('enrollments_student_year_unique').on(table.studentId, table.academicYearId),
    index('enrollments_school_id_idx').on(table.schoolId),
  ],
);

export const studentTransportAssignments = pgTable(
  'student_transport_assignments',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id').notNull(),
    routeName: text('route_name').notNull(),
    vehicleRegistration: text('vehicle_registration').notNull(),
    pickupLocation: text('pickup_location').notNull(),
    dropoffLocation: text('dropoff_location').notNull(),
    driverName: text('driver_name'),
    driverPhone: text('driver_phone'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'student_transport_assignments_student_school_fk',
    }).onDelete('cascade'),
    uniqueIndex('student_transport_assignments_student_school_unique').on(
      table.studentId,
      table.schoolId,
    ),
    index('student_transport_assignments_school_route_idx').on(table.schoolId, table.routeName),
  ],
);

export const pathwayLearningAreas = pgTable(
  'pathway_learning_areas',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    pathwayId: uuid('pathway_id').notNull().references(() => pathways.id),
    learningAreaId: uuid('learning_area_id').notNull(),
    required: boolean('required').notNull().default(false),
    elective: boolean('elective').notNull().default(false),
    cluster: text('cluster'),
  },
  (table) => [
    foreignKey({
      columns: [table.pathwayId, table.schoolId],
      foreignColumns: [pathways.id, pathways.schoolId],
      name: 'pathway_learning_areas_pathway_school_fk',
    }),
    foreignKey({
      columns: [table.learningAreaId, table.schoolId],
      foreignColumns: [learningAreas.id, learningAreas.schoolId],
      name: 'pathway_learning_areas_learning_area_school_fk',
    }),
    uniqueIndex('pathway_learning_areas_pathway_area_unique').on(
      table.pathwayId,
      table.learningAreaId,
    ),
    index('pathway_learning_areas_school_id_idx').on(table.schoolId),
  ],
);

export const learnerPathways = pgTable(
  'learner_pathways',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    pathwayId: uuid('pathway_id').notNull().references(() => pathways.id),
    academicYearId: uuid('academic_year_id'),
    status: text('status').notNull().default('ACTIVE'),
    selectedAt: timestamp('selected_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'learner_pathways_student_school_fk',
    }),
    foreignKey({
      columns: [table.pathwayId, table.schoolId],
      foreignColumns: [pathways.id, pathways.schoolId],
      name: 'learner_pathways_pathway_school_fk',
    }),
    foreignKey({
      columns: [table.academicYearId, table.schoolId],
      foreignColumns: [academicYears.id, academicYears.schoolId],
      name: 'learner_pathways_academic_year_school_fk',
    }),
    uniqueIndex('learner_pathways_student_pathway_unique').on(table.studentId, table.pathwayId),
    index('learner_pathways_school_id_idx').on(table.schoolId),
  ],
);

export const attendance = pgTable(
  'attendance',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    enrollmentId: uuid('enrollment_id').notNull().references(() => enrollments.id),
    date: date('date').notNull(),
    status: attendanceStatusEnum('status').notNull(),
    markedById: uuid('marked_by_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'attendance_student_school_fk',
    }),
    foreignKey({
      columns: [table.enrollmentId, table.schoolId],
      foreignColumns: [enrollments.id, enrollments.schoolId],
      name: 'attendance_enrollment_school_fk',
    }),
    uniqueIndex('attendance_student_date_unique').on(table.studentId, table.date),
    index('attendance_school_id_idx').on(table.schoolId),
    index('attendance_enrollment_date_idx').on(table.enrollmentId, table.date),
  ],
);

export const exams = pgTable(
  'exams',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    termId: uuid('term_id').notNull().references(() => terms.id),
    subjectId: uuid('subject_id').notNull().references(() => subjects.id),
    examDate: date('exam_date').notNull(),
    maxScore: numeric('max_score', { precision: 7, scale: 2 }).notNull().default('100'),
  },
  (table) => [
    uniqueIndex('exams_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.termId, table.schoolId],
      foreignColumns: [terms.id, terms.schoolId],
      name: 'exams_term_school_fk',
    }),
    foreignKey({
      columns: [table.subjectId, table.schoolId],
      foreignColumns: [subjects.id, subjects.schoolId],
      name: 'exams_subject_school_fk',
    }),
    check('exams_max_score_positive_check', sql`${table.maxScore} > 0`),
    uniqueIndex('exams_term_subject_name_unique').on(table.termId, table.subjectId, table.name),
    index('exams_school_id_idx').on(table.schoolId),
  ],
);

export const examResults = pgTable(
  'exam_results',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    examId: uuid('exam_id').notNull().references(() => exams.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    enrollmentId: uuid('enrollment_id').notNull().references(() => enrollments.id),
    score: numeric('score', { precision: 7, scale: 2 }).notNull(),
    grade: text('grade'),
    remarks: text('remarks'),
  },
  (table) => [
    foreignKey({
      columns: [table.examId, table.schoolId],
      foreignColumns: [exams.id, exams.schoolId],
      name: 'exam_results_exam_school_fk',
    }),
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'exam_results_student_school_fk',
    }),
    foreignKey({
      columns: [table.enrollmentId, table.schoolId],
      foreignColumns: [enrollments.id, enrollments.schoolId],
      name: 'exam_results_enrollment_school_fk',
    }),
    check('exam_results_score_nonnegative_check', sql`${table.score} >= 0`),
    uniqueIndex('exam_results_exam_student_unique').on(table.examId, table.studentId),
    index('exam_results_school_id_idx').on(table.schoolId),
  ],
);

export const learningAreas = pgTable(
  'learning_areas',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    curriculumFrameworkId: uuid('curriculum_framework_id').references(
      () => curriculumFrameworks.id,
    ),
    name: text('name').notNull(),
    code: text('code'),
    level: text('level'),
    category: text('category'),
    active: boolean('active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('learning_areas_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.curriculumFrameworkId, table.schoolId],
      foreignColumns: [curriculumFrameworks.id, curriculumFrameworks.schoolId],
      name: 'learning_areas_framework_school_fk',
    }),
    uniqueIndex('learning_areas_school_name_unique').on(table.schoolId, table.name),
    index('learning_areas_school_id_idx').on(table.schoolId),
  ],
);

export const competencies = pgTable(
  'competencies',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    code: text('code').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    active: boolean('active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('competencies_school_code_unique').on(table.schoolId, table.code),
    uniqueIndex('competencies_id_school_unique').on(table.id, table.schoolId),
    index('competencies_school_id_idx').on(table.schoolId),
  ],
);

export const strands = pgTable(
  'strands',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    learningAreaId: uuid('learning_area_id').notNull().references(() => learningAreas.id),
    name: text('name').notNull(),
    code: text('code'),
    description: text('description'),
  },
  (table) => [
    uniqueIndex('strands_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.learningAreaId, table.schoolId],
      foreignColumns: [learningAreas.id, learningAreas.schoolId],
      name: 'strands_learning_area_school_fk',
    }),
    index('strands_school_id_idx').on(table.schoolId),
  ],
);

export const subStrands = pgTable(
  'sub_strands',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    strandId: uuid('strand_id').notNull().references(() => strands.id),
    name: text('name').notNull(),
    code: text('code'),
  },
  (table) => [
    uniqueIndex('sub_strands_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.strandId, table.schoolId],
      foreignColumns: [strands.id, strands.schoolId],
      name: 'sub_strands_strand_school_fk',
    }),
    index('sub_strands_school_id_idx').on(table.schoolId),
  ],
);

export const learningOutcomes = pgTable(
  'learning_outcomes',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    strandId: uuid('strand_id').notNull().references(() => strands.id),
    competencyId: uuid('competency_id').references(() => competencies.id),
    code: text('code').notNull(),
    description: text('description').notNull(),
    active: boolean('active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('learning_outcomes_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.strandId, table.schoolId],
      foreignColumns: [strands.id, strands.schoolId],
      name: 'learning_outcomes_strand_school_fk',
    }),
    foreignKey({
      columns: [table.competencyId, table.schoolId],
      foreignColumns: [competencies.id, competencies.schoolId],
      name: 'learning_outcomes_competency_school_fk',
    }),
    uniqueIndex('learning_outcomes_strand_code_unique').on(table.strandId, table.code),
    index('learning_outcomes_school_id_idx').on(table.schoolId),
  ],
);

export const assessmentScales = pgTable(
  'assessment_scales',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    curriculumFrameworkId: uuid('curriculum_framework_id')
      .notNull()
      .references(() => curriculumFrameworks.id),
    name: text('name').notNull(),
    type: text('type').notNull(),
    version: text('version'),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('assessment_scales_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.curriculumFrameworkId, table.schoolId],
      foreignColumns: [curriculumFrameworks.id, curriculumFrameworks.schoolId],
      name: 'assessment_scales_framework_school_fk',
    }),
    uniqueIndex('assessment_scales_school_name_unique').on(table.schoolId, table.name),
    index('assessment_scales_school_id_idx').on(table.schoolId),
  ],
);

export const assessmentLevels = pgTable(
  'assessment_levels',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    scaleId: uuid('scale_id').notNull().references(() => assessmentScales.id),
    code: text('code').notNull(),
    label: text('label').notNull(),
    description: text('description'),
    minScore: numeric('min_score', { precision: 5, scale: 2 }),
    maxScore: numeric('max_score', { precision: 5, scale: 2 }),
  },
  (table) => [
    uniqueIndex('assessment_levels_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.scaleId, table.schoolId],
      foreignColumns: [assessmentScales.id, assessmentScales.schoolId],
      name: 'assessment_levels_scale_school_fk',
    }),
    check(
      'assessment_levels_score_range_check',
      sql`(${table.minScore} IS NULL OR ${table.minScore} >= 0) AND (${table.maxScore} IS NULL OR ${table.maxScore} >= 0) AND (${table.minScore} IS NULL OR ${table.maxScore} IS NULL OR ${table.maxScore} >= ${table.minScore})`,
    ),
    uniqueIndex('assessment_levels_scale_code_unique').on(table.scaleId, table.code),
    index('assessment_levels_school_id_idx').on(table.schoolId),
  ],
);

export const rubrics = pgTable(
  'rubrics',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    description: text('description'),
    criteria: jsonb('criteria'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('rubrics_id_school_unique').on(table.id, table.schoolId),
    index('rubrics_school_id_idx').on(table.schoolId),
  ],
);

export const assessments = pgTable(
  'assessments',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    termId: uuid('term_id').references(() => terms.id),
    rubricId: uuid('rubric_id').references(() => rubrics.id),
    type: assessmentTypeEnum('type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    learningAreaId: uuid('learning_area_id').references(() => learningAreas.id),
    dueDate: date('due_date'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('assessments_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.termId, table.schoolId],
      foreignColumns: [terms.id, terms.schoolId],
      name: 'assessments_term_school_fk',
    }),
    foreignKey({
      columns: [table.rubricId, table.schoolId],
      foreignColumns: [rubrics.id, rubrics.schoolId],
      name: 'assessments_rubric_school_fk',
    }),
    foreignKey({
      columns: [table.learningAreaId, table.schoolId],
      foreignColumns: [learningAreas.id, learningAreas.schoolId],
      name: 'assessments_learning_area_school_fk',
    }),
    index('assessments_school_id_idx').on(table.schoolId),
  ],
);

export const assessmentItems = pgTable(
  'assessment_items',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    assessmentId: uuid('assessment_id').notNull().references(() => assessments.id),
    learningOutcomeId: uuid('learning_outcome_id').references(() => learningOutcomes.id),
    prompt: text('prompt').notNull(),
    maxScore: numeric('max_score', { precision: 7, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.assessmentId, table.schoolId],
      foreignColumns: [assessments.id, assessments.schoolId],
      name: 'assessment_items_assessment_school_fk',
    }),
    foreignKey({
      columns: [table.learningOutcomeId, table.schoolId],
      foreignColumns: [learningOutcomes.id, learningOutcomes.schoolId],
      name: 'assessment_items_learning_outcome_school_fk',
    }),
    check(
      'assessment_items_max_score_nonnegative_check',
      sql`${table.maxScore} IS NULL OR ${table.maxScore} >= 0`,
    ),
    index('assessment_items_school_id_idx').on(table.schoolId),
  ],
);

export const learnerAssessments = pgTable(
  'learner_assessments',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    enrollmentId: uuid('enrollment_id').references(() => enrollments.id),
    assessmentId: uuid('assessment_id').notNull().references(() => assessments.id),
    termId: uuid('term_id').references(() => terms.id),
    score: numeric('score', { precision: 7, scale: 2 }),
    level: competencyLevelEnum('level'),
    remarks: text('remarks'),
    evidenceUrl: text('evidence_url'),
    assessedById: uuid('assessed_by_id').references(() => users.id),
    assessedAt: timestamp('assessed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'learner_assessments_student_school_fk',
    }),
    foreignKey({
      columns: [table.enrollmentId, table.schoolId],
      foreignColumns: [enrollments.id, enrollments.schoolId],
      name: 'learner_assessments_enrollment_school_fk',
    }),
    foreignKey({
      columns: [table.assessmentId, table.schoolId],
      foreignColumns: [assessments.id, assessments.schoolId],
      name: 'learner_assessments_assessment_school_fk',
    }),
    foreignKey({
      columns: [table.termId, table.schoolId],
      foreignColumns: [terms.id, terms.schoolId],
      name: 'learner_assessments_term_school_fk',
    }),
    check(
      'learner_assessments_score_nonnegative_check',
      sql`${table.score} IS NULL OR ${table.score} >= 0`,
    ),
    index('learner_assessments_student_assessment_idx').on(table.studentId, table.assessmentId),
    index('learner_assessments_school_id_idx').on(table.schoolId),
  ],
);

export const portfolios = pgTable(
  'portfolios',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('portfolios_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'portfolios_student_school_fk',
    }),
    index('portfolios_student_id_idx').on(table.studentId),
  ],
);

export const evidence = pgTable(
  'evidence',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    portfolioId: uuid('portfolio_id').references(() => portfolios.id),
    title: text('title').notNull(),
    kind: text('kind').notNull(),
    url: text('url'),
    description: text('description'),
    teacherComment: text('teacher_comment'),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.portfolioId, table.schoolId],
      foreignColumns: [portfolios.id, portfolios.schoolId],
      name: 'evidence_portfolio_school_fk',
    }),
    index('evidence_school_id_idx').on(table.schoolId),
  ],
);

export const competencyAssessments = pgTable(
  'competency_assessments',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    enrollmentId: uuid('enrollment_id').notNull().references(() => enrollments.id),
    subStrandId: uuid('sub_strand_id').notNull().references(() => subStrands.id),
    termId: uuid('term_id').notNull().references(() => terms.id),
    level: competencyLevelEnum('level').notNull(),
    remarks: text('remarks'),
    assessedById: uuid('assessed_by_id').notNull().references(() => users.id),
    assessedAt: timestamp('assessed_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'competency_assessments_student_school_fk',
    }),
    foreignKey({
      columns: [table.enrollmentId, table.schoolId],
      foreignColumns: [enrollments.id, enrollments.schoolId],
      name: 'competency_assessments_enrollment_school_fk',
    }),
    foreignKey({
      columns: [table.subStrandId, table.schoolId],
      foreignColumns: [subStrands.id, subStrands.schoolId],
      name: 'competency_assessments_sub_strand_school_fk',
    }),
    foreignKey({
      columns: [table.termId, table.schoolId],
      foreignColumns: [terms.id, terms.schoolId],
      name: 'competency_assessments_term_school_fk',
    }),
    index('competency_assessments_student_substrand_term_assessed_idx').on(
      table.studentId,
      table.subStrandId,
      table.termId,
      table.assessedAt,
    ),
    index('competency_assessments_school_id_idx').on(table.schoolId),
  ],
);

export const feeStructures = pgTable(
  'fee_structures',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    academicYearId: uuid('academic_year_id').notNull().references(() => academicYears.id),
    termId: uuid('term_id').notNull().references(() => terms.id),
    gradeId: uuid('grade_id').references(() => grades.id),
    streamId: uuid('stream_id').references(() => streams.id),
    name: text('name').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    description: text('description'),
    dueDate: date('due_date'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('fee_structures_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.academicYearId, table.schoolId],
      foreignColumns: [academicYears.id, academicYears.schoolId],
      name: 'fee_structures_academic_year_school_fk',
    }),
    foreignKey({
      columns: [table.termId, table.schoolId],
      foreignColumns: [terms.id, terms.schoolId],
      name: 'fee_structures_term_school_fk',
    }),
    foreignKey({
      columns: [table.gradeId, table.schoolId],
      foreignColumns: [grades.id, grades.schoolId],
      name: 'fee_structures_grade_school_fk',
    }),
    foreignKey({
      columns: [table.streamId, table.schoolId],
      foreignColumns: [streams.id, streams.schoolId],
      name: 'fee_structures_stream_school_fk',
    }),
    check('fee_structures_amount_nonnegative_check', sql`${table.amount} >= 0`),
    index('fee_structures_school_year_term_idx').on(table.schoolId, table.academicYearId, table.termId),
  ],
);

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    enrollmentId: uuid('enrollment_id').references(() => enrollments.id),
    termId: uuid('term_id').references(() => terms.id),
    invoiceNumber: text('invoice_number').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    amountPaid: numeric('amount_paid', { precision: 12, scale: 2 }).notNull().default('0'),
    balance: numeric('balance', { precision: 12, scale: 2 }).notNull(),
    dueDate: date('due_date'),
    status: invoiceStatusEnum('status').notNull().default('UNPAID'),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('invoices_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'invoices_student_school_fk',
    }),
    foreignKey({
      columns: [table.enrollmentId, table.schoolId],
      foreignColumns: [enrollments.id, enrollments.schoolId],
      name: 'invoices_enrollment_school_fk',
    }),
    foreignKey({
      columns: [table.termId, table.schoolId],
      foreignColumns: [terms.id, terms.schoolId],
      name: 'invoices_term_school_fk',
    }),
    check(
      'invoices_amounts_nonnegative_check',
      sql`${table.amount} >= 0 AND ${table.amountPaid} >= 0 AND ${table.balance} >= 0 AND ${table.amountPaid} <= ${table.amount}`,
    ),
    uniqueIndex('invoices_school_number_unique').on(table.schoolId, table.invoiceNumber),
    index('invoices_school_student_status_idx').on(table.schoolId, table.studentId, table.status),
  ],
);

export const feeReminders = pgTable(
  'fee_reminders',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id),
    sentById: uuid('sent_by_id').references(() => users.id),
    provider: feeReminderProviderEnum('provider').notNull(),
    status: feeReminderStatusEnum('status').notNull().default('PENDING'),
    recipient: text('recipient').notNull(),
    message: text('message'),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    error: text('error'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.invoiceId, table.schoolId],
      foreignColumns: [invoices.id, invoices.schoolId],
      name: 'fee_reminders_invoice_school_fk',
    }),
    index('fee_reminders_school_status_idx').on(table.schoolId, table.status),
  ],
);

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    recordedById: uuid('recorded_by_id').references(() => users.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    method: paymentMethodEnum('method').notNull(),
    status: paymentStatusEnum('status').notNull().default('COMPLETED'),
    reference: text('reference'),
    transactionDate: timestamp('transaction_date', { withTimezone: true }).notNull().defaultNow(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('payments_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'payments_student_school_fk',
    }),
    check('payments_amount_positive_check', sql`${table.amount} > 0`),
    uniqueIndex('payments_school_reference_unique').on(table.schoolId, table.reference),
    index('payments_school_student_date_idx').on(table.schoolId, table.studentId, table.transactionDate),
  ],
);

export const paymentAllocations = pgTable(
  'payment_allocations',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    paymentId: uuid('payment_id').notNull().references(() => payments.id),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    status: allocationStatusEnum('status').notNull().default('ACTIVE'),
    allocatedAt: timestamp('allocated_at', { withTimezone: true }).notNull().defaultNow(),
    reversedAt: timestamp('reversed_at', { withTimezone: true }),
  },
  (table) => [
    foreignKey({
      columns: [table.paymentId, table.schoolId],
      foreignColumns: [payments.id, payments.schoolId],
      name: 'payment_allocations_payment_school_fk',
    }),
    foreignKey({
      columns: [table.invoiceId, table.schoolId],
      foreignColumns: [invoices.id, invoices.schoolId],
      name: 'payment_allocations_invoice_school_fk',
    }),
    check('payment_allocations_amount_positive_check', sql`${table.amount} > 0`),
    index('payment_allocations_school_id_idx').on(table.schoolId),
    index('payment_allocations_invoice_id_idx').on(table.invoiceId),
  ],
);

export const ledgerEntries = pgTable(
  'ledger_entries',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').references(() => students.id),
    invoiceId: uuid('invoice_id').references(() => invoices.id),
    paymentId: uuid('payment_id').references(() => payments.id),
    direction: ledgerDirectionEnum('direction').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    description: text('description').notNull(),
    reference: text('reference'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'ledger_entries_student_school_fk',
    }),
    foreignKey({
      columns: [table.invoiceId, table.schoolId],
      foreignColumns: [invoices.id, invoices.schoolId],
      name: 'ledger_entries_invoice_school_fk',
    }),
    foreignKey({
      columns: [table.paymentId, table.schoolId],
      foreignColumns: [payments.id, payments.schoolId],
      name: 'ledger_entries_payment_school_fk',
    }),
    check('ledger_entries_amount_positive_check', sql`${table.amount} > 0`),
    index('ledger_entries_school_student_created_idx').on(table.schoolId, table.studentId, table.createdAt),
  ],
);

export const creditNotes = pgTable(
  'credit_notes',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    studentId: uuid('student_id').notNull().references(() => students.id),
    invoiceId: uuid('invoice_id').references(() => invoices.id),
    creditNoteNumber: text('credit_note_number').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    remainingAmount: numeric('remaining_amount', { precision: 12, scale: 2 }).notNull(),
    reason: creditNoteReasonEnum('reason').notNull(),
    status: creditNoteStatusEnum('status').notNull().default('ISSUED'),
    notes: text('notes'),
    issuedById: uuid('issued_by_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('credit_notes_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.studentId, table.schoolId],
      foreignColumns: [students.id, students.schoolId],
      name: 'credit_notes_student_school_fk',
    }),
    foreignKey({
      columns: [table.invoiceId, table.schoolId],
      foreignColumns: [invoices.id, invoices.schoolId],
      name: 'credit_notes_invoice_school_fk',
    }),
    check(
      'credit_notes_amounts_nonnegative_check',
      sql`${table.amount} > 0 AND ${table.remainingAmount} >= 0 AND ${table.remainingAmount} <= ${table.amount}`,
    ),
    uniqueIndex('credit_notes_school_number_unique').on(table.schoolId, table.creditNoteNumber),
    index('credit_notes_school_student_idx').on(table.schoolId, table.studentId),
  ],
);

export const creditNoteApplications = pgTable(
  'credit_note_applications',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    creditNoteId: uuid('credit_note_id').notNull().references(() => creditNotes.id),
    invoiceId: uuid('invoice_id').notNull().references(() => invoices.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    appliedById: uuid('applied_by_id').notNull().references(() => users.id),
    appliedAt: timestamp('applied_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.creditNoteId, table.schoolId],
      foreignColumns: [creditNotes.id, creditNotes.schoolId],
      name: 'credit_note_applications_credit_note_school_fk',
    }),
    foreignKey({
      columns: [table.invoiceId, table.schoolId],
      foreignColumns: [invoices.id, invoices.schoolId],
      name: 'credit_note_applications_invoice_school_fk',
    }),
    check('credit_note_applications_amount_positive_check', sql`${table.amount} > 0`),
    index('credit_note_applications_school_id_idx').on(table.schoolId),
  ],
);

export const paymentRefunds = pgTable(
  'payment_refunds',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    paymentId: uuid('payment_id').notNull().references(() => payments.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    status: refundStatusEnum('status').notNull().default('PENDING'),
    reason: text('reason'),
    reference: text('reference'),
    processedById: uuid('processed_by_id').references(() => users.id),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.paymentId, table.schoolId],
      foreignColumns: [payments.id, payments.schoolId],
      name: 'payment_refunds_payment_school_fk',
    }),
    check('payment_refunds_amount_positive_check', sql`${table.amount} > 0`),
    index('payment_refunds_school_payment_idx').on(table.schoolId, table.paymentId),
  ],
);

export const idempotencyKeys = pgTable(
  'idempotency_keys',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    key: text('key').notNull(),
    requestHash: text('request_hash').notNull(),
    response: jsonb('response'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('idempotency_keys_school_key_unique').on(table.schoolId, table.key),
    index('idempotency_keys_expires_at_idx').on(table.expiresAt),
  ],
);

export const salaryStructures = pgTable(
  'salary_structures',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    basicSalary: numeric('basic_salary', { precision: 12, scale: 2 }).notNull(),
    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'salary_structures_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'salary_structures_staff_school_fk',
    }),
    check(
      'salary_structures_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check(
      'salary_structures_amount_and_dates_check',
      sql`${table.basicSalary} >= 0 AND (${table.effectiveTo} IS NULL OR ${table.effectiveTo} >= ${table.effectiveFrom})`,
    ),
    index('salary_structures_school_id_idx').on(table.schoolId),
  ],
);

export const allowanceTypes = pgTable(
  'allowance_types',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    description: text('description'),
    applicability: allowanceApplicabilityEnum('applicability').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }),
    taxable: boolean('taxable').notNull().default(true),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [uniqueIndex('allowance_types_school_name_unique').on(table.schoolId, table.name)],
);

export const statutoryDeductions = pgTable(
  'statutory_deductions',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    code: text('code').notNull(),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('statutory_deductions_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('statutory_deductions_school_code_unique').on(table.schoolId, table.code),
  ],
);

export const statutoryRateConfigs = pgTable(
  'statutory_rate_configs',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    deductionId: uuid('deduction_id').notNull().references(() => statutoryDeductions.id),
    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to'),
    rate: numeric('rate', { precision: 8, scale: 4 }),
    lowerLimit: numeric('lower_limit', { precision: 12, scale: 2 }),
    upperLimit: numeric('upper_limit', { precision: 12, scale: 2 }),
    fixedAmount: numeric('fixed_amount', { precision: 12, scale: 2 }),
    configuration: jsonb('configuration'),
  },
  (table) => [
    foreignKey({
      columns: [table.deductionId, table.schoolId],
      foreignColumns: [statutoryDeductions.id, statutoryDeductions.schoolId],
      name: 'statutory_rate_configs_deduction_school_fk',
    }),
    check(
      'statutory_rate_configs_values_check',
      sql`(${table.effectiveTo} IS NULL OR ${table.effectiveTo} >= ${table.effectiveFrom}) AND (${table.rate} IS NULL OR ${table.rate} >= 0) AND (${table.lowerLimit} IS NULL OR ${table.lowerLimit} >= 0) AND (${table.upperLimit} IS NULL OR ${table.upperLimit} >= 0) AND (${table.fixedAmount} IS NULL OR ${table.fixedAmount} >= 0) AND (${table.lowerLimit} IS NULL OR ${table.upperLimit} IS NULL OR ${table.upperLimit} >= ${table.lowerLimit})`,
    ),
    index('statutory_rate_configs_school_deduction_idx').on(table.schoolId, table.deductionId),
  ],
);

export const customDeductions = pgTable(
  'custom_deductions',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    name: text('name').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    reason: text('reason'),
    isRecurring: boolean('is_recurring').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'custom_deductions_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'custom_deductions_staff_school_fk',
    }),
    check(
      'custom_deductions_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check('custom_deductions_amount_nonnegative_check', sql`${table.amount} >= 0`),
    index('custom_deductions_school_id_idx').on(table.schoolId),
  ],
);

export const payrollRuns = pgTable(
  'payroll_runs',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    periodStart: date('period_start').notNull(),
    periodEnd: date('period_end').notNull(),
    status: payrollStatusEnum('status').notNull().default('PENDING'),
    totalGross: numeric('total_gross', { precision: 14, scale: 2 }).notNull().default('0'),
    totalDeductions: numeric('total_deductions', { precision: 14, scale: 2 }).notNull().default('0'),
    totalNet: numeric('total_net', { precision: 14, scale: 2 }).notNull().default('0'),
    processedById: uuid('processed_by_id').references(() => users.id),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('payroll_runs_id_school_unique').on(table.id, table.schoolId),
    check(
      'payroll_runs_period_and_totals_check',
      sql`${table.periodEnd} >= ${table.periodStart} AND ${table.totalGross} >= 0 AND ${table.totalDeductions} >= 0 AND ${table.totalNet} >= 0 AND ${table.totalNet} <= ${table.totalGross}`,
    ),
    index('payroll_runs_school_period_idx').on(table.schoolId, table.periodStart, table.periodEnd),
  ],
);

export const payslips = pgTable(
  'payslips',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    payrollRunId: uuid('payroll_run_id').notNull().references(() => payrollRuns.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    basicSalary: numeric('basic_salary', { precision: 12, scale: 2 }).notNull(),
    allowances: jsonb('allowances'),
    deductions: jsonb('deductions'),
    grossPay: numeric('gross_pay', { precision: 12, scale: 2 }).notNull(),
    netPay: numeric('net_pay', { precision: 12, scale: 2 }).notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.payrollRunId, table.schoolId],
      foreignColumns: [payrollRuns.id, payrollRuns.schoolId],
      name: 'payslips_payroll_run_school_fk',
    }),
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'payslips_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'payslips_staff_school_fk',
    }),
    check(
      'payslips_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check(
      'payslips_amounts_nonnegative_check',
      sql`${table.basicSalary} >= 0 AND ${table.grossPay} >= 0 AND ${table.netPay} >= 0 AND ${table.netPay} <= ${table.grossPay}`,
    ),
    index('payslips_school_run_idx').on(table.schoolId, table.payrollRunId),
    uniqueIndex('payslips_run_teacher_unique').on(table.payrollRunId, table.teacherId),
    uniqueIndex('payslips_run_staff_unique').on(table.payrollRunId, table.staffId),
  ],
);

export const employmentContracts = pgTable(
  'employment_contracts',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    contractType: contractTypeEnum('contract_type').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    documentUrl: text('document_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'employment_contracts_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'employment_contracts_staff_school_fk',
    }),
    check(
      'employment_contracts_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check(
      'employment_contracts_date_range_check',
      sql`${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),
    index('employment_contracts_school_id_idx').on(table.schoolId),
  ],
);

export const leaveTypes = pgTable(
  'leave_types',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    annualDays: numeric('annual_days', { precision: 6, scale: 2 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('leave_types_id_school_unique').on(table.id, table.schoolId),
    uniqueIndex('leave_types_school_name_unique').on(table.schoolId, table.name),
    check('leave_types_annual_days_positive_check', sql`${table.annualDays} > 0`),
  ],
);

export const leaveBalances = pgTable(
  'leave_balances',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    leaveTypeId: uuid('leave_type_id').notNull().references(() => leaveTypes.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    year: integer('year').notNull(),
    entitledDays: numeric('entitled_days', { precision: 6, scale: 2 }).notNull(),
    usedDays: numeric('used_days', { precision: 6, scale: 2 }).notNull().default('0'),
    carriedForwardDays: numeric('carried_forward_days', { precision: 6, scale: 2 }).notNull().default('0'),
  },
  (table) => [
    foreignKey({
      columns: [table.leaveTypeId, table.schoolId],
      foreignColumns: [leaveTypes.id, leaveTypes.schoolId],
      name: 'leave_balances_leave_type_school_fk',
    }),
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'leave_balances_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'leave_balances_staff_school_fk',
    }),
    check(
      'leave_balances_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check(
      'leave_balances_days_nonnegative_check',
      sql`${table.entitledDays} >= 0 AND ${table.usedDays} >= 0 AND ${table.carriedForwardDays} >= 0`,
    ),
    index('leave_balances_school_year_idx').on(table.schoolId, table.year),
  ],
);

export const leaveRequests = pgTable(
  'leave_requests',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    leaveTypeId: uuid('leave_type_id').notNull().references(() => leaveTypes.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    daysRequested: numeric('days_requested', { precision: 6, scale: 2 }).notNull(),
    reason: text('reason'),
    status: leaveStatusEnum('status').notNull().default('PENDING'),
    reviewedById: uuid('reviewed_by_id').references(() => users.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.leaveTypeId, table.schoolId],
      foreignColumns: [leaveTypes.id, leaveTypes.schoolId],
      name: 'leave_requests_leave_type_school_fk',
    }),
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'leave_requests_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'leave_requests_staff_school_fk',
    }),
    check(
      'leave_requests_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check(
      'leave_requests_dates_and_days_check',
      sql`${table.endDate} >= ${table.startDate} AND ${table.daysRequested} > 0`,
    ),
    index('leave_requests_school_status_idx').on(table.schoolId, table.status),
  ],
);

export const bankAccounts = pgTable(
  'bank_accounts',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    bankName: text('bank_name').notNull(),
    branchName: text('branch_name'),
    accountName: text('account_name').notNull(),
    accountNumber: text('account_number').notNull(),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'bank_accounts_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'bank_accounts_staff_school_fk',
    }),
    check(
      'bank_accounts_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    uniqueIndex('bank_accounts_primary_teacher_unique')
      .on(table.teacherId)
      .where(sql`${table.isPrimary} AND ${table.teacherId} IS NOT NULL`),
    uniqueIndex('bank_accounts_primary_staff_unique')
      .on(table.staffId)
      .where(sql`${table.isPrimary} AND ${table.staffId} IS NOT NULL`),
    index('bank_accounts_school_id_idx').on(table.schoolId),
  ],
);

export const loanProviders = pgTable(
  'loan_providers',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    name: text('name').notNull(),
    sourceType: loanSourceTypeEnum('source_type').notNull(),
    contactPhone: text('contact_phone'),
    contactEmail: text('contact_email'),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('loan_providers_id_school_unique').on(table.id, table.schoolId),
    index('loan_providers_school_id_idx').on(table.schoolId),
  ],
);

export const employeeSalaryLoans = pgTable(
  'employee_salary_loans',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    providerId: uuid('provider_id').references(() => loanProviders.id),
    principalAmount: numeric('principal_amount', { precision: 12, scale: 2 }).notNull(),
    balance: numeric('balance', { precision: 12, scale: 2 }).notNull(),
    monthlyDeduction: numeric('monthly_deduction', { precision: 12, scale: 2 }).notNull(),
    status: loanStatusEnum('status').notNull().default('ACTIVE'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('employee_salary_loans_id_school_unique').on(table.id, table.schoolId),
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'employee_salary_loans_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'employee_salary_loans_staff_school_fk',
    }),
    foreignKey({
      columns: [table.providerId, table.schoolId],
      foreignColumns: [loanProviders.id, loanProviders.schoolId],
      name: 'employee_salary_loans_provider_school_fk',
    }),
    check(
      'employee_salary_loans_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check(
      'employee_salary_loans_amounts_and_dates_check',
      sql`${table.principalAmount} > 0 AND ${table.balance} >= 0 AND ${table.balance} <= ${table.principalAmount} AND ${table.monthlyDeduction} > 0 AND (${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate})`,
    ),
    index('employee_salary_loans_school_status_idx').on(table.schoolId, table.status),
  ],
);

export const loanRepayments = pgTable(
  'loan_repayments',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    loanId: uuid('loan_id').notNull().references(() => employeeSalaryLoans.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    paymentDate: date('payment_date').notNull(),
    reference: text('reference'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.loanId, table.schoolId],
      foreignColumns: [employeeSalaryLoans.id, employeeSalaryLoans.schoolId],
      name: 'loan_repayments_loan_school_fk',
    }),
    check('loan_repayments_amount_positive_check', sql`${table.amount} > 0`),
    index('loan_repayments_school_loan_idx').on(table.schoolId, table.loanId),
  ],
);

export const employeeLoanRequests = pgTable(
  'employee_loan_requests',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    providerId: uuid('provider_id').references(() => loanProviders.id),
    requestedAmount: numeric('requested_amount', { precision: 12, scale: 2 }).notNull(),
    approvedAmount: numeric('approved_amount', { precision: 12, scale: 2 }),
    reason: text('reason'),
    status: loanRequestStatusEnum('status').notNull().default('PENDING'),
    reviewedById: uuid('reviewed_by_id').references(() => users.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'employee_loan_requests_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'employee_loan_requests_staff_school_fk',
    }),
    foreignKey({
      columns: [table.providerId, table.schoolId],
      foreignColumns: [loanProviders.id, loanProviders.schoolId],
      name: 'employee_loan_requests_provider_school_fk',
    }),
    check(
      'employee_loan_requests_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check(
      'employee_loan_requests_amounts_check',
      sql`${table.requestedAmount} > 0 AND (${table.approvedAmount} IS NULL OR ${table.approvedAmount} >= 0)`,
    ),
    index('employee_loan_requests_school_status_idx').on(table.schoolId, table.status),
  ],
);

export const resignationRecords = pgTable(
  'resignation_records',
  {
    id: uuid('id').primaryKey(),
    schoolId: uuid('school_id').notNull().references(() => schools.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),
    staffId: uuid('staff_id').references(() => staff.id),
    initiatedById: uuid('initiated_by_id').notNull().references(() => users.id),
    reviewedById: uuid('reviewed_by_id').references(() => users.id),
    reason: text('reason'),
    status: resignationStatusEnum('status').notNull().default('PENDING'),
    noticeDate: date('notice_date').notNull(),
    lastWorkingDate: date('last_working_date'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.teacherId, table.schoolId],
      foreignColumns: [teachers.id, teachers.schoolId],
      name: 'resignation_records_teacher_school_fk',
    }),
    foreignKey({
      columns: [table.staffId, table.schoolId],
      foreignColumns: [staff.id, staff.schoolId],
      name: 'resignation_records_staff_school_fk',
    }),
    check(
      'resignation_records_exactly_one_employee_check',
      sql`(CASE WHEN ${table.teacherId} IS NULL THEN 0 ELSE 1 END + CASE WHEN ${table.staffId} IS NULL THEN 0 ELSE 1 END) = 1`,
    ),
    check(
      'resignation_records_last_working_date_check',
      sql`${table.lastWorkingDate} IS NULL OR ${table.lastWorkingDate} >= ${table.noticeDate}`,
    ),
    index('resignation_records_school_status_idx').on(table.schoolId, table.status),
  ],
);
