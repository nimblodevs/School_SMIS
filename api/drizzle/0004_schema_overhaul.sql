DO $$ BEGIN
  CREATE TYPE "public"."AdmissionApplicationStatus" AS ENUM('SUBMITTED', 'RESUBMITTED', 'UNDER_REVIEW', 'RETURNED', 'ACCEPTED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN', 'ENROLLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."AllocationStatus" AS ENUM('ACTIVE', 'REVERSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."AllowanceApplicability" AS ENUM('ALL_EMPLOYEES', 'TEACHERS', 'STAFF', 'JOB_GROUP');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."AssessmentType" AS ENUM('DIAGNOSTIC', 'FORMATIVE', 'SCHOOL_BASED_ASSESSMENT', 'PROJECT', 'PRACTICAL', 'OBSERVATION', 'PORTFOLIO', 'ORAL', 'WRITTEN', 'PERFORMANCE', 'NATIONAL_ASSESSMENT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."AttendanceStatus" AS ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."AuditAction" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'AUTH_LOGIN_SUCCESS', 'AUTH_LOGIN_FAILED', 'AUTH_REFRESH_TOKEN_REUSE', 'AUTH_LOGOUT', 'PASSWORD_CHANGED', 'PASSWORD_CHANGE_FAILED', 'ACCOUNT_LOCKED', 'IMPERSONATION_STARTED', 'IMPERSONATED_ACTION', 'IMPERSONATION_ENDED', 'PAYMENT_RECORDED', 'PAYMENT_ALLOCATED', 'PAYMENT_REFUNDED', 'INVOICE_ISSUED', 'PAYROLL_PROCESSED', 'INVITE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."BloodGroup" AS ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."CompetencyLevel" AS ENUM('EXCEEDING_EXPECTATION', 'MEETING_EXPECTATION', 'APPROACHING_EXPECTATION', 'BELOW_EXPECTATION');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."ContractType" AS ENUM('PERMANENT', 'CONTRACT', 'FIXED_TERM', 'CASUAL', 'INTERNSHIP');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."CreditNoteReason" AS ENUM('OVERPAYMENT', 'REFUND', 'REVERSAL', 'ADJUSTMENT', 'WRONG_INVOICE', 'DUPLICATE', 'CHARGEBACK');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."CreditNoteStatus" AS ENUM('ISSUED', 'PARTIALLY_APPLIED', 'APPLIED', 'REFUNDED', 'VOIDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."Curriculum" AS ENUM('KCSE', 'CBC', 'CAMBRIDGE', 'IB');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."CurriculumFrameworkStatus" AS ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', 'LEGACY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."EnrollmentStatus" AS ENUM('ACTIVE', 'COMPLETED', 'TRANSFERRED', 'GRADUATED', 'WITHDRAWN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."FeeReminderProvider" AS ENUM('GMAIL', 'OUTLOOK');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."FeeReminderStatus" AS ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."Gender" AS ENUM('MALE', 'FEMALE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."InvoiceStatus" AS ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."LeaveStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."LedgerDirection" AS ENUM('DEBIT', 'CREDIT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."LoanRequestStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."LoanSourceType" AS ENUM('SCHOOL', 'BANK', 'SACCO', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."LoanStatus" AS ENUM('ACTIVE', 'PARTIALLY_PAID', 'COMPLETED', 'DEFAULTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."ParentRelation" AS ENUM('MOTHER', 'FATHER', 'GUARDIAN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."PaymentMethod" AS ENUM('MPESA', 'CASH', 'CHEQUE', 'BANK_DEPOSIT', 'BANK_TRANSFER', 'CARD');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."PaymentStatus" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."PayrollStatus" AS ENUM('PENDING', 'DRAFT', 'PROCESSING', 'PENDING_APPROVAL', 'APPROVED', 'PAID');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."RefundStatus" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."ResignationStatus" AS ENUM('PENDING', 'REVIEWED', 'APPROVED', 'REJECTED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."Role" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TEACHER', 'STAFF', 'STUDENT', 'PARENT', 'BURSAR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."StaffModule" AS ENUM('STUDENTS', 'ATTENDANCE', 'TIMETABLE', 'EXAMS', 'CBC', 'FEES', 'REPORTS');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."Weekday" AS ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "name" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "slug" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "motto" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "vision" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "mission" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "address" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "city" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "county" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "postal_code" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "phone" text;
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "email" text;
--> statement-breakpoint
UPDATE "schools" SET "name" = COALESCE("name", "school_name"), "slug" = COALESCE("slug", "school_slug"), "motto" = COALESCE("motto", "school_motto"), "vision" = COALESCE("vision", "vision_statement"), "mission" = COALESCE("mission", "mission_statement"), "address" = COALESCE("address", NULLIF("head_office_address", '')), "city" = COALESCE("city", "school_location" ->> 'area'), "county" = COALESCE("county", "school_location" ->> 'county'), "postal_code" = COALESCE("postal_code", "school_location" ->> 'postalCode'), "phone" = COALESCE("phone", "official_phone"), "email" = COALESCE("email", "school_email");
--> statement-breakpoint
ALTER TABLE "schools" ALTER COLUMN "name" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "schools" ALTER COLUMN "slug" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "schools" ALTER COLUMN "motto" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "schools" ALTER COLUMN "vision" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "schools" ALTER COLUMN "mission" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "schools" ALTER COLUMN "phone" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "schools" ALTER COLUMN "email" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "school_settings" ADD COLUMN IF NOT EXISTS "id" uuid;
--> statement-breakpoint
UPDATE "school_settings" SET "id" = gen_random_uuid() WHERE "id" IS NULL;
--> statement-breakpoint
ALTER TABLE "school_settings" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "school_settings" DROP CONSTRAINT IF EXISTS "school_settings_pkey";
--> statement-breakpoint
ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_pkey" PRIMARY KEY ("id");
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" TYPE text USING "role"::text;
--> statement-breakpoint
UPDATE "users" SET "role" = CASE WHEN lower("role") = 'school_admin' THEN 'ADMIN' ELSE upper("role") END;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."Role" USING "role"::"public"."Role";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "trace_id" text;
--> statement-breakpoint
UPDATE "audit_logs" SET "trace_id" = gen_random_uuid()::text WHERE "trace_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "trace_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "action" TYPE text USING "action"::text;
--> statement-breakpoint
UPDATE "audit_logs" SET "action" = upper("action");
--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "action" TYPE "public"."AuditAction" USING "action"::"public"."AuditAction";
--> statement-breakpoint
ALTER TABLE "staff_module_access" ADD COLUMN IF NOT EXISTS "school_id" uuid;
--> statement-breakpoint
ALTER TABLE "staff_module_access" ADD COLUMN IF NOT EXISTS "granted_by_id" uuid;
--> statement-breakpoint
ALTER TABLE "staff_module_access" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now();
--> statement-breakpoint
UPDATE "staff_module_access" AS access SET "school_id" = COALESCE(access."school_id", users."school_id"), "granted_by_id" = COALESCE(access."granted_by_id", access."user_id") FROM "users" WHERE access."user_id" = users."id";
--> statement-breakpoint
ALTER TABLE "staff_module_access" ALTER COLUMN "school_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "staff_module_access" ALTER COLUMN "granted_by_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "staff_module_access" ALTER COLUMN "created_at" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "staff_module_access" ALTER COLUMN "module" TYPE text USING "module"::text;
--> statement-breakpoint
UPDATE "staff_module_access" SET "module" = upper("module");
--> statement-breakpoint
ALTER TABLE "staff_module_access" ALTER COLUMN "module" TYPE "public"."StaffModule" USING "module"::"public"."StaffModule";
--> statement-breakpoint
ALTER TABLE "refresh_sessions" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "system_sequences" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "system_sequences" ALTER COLUMN "next_school_code" SET DEFAULT 1;
--> statement-breakpoint
ALTER TABLE "parents" ALTER COLUMN "user_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "parents" DROP CONSTRAINT IF EXISTS "parents_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "parents" ADD CONSTRAINT "parents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "parents" ADD COLUMN IF NOT EXISTS "email" text;
--> statement-breakpoint
ALTER TABLE "parents" ADD COLUMN IF NOT EXISTS "relation" "public"."ParentRelation";
--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "date_of_birth" date;
--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "gender" "public"."Gender";
--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "blood_group" "public"."BloodGroup";
--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "admission_date" date DEFAULT CURRENT_DATE NOT NULL;
--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
CREATE TABLE "academic_years" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activation_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admission_application_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"from_status" "AdmissionApplicationStatus",
	"to_status" "AdmissionApplicationStatus" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admission_application_sequences" (
	"school_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"next_val" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "admission_application_sequences_school_id_year_pk" PRIMARY KEY("school_id","year")
);
--> statement-breakpoint
CREATE TABLE "admission_applications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"application_no" text NOT NULL,
	"academic_year_id" uuid NOT NULL,
	"requested_stream_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"national_id_number" text,
	"birth_certificate_number" text NOT NULL,
	"passport_number" text,
	"date_of_birth" date NOT NULL,
	"gender" "Gender" NOT NULL,
	"guardian_first_name" text,
	"guardian_middle_name" text,
	"guardian_last_name" text,
	"guardian_phone" text,
	"guardian_email" text,
	"guardian_relation" "ParentRelation",
	"guardian_national_id_number" text,
	"guardian_passport_number" text,
	"status" "AdmissionApplicationStatus" DEFAULT 'SUBMITTED' NOT NULL,
	"notes" text,
	"created_by_id" uuid NOT NULL,
	"reviewed_by_id" uuid,
	"reviewed_at" timestamp with time zone,
	"converted_student_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admission_sequences" (
	"school_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"next_val" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "admission_sequences_school_id_year_pk" PRIMARY KEY("school_id","year")
);
--> statement-breakpoint
CREATE TABLE "allowance_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"applicability" "AllowanceApplicability" NOT NULL,
	"amount" numeric(12, 2),
	"taxable" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"assessment_id" uuid NOT NULL,
	"learning_outcome_id" uuid,
	"prompt" text NOT NULL,
	"max_score" numeric(7, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_levels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"scale_id" uuid NOT NULL,
	"code" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"min_score" numeric(5, 2),
	"max_score" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "assessment_scales" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"curriculum_framework_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"version" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"term_id" uuid,
	"rubric_id" uuid,
	"type" "AssessmentType" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"learning_area_id" uuid,
	"due_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"date" date NOT NULL,
	"status" "AttendanceStatus" NOT NULL,
	"marked_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "background_jobs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid,
	"type" text NOT NULL,
	"status" text DEFAULT 'QUEUED' NOT NULL,
	"payload" jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error" text,
	"result" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"bank_name" text NOT NULL,
	"branch_name" text,
	"account_name" text NOT NULL,
	"account_number" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_levels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"curriculum" "Curriculum" DEFAULT 'KCSE' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_subjects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"stream_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competencies" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competency_assessments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"sub_strand_id" uuid NOT NULL,
	"term_id" uuid NOT NULL,
	"level" "CompetencyLevel" NOT NULL,
	"remarks" text,
	"assessed_by_id" uuid NOT NULL,
	"assessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_note_applications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"credit_note_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"applied_by_id" uuid NOT NULL,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_notes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"invoice_id" uuid,
	"credit_note_number" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"remaining_amount" numeric(12, 2) NOT NULL,
	"reason" "CreditNoteReason" NOT NULL,
	"status" "CreditNoteStatus" DEFAULT 'ISSUED' NOT NULL,
	"notes" text,
	"issued_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curriculum_frameworks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"version" text,
	"start_year" integer,
	"end_year" integer,
	"status" "CurriculumFrameworkStatus" DEFAULT 'ACTIVE' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_deductions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"name" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"reason" text,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_levels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"curriculum_framework_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE "employee_loan_requests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"provider_id" uuid,
	"requested_amount" numeric(12, 2) NOT NULL,
	"approved_amount" numeric(12, 2),
	"reason" text,
	"status" "LoanRequestStatus" DEFAULT 'PENDING' NOT NULL,
	"reviewed_by_id" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_salary_loans" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"provider_id" uuid,
	"principal_amount" numeric(12, 2) NOT NULL,
	"balance" numeric(12, 2) NOT NULL,
	"monthly_deduction" numeric(12, 2) NOT NULL,
	"status" "LoanStatus" DEFAULT 'ACTIVE' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employment_contracts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"contract_type" "ContractType" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"document_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"stream_id" uuid NOT NULL,
	"academic_year_id" uuid NOT NULL,
	"grade_id" uuid,
	"pathway_id" uuid,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "EnrollmentStatus" DEFAULT 'ACTIVE' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"portfolio_id" uuid,
	"title" text NOT NULL,
	"kind" text NOT NULL,
	"url" text,
	"description" text,
	"teacher_comment" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_results" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"exam_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"score" numeric(7, 2) NOT NULL,
	"grade" text,
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"term_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"exam_date" date NOT NULL,
	"max_score" numeric(7, 2) DEFAULT '100' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fee_reminders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"sent_by_id" uuid,
	"provider" "FeeReminderProvider" NOT NULL,
	"status" "FeeReminderStatus" DEFAULT 'PENDING' NOT NULL,
	"recipient" text NOT NULL,
	"message" text,
	"sent_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fee_structures" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"academic_year_id" uuid NOT NULL,
	"term_id" uuid NOT NULL,
	"grade_id" uuid,
	"stream_id" uuid,
	"name" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"due_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_uploads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"storage_key" text NOT NULL,
	"storage_bucket" text NOT NULL,
	"url" text,
	"related_type" text,
	"related_id" text,
	"uploaded_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grades" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"curriculum_framework_id" uuid NOT NULL,
	"education_level_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idempotency_keys" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"key" text NOT NULL,
	"request_hash" text NOT NULL,
	"response" jsonb,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"enrollment_id" uuid,
	"term_id" uuid,
	"invoice_number" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"amount_paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"balance" numeric(12, 2) NOT NULL,
	"due_date" date,
	"status" "InvoiceStatus" DEFAULT 'UNPAID' NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_groups" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learner_assessments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"enrollment_id" uuid,
	"assessment_id" uuid NOT NULL,
	"term_id" uuid,
	"score" numeric(7, 2),
	"level" "CompetencyLevel",
	"remarks" text,
	"evidence_url" text,
	"assessed_by_id" uuid,
	"assessed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learner_pathways" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"pathway_id" uuid NOT NULL,
	"academic_year_id" uuid,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"selected_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_areas" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"curriculum_framework_id" uuid,
	"name" text NOT NULL,
	"code" text,
	"level" text,
	"category" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_outcomes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"strand_id" uuid NOT NULL,
	"competency_id" uuid,
	"code" text NOT NULL,
	"description" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_balances" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"leave_type_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"year" integer NOT NULL,
	"entitled_days" numeric(6, 2) NOT NULL,
	"used_days" numeric(6, 2) DEFAULT '0' NOT NULL,
	"carried_forward_days" numeric(6, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"leave_type_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"days_requested" numeric(6, 2) NOT NULL,
	"reason" text,
	"status" "LeaveStatus" DEFAULT 'PENDING' NOT NULL,
	"reviewed_by_id" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"annual_days" numeric(6, 2) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ledger_entries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid,
	"invoice_id" uuid,
	"payment_id" uuid,
	"direction" "LedgerDirection" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text NOT NULL,
	"reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_providers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"source_type" "LoanSourceType" NOT NULL,
	"contact_phone" text,
	"contact_email" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_repayments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"loan_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"payment_date" date NOT NULL,
	"reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_parents" (
	"parent_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"is_primary_contact" boolean DEFAULT false NOT NULL,
	"is_financially_responsible" boolean DEFAULT false NOT NULL,
	"can_pick_up" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_parents_student_id_parent_id_pk" PRIMARY KEY("student_id","parent_id")
);
--> statement-breakpoint
CREATE TABLE "pathway_learning_areas" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"pathway_id" uuid NOT NULL,
	"learning_area_id" uuid NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"elective" boolean DEFAULT false NOT NULL,
	"cluster" text
);
--> statement-breakpoint
CREATE TABLE "pathways" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"curriculum_framework_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_allocations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" "AllocationStatus" DEFAULT 'ACTIVE' NOT NULL,
	"allocated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reversed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payment_refunds" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" "RefundStatus" DEFAULT 'PENDING' NOT NULL,
	"reason" text,
	"reference" text,
	"processed_by_id" uuid,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"recorded_by_id" uuid,
	"amount" numeric(12, 2) NOT NULL,
	"method" "PaymentMethod" NOT NULL,
	"status" "PaymentStatus" DEFAULT 'COMPLETED' NOT NULL,
	"reference" text,
	"transaction_date" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll_runs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"status" "PayrollStatus" DEFAULT 'PENDING' NOT NULL,
	"total_gross" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_deductions" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_net" numeric(14, 2) DEFAULT '0' NOT NULL,
	"processed_by_id" uuid,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payslips" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"payroll_run_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"basic_salary" numeric(12, 2) NOT NULL,
	"allowances" jsonb,
	"deductions" jsonb,
	"gross_pay" numeric(12, 2) NOT NULL,
	"net_pay" numeric(12, 2) NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resignation_records" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"initiated_by_id" uuid NOT NULL,
	"reviewed_by_id" uuid,
	"reason" text,
	"status" "ResignationStatus" DEFAULT 'PENDING' NOT NULL,
	"notice_date" date NOT NULL,
	"last_working_date" date,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rubrics" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"criteria" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary_structures" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"teacher_id" uuid,
	"staff_id" uuid,
	"basic_salary" numeric(12, 2) NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statutory_deductions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statutory_rate_configs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"deduction_id" uuid NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"rate" numeric(8, 4),
	"lower_limit" numeric(12, 2),
	"upper_limit" numeric(12, 2),
	"fixed_amount" numeric(12, 2),
	"configuration" jsonb
);
--> statement-breakpoint
CREATE TABLE "strands" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"learning_area_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "streams" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"class_level_id" uuid NOT NULL,
	"grade_id" uuid
);
--> statement-breakpoint
CREATE TABLE "student_transport_assignments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"route_name" text NOT NULL,
	"vehicle_registration" text NOT NULL,
	"pickup_location" text NOT NULL,
	"dropoff_location" text NOT NULL,
	"driver_name" text,
	"driver_phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_strands" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"strand_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"curriculum" "Curriculum" DEFAULT 'KCSE' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_subjects" (
	"teacher_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	CONSTRAINT "teacher_subjects_teacher_id_subject_id_pk" PRIMARY KEY("teacher_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"academic_year_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timetable_slots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"stream_id" uuid NOT NULL,
	"class_subject_id" uuid NOT NULL,
	"day" "Weekday" NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"room" text
);
--> statement-breakpoint
ALTER TABLE "academic_years" ADD CONSTRAINT "academic_years_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "activation_tokens" ADD CONSTRAINT "activation_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admission_application_events" ADD CONSTRAINT "admission_application_events_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admission_application_sequences" ADD CONSTRAINT "admission_application_sequences_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admission_applications" ADD CONSTRAINT "admission_applications_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "allowance_types" ADD CONSTRAINT "allowance_types_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessment_items" ADD CONSTRAINT "assessment_items_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessment_items" ADD CONSTRAINT "assessment_items_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessment_items" ADD CONSTRAINT "assessment_items_learning_outcome_id_learning_outcomes_id_fk" FOREIGN KEY ("learning_outcome_id") REFERENCES "public"."learning_outcomes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessment_levels" ADD CONSTRAINT "assessment_levels_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessment_levels" ADD CONSTRAINT "assessment_levels_scale_id_assessment_scales_id_fk" FOREIGN KEY ("scale_id") REFERENCES "public"."assessment_scales"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessment_scales" ADD CONSTRAINT "assessment_scales_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessment_scales" ADD CONSTRAINT "assessment_scales_curriculum_framework_id_curriculum_frameworks_id_fk" FOREIGN KEY ("curriculum_framework_id") REFERENCES "public"."curriculum_frameworks"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_learning_area_id_learning_areas_id_fk" FOREIGN KEY ("learning_area_id") REFERENCES "public"."learning_areas"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_marked_by_id_users_id_fk" FOREIGN KEY ("marked_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "background_jobs" ADD CONSTRAINT "background_jobs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "class_levels" ADD CONSTRAINT "class_levels_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_stream_id_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."streams"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_sub_strand_id_sub_strands_id_fk" FOREIGN KEY ("sub_strand_id") REFERENCES "public"."sub_strands"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_assessed_by_id_users_id_fk" FOREIGN KEY ("assessed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credit_note_applications" ADD CONSTRAINT "credit_note_applications_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credit_note_applications" ADD CONSTRAINT "credit_note_applications_credit_note_id_credit_notes_id_fk" FOREIGN KEY ("credit_note_id") REFERENCES "public"."credit_notes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credit_note_applications" ADD CONSTRAINT "credit_note_applications_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credit_note_applications" ADD CONSTRAINT "credit_note_applications_applied_by_id_users_id_fk" FOREIGN KEY ("applied_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_issued_by_id_users_id_fk" FOREIGN KEY ("issued_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "curriculum_frameworks" ADD CONSTRAINT "curriculum_frameworks_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "custom_deductions" ADD CONSTRAINT "custom_deductions_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "custom_deductions" ADD CONSTRAINT "custom_deductions_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "custom_deductions" ADD CONSTRAINT "custom_deductions_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "education_levels" ADD CONSTRAINT "education_levels_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "education_levels" ADD CONSTRAINT "education_levels_curriculum_framework_id_curriculum_frameworks_id_fk" FOREIGN KEY ("curriculum_framework_id") REFERENCES "public"."curriculum_frameworks"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_loan_requests" ADD CONSTRAINT "employee_loan_requests_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_loan_requests" ADD CONSTRAINT "employee_loan_requests_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_loan_requests" ADD CONSTRAINT "employee_loan_requests_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_loan_requests" ADD CONSTRAINT "employee_loan_requests_provider_id_loan_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."loan_providers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_loan_requests" ADD CONSTRAINT "employee_loan_requests_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_salary_loans" ADD CONSTRAINT "employee_salary_loans_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_salary_loans" ADD CONSTRAINT "employee_salary_loans_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_salary_loans" ADD CONSTRAINT "employee_salary_loans_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_salary_loans" ADD CONSTRAINT "employee_salary_loans_provider_id_loan_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."loan_providers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employment_contracts" ADD CONSTRAINT "employment_contracts_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employment_contracts" ADD CONSTRAINT "employment_contracts_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employment_contracts" ADD CONSTRAINT "employment_contracts_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_stream_id_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."streams"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_pathway_id_pathways_id_fk" FOREIGN KEY ("pathway_id") REFERENCES "public"."pathways"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fee_reminders" ADD CONSTRAINT "fee_reminders_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fee_reminders" ADD CONSTRAINT "fee_reminders_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fee_reminders" ADD CONSTRAINT "fee_reminders_sent_by_id_users_id_fk" FOREIGN KEY ("sent_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_stream_id_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."streams"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_curriculum_framework_id_curriculum_frameworks_id_fk" FOREIGN KEY ("curriculum_framework_id") REFERENCES "public"."curriculum_frameworks"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_education_level_id_education_levels_id_fk" FOREIGN KEY ("education_level_id") REFERENCES "public"."education_levels"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "idempotency_keys_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "job_groups" ADD CONSTRAINT "job_groups_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_assessments" ADD CONSTRAINT "learner_assessments_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_assessments" ADD CONSTRAINT "learner_assessments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_assessments" ADD CONSTRAINT "learner_assessments_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_assessments" ADD CONSTRAINT "learner_assessments_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_assessments" ADD CONSTRAINT "learner_assessments_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_assessments" ADD CONSTRAINT "learner_assessments_assessed_by_id_users_id_fk" FOREIGN KEY ("assessed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_pathways" ADD CONSTRAINT "learner_pathways_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_pathways" ADD CONSTRAINT "learner_pathways_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learner_pathways" ADD CONSTRAINT "learner_pathways_pathway_id_pathways_id_fk" FOREIGN KEY ("pathway_id") REFERENCES "public"."pathways"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learning_areas" ADD CONSTRAINT "learning_areas_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learning_areas" ADD CONSTRAINT "learning_areas_curriculum_framework_id_curriculum_frameworks_id_fk" FOREIGN KEY ("curriculum_framework_id") REFERENCES "public"."curriculum_frameworks"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD CONSTRAINT "learning_outcomes_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD CONSTRAINT "learning_outcomes_strand_id_strands_id_fk" FOREIGN KEY ("strand_id") REFERENCES "public"."strands"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "learning_outcomes" ADD CONSTRAINT "learning_outcomes_competency_id_competencies_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."competencies"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "loan_providers" ADD CONSTRAINT "loan_providers_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "loan_repayments" ADD CONSTRAINT "loan_repayments_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "loan_repayments" ADD CONSTRAINT "loan_repayments_loan_id_employee_salary_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."employee_salary_loans"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_parent_id_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parents"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pathway_learning_areas" ADD CONSTRAINT "pathway_learning_areas_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pathway_learning_areas" ADD CONSTRAINT "pathway_learning_areas_pathway_id_pathways_id_fk" FOREIGN KEY ("pathway_id") REFERENCES "public"."pathways"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pathways" ADD CONSTRAINT "pathways_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pathways" ADD CONSTRAINT "pathways_curriculum_framework_id_curriculum_frameworks_id_fk" FOREIGN KEY ("curriculum_framework_id") REFERENCES "public"."curriculum_frameworks"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_processed_by_id_users_id_fk" FOREIGN KEY ("processed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_id_users_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_processed_by_id_users_id_fk" FOREIGN KEY ("processed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_payroll_run_id_payroll_runs_id_fk" FOREIGN KEY ("payroll_run_id") REFERENCES "public"."payroll_runs"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "resignation_records" ADD CONSTRAINT "resignation_records_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "resignation_records" ADD CONSTRAINT "resignation_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "resignation_records" ADD CONSTRAINT "resignation_records_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "resignation_records" ADD CONSTRAINT "resignation_records_initiated_by_id_users_id_fk" FOREIGN KEY ("initiated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "resignation_records" ADD CONSTRAINT "resignation_records_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "rubrics" ADD CONSTRAINT "rubrics_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_employee_key_employee_numbers_owner_key_fk" FOREIGN KEY ("employee_key") REFERENCES "public"."employee_numbers"("owner_key") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_job_group_id_job_groups_id_fk" FOREIGN KEY ("job_group_id") REFERENCES "public"."job_groups"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "staff_module_access" ADD CONSTRAINT "staff_module_access_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "staff_module_access" ADD CONSTRAINT "staff_module_access_granted_by_id_users_id_fk" FOREIGN KEY ("granted_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "statutory_deductions" ADD CONSTRAINT "statutory_deductions_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "statutory_rate_configs" ADD CONSTRAINT "statutory_rate_configs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "statutory_rate_configs" ADD CONSTRAINT "statutory_rate_configs_deduction_id_statutory_deductions_id_fk" FOREIGN KEY ("deduction_id") REFERENCES "public"."statutory_deductions"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "strands" ADD CONSTRAINT "strands_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "strands" ADD CONSTRAINT "strands_learning_area_id_learning_areas_id_fk" FOREIGN KEY ("learning_area_id") REFERENCES "public"."learning_areas"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "streams" ADD CONSTRAINT "streams_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "streams" ADD CONSTRAINT "streams_class_level_id_class_levels_id_fk" FOREIGN KEY ("class_level_id") REFERENCES "public"."class_levels"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "streams" ADD CONSTRAINT "streams_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "public"."grades"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "student_transport_assignments_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sub_strands" ADD CONSTRAINT "sub_strands_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sub_strands" ADD CONSTRAINT "sub_strands_strand_id_strands_id_fk" FOREIGN KEY ("strand_id") REFERENCES "public"."strands"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_employee_key_employee_numbers_owner_key_fk" FOREIGN KEY ("employee_key") REFERENCES "public"."employee_numbers"("owner_key") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_job_group_id_job_groups_id_fk" FOREIGN KEY ("job_group_id") REFERENCES "public"."job_groups"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "terms" ADD CONSTRAINT "terms_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "timetable_slots" ADD CONSTRAINT "timetable_slots_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "timetable_slots" ADD CONSTRAINT "timetable_slots_stream_id_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."streams"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "timetable_slots" ADD CONSTRAINT "timetable_slots_class_subject_id_class_subjects_id_fk" FOREIGN KEY ("class_subject_id") REFERENCES "public"."class_subjects"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "student_parents" ("student_id", "parent_id") SELECT "student_id", "parent_id" FROM "parent_students" ON CONFLICT ("student_id", "parent_id") DO NOTHING;
--> statement-breakpoint
CREATE UNIQUE INDEX "academic_years_school_name_unique" ON "academic_years" USING btree ("school_id","name");
--> statement-breakpoint
CREATE UNIQUE INDEX "academic_years_id_school_unique" ON "academic_years" USING btree ("id","school_id");
--> statement-breakpoint
CREATE INDEX "academic_years_school_id_idx" ON "academic_years" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "activation_tokens_token_hash_unique" ON "activation_tokens" USING btree ("token_hash");
--> statement-breakpoint
CREATE INDEX "activation_tokens_user_expires_idx" ON "activation_tokens" USING btree ("user_id","expires_at");
--> statement-breakpoint
CREATE INDEX "admission_app_events_school_application_created_idx" ON "admission_application_events" USING btree ("school_id","application_id","created_at");
--> statement-breakpoint
CREATE UNIQUE INDEX "admission_applications_school_application_no_unique" ON "admission_applications" USING btree ("school_id","application_no");
--> statement-breakpoint
CREATE UNIQUE INDEX "admission_applications_id_school_unique" ON "admission_applications" USING btree ("id","school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "admission_applications_converted_student_school_unique" ON "admission_applications" USING btree ("converted_student_id","school_id");
--> statement-breakpoint
CREATE INDEX "admission_applications_school_status_created_idx" ON "admission_applications" USING btree ("school_id","status","created_at");
--> statement-breakpoint
CREATE INDEX "admission_applications_school_year_idx" ON "admission_applications" USING btree ("school_id","academic_year_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "allowance_types_school_name_unique" ON "allowance_types" USING btree ("school_id","name");
--> statement-breakpoint
CREATE INDEX "assessment_items_school_id_idx" ON "assessment_items" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "assessment_levels_scale_code_unique" ON "assessment_levels" USING btree ("scale_id","code");
--> statement-breakpoint
CREATE INDEX "assessment_levels_school_id_idx" ON "assessment_levels" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "assessment_scales_school_name_unique" ON "assessment_scales" USING btree ("school_id","name");
--> statement-breakpoint
CREATE INDEX "assessment_scales_school_id_idx" ON "assessment_scales" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "assessments_school_id_idx" ON "assessments" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_student_date_unique" ON "attendance" USING btree ("student_id","date");
--> statement-breakpoint
CREATE INDEX "attendance_school_id_idx" ON "attendance" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "attendance_enrollment_date_idx" ON "attendance" USING btree ("enrollment_id","date");
--> statement-breakpoint
CREATE INDEX "audit_logs_school_id_idx" ON "audit_logs" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs" USING btree ("entity_type","entity_id");
--> statement-breakpoint
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs" USING btree ("action","created_at");
--> statement-breakpoint
CREATE INDEX "background_jobs_status_available_idx" ON "background_jobs" USING btree ("status","available_at");
--> statement-breakpoint
CREATE INDEX "background_jobs_school_type_status_idx" ON "background_jobs" USING btree ("school_id","type","status");
--> statement-breakpoint
CREATE INDEX "bank_accounts_school_id_idx" ON "bank_accounts" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "class_levels_school_name_unique" ON "class_levels" USING btree ("school_id","name");
--> statement-breakpoint
CREATE INDEX "class_levels_school_id_idx" ON "class_levels" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "class_subjects_stream_subject_unique" ON "class_subjects" USING btree ("stream_id","subject_id");
--> statement-breakpoint
CREATE INDEX "class_subjects_school_id_idx" ON "class_subjects" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "competencies_school_code_unique" ON "competencies" USING btree ("school_id","code");
--> statement-breakpoint
CREATE INDEX "competencies_school_id_idx" ON "competencies" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "competency_assessments_student_substrand_term_assessed_idx" ON "competency_assessments" USING btree ("student_id","sub_strand_id","term_id","assessed_at");
--> statement-breakpoint
CREATE INDEX "competency_assessments_school_id_idx" ON "competency_assessments" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "credit_note_applications_school_id_idx" ON "credit_note_applications" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "credit_notes_school_number_unique" ON "credit_notes" USING btree ("school_id","credit_note_number");
--> statement-breakpoint
CREATE INDEX "credit_notes_school_student_idx" ON "credit_notes" USING btree ("school_id","student_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "curriculum_frameworks_school_code_unique" ON "curriculum_frameworks" USING btree ("school_id","code");
--> statement-breakpoint
CREATE INDEX "curriculum_frameworks_school_id_idx" ON "curriculum_frameworks" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "custom_deductions_school_id_idx" ON "custom_deductions" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "education_levels_framework_code_unique" ON "education_levels" USING btree ("curriculum_framework_id","code");
--> statement-breakpoint
CREATE INDEX "education_levels_school_id_idx" ON "education_levels" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "employee_loan_requests_school_status_idx" ON "employee_loan_requests" USING btree ("school_id","status");
--> statement-breakpoint
CREATE INDEX "employee_salary_loans_school_status_idx" ON "employee_salary_loans" USING btree ("school_id","status");
--> statement-breakpoint
CREATE INDEX "employment_contracts_school_id_idx" ON "employment_contracts" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_student_year_unique" ON "enrollments" USING btree ("student_id","academic_year_id");
--> statement-breakpoint
CREATE INDEX "enrollments_school_id_idx" ON "enrollments" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "evidence_school_id_idx" ON "evidence" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "exam_results_exam_student_unique" ON "exam_results" USING btree ("exam_id","student_id");
--> statement-breakpoint
CREATE INDEX "exam_results_school_id_idx" ON "exam_results" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "exams_term_subject_name_unique" ON "exams" USING btree ("term_id","subject_id","name");
--> statement-breakpoint
CREATE INDEX "exams_school_id_idx" ON "exams" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "fee_reminders_school_status_idx" ON "fee_reminders" USING btree ("school_id","status");
--> statement-breakpoint
CREATE INDEX "fee_structures_school_year_term_idx" ON "fee_structures" USING btree ("school_id","academic_year_id","term_id");
--> statement-breakpoint
CREATE INDEX "file_uploads_related_idx" ON "file_uploads" USING btree ("related_type","related_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "grades_framework_code_unique" ON "grades" USING btree ("curriculum_framework_id","code");
--> statement-breakpoint
CREATE INDEX "grades_school_id_idx" ON "grades" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "idempotency_keys_school_key_unique" ON "idempotency_keys" USING btree ("school_id","key");
--> statement-breakpoint
CREATE INDEX "idempotency_keys_expires_at_idx" ON "idempotency_keys" USING btree ("expires_at");
--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_school_number_unique" ON "invoices" USING btree ("school_id","invoice_number");
--> statement-breakpoint
CREATE INDEX "invoices_school_student_status_idx" ON "invoices" USING btree ("school_id","student_id","status");
--> statement-breakpoint
CREATE UNIQUE INDEX "job_groups_school_code_unique" ON "job_groups" USING btree ("school_id","code");
--> statement-breakpoint
CREATE INDEX "job_groups_school_id_idx" ON "job_groups" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "learner_assessments_student_assessment_idx" ON "learner_assessments" USING btree ("student_id","assessment_id");
--> statement-breakpoint
CREATE INDEX "learner_assessments_school_id_idx" ON "learner_assessments" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "learner_pathways_student_pathway_unique" ON "learner_pathways" USING btree ("student_id","pathway_id");
--> statement-breakpoint
CREATE INDEX "learner_pathways_school_id_idx" ON "learner_pathways" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "learning_areas_school_name_unique" ON "learning_areas" USING btree ("school_id","name");
--> statement-breakpoint
CREATE INDEX "learning_areas_school_id_idx" ON "learning_areas" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "learning_outcomes_strand_code_unique" ON "learning_outcomes" USING btree ("strand_id","code");
--> statement-breakpoint
CREATE INDEX "learning_outcomes_school_id_idx" ON "learning_outcomes" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "leave_balances_school_year_idx" ON "leave_balances" USING btree ("school_id","year");
--> statement-breakpoint
CREATE INDEX "leave_requests_school_status_idx" ON "leave_requests" USING btree ("school_id","status");
--> statement-breakpoint
CREATE UNIQUE INDEX "leave_types_school_name_unique" ON "leave_types" USING btree ("school_id","name");
--> statement-breakpoint
CREATE INDEX "ledger_entries_school_student_created_idx" ON "ledger_entries" USING btree ("school_id","student_id","created_at");
--> statement-breakpoint
CREATE INDEX "loan_providers_school_id_idx" ON "loan_providers" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "loan_repayments_school_loan_idx" ON "loan_repayments" USING btree ("school_id","loan_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "parents_school_national_id_unique" ON "parents" USING btree ("school_id","national_id_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "parents_school_phone_unique" ON "parents" USING btree ("school_id","phone");
--> statement-breakpoint
CREATE UNIQUE INDEX "parents_school_email_unique" ON "parents" USING btree ("school_id","email");
--> statement-breakpoint
CREATE UNIQUE INDEX "parents_school_passport_unique" ON "parents" USING btree ("school_id","passport_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "pathway_learning_areas_pathway_area_unique" ON "pathway_learning_areas" USING btree ("pathway_id","learning_area_id");
--> statement-breakpoint
CREATE INDEX "pathway_learning_areas_school_id_idx" ON "pathway_learning_areas" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "pathways_framework_code_unique" ON "pathways" USING btree ("curriculum_framework_id","code");
--> statement-breakpoint
CREATE INDEX "pathways_school_id_idx" ON "pathways" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "payment_allocations_school_id_idx" ON "payment_allocations" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "payment_allocations_invoice_id_idx" ON "payment_allocations" USING btree ("invoice_id");
--> statement-breakpoint
CREATE INDEX "payment_refunds_school_payment_idx" ON "payment_refunds" USING btree ("school_id","payment_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "payments_school_reference_unique" ON "payments" USING btree ("school_id","reference");
--> statement-breakpoint
CREATE INDEX "payments_school_student_date_idx" ON "payments" USING btree ("school_id","student_id","transaction_date");
--> statement-breakpoint
CREATE INDEX "payroll_runs_school_period_idx" ON "payroll_runs" USING btree ("school_id","period_start","period_end");
--> statement-breakpoint
CREATE INDEX "payslips_school_run_idx" ON "payslips" USING btree ("school_id","payroll_run_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "payslips_run_teacher_unique" ON "payslips" USING btree ("payroll_run_id","teacher_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "payslips_run_staff_unique" ON "payslips" USING btree ("payroll_run_id","staff_id");
--> statement-breakpoint
CREATE INDEX "portfolios_student_id_idx" ON "portfolios" USING btree ("student_id");
--> statement-breakpoint
CREATE INDEX "resignation_records_school_status_idx" ON "resignation_records" USING btree ("school_id","status");
--> statement-breakpoint
CREATE INDEX "rubrics_school_id_idx" ON "rubrics" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "salary_structures_school_id_idx" ON "salary_structures" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "school_settings_school_id_unique" ON "school_settings" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "school_settings_mpesa_shortcode_unique" ON "school_settings" USING btree ("mpesa_shortcode");
--> statement-breakpoint
CREATE UNIQUE INDEX "schools_slug_unique" ON "schools" USING btree ("slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "schools_phone_unique" ON "schools" USING btree ("phone");
--> statement-breakpoint
CREATE UNIQUE INDEX "staff_school_nssf_unique" ON "staff" USING btree ("school_id","nssf_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "staff_school_kra_unique" ON "staff" USING btree ("school_id","kra_pin");
--> statement-breakpoint
CREATE UNIQUE INDEX "staff_school_sha_unique" ON "staff" USING btree ("school_id","sha_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "staff_school_national_id_unique" ON "staff" USING btree ("school_id","national_id_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "staff_school_passport_unique" ON "staff" USING btree ("school_id","passport_number");
--> statement-breakpoint
CREATE INDEX "staff_module_access_school_id_idx" ON "staff_module_access" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "statutory_deductions_school_code_unique" ON "statutory_deductions" USING btree ("school_id","code");
--> statement-breakpoint
CREATE INDEX "statutory_rate_configs_school_deduction_idx" ON "statutory_rate_configs" USING btree ("school_id","deduction_id");
--> statement-breakpoint
CREATE INDEX "strands_school_id_idx" ON "strands" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "streams_class_level_name_unique" ON "streams" USING btree ("class_level_id","name");
--> statement-breakpoint
CREATE UNIQUE INDEX "streams_id_school_unique" ON "streams" USING btree ("id","school_id");
--> statement-breakpoint
CREATE INDEX "streams_school_id_idx" ON "streams" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "student_transport_assignments_student_school_unique" ON "student_transport_assignments" USING btree ("student_id","school_id");
--> statement-breakpoint
CREATE INDEX "student_transport_assignments_school_route_idx" ON "student_transport_assignments" USING btree ("school_id","route_name");
--> statement-breakpoint
CREATE UNIQUE INDEX "students_school_admission_no_unique" ON "students" USING btree ("school_id","admission_no");
--> statement-breakpoint
CREATE UNIQUE INDEX "students_school_national_id_unique" ON "students" USING btree ("school_id","national_id_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "students_school_birth_certificate_unique" ON "students" USING btree ("school_id","birth_certificate_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "students_school_passport_unique" ON "students" USING btree ("school_id","passport_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "students_id_school_unique" ON "students" USING btree ("id","school_id");
--> statement-breakpoint
CREATE INDEX "sub_strands_school_id_idx" ON "sub_strands" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_school_code_unique" ON "subjects" USING btree ("school_id","code");
--> statement-breakpoint
CREATE INDEX "subjects_school_id_idx" ON "subjects" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "teachers_school_nssf_unique" ON "teachers" USING btree ("school_id","nssf_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "teachers_school_kra_unique" ON "teachers" USING btree ("school_id","kra_pin");
--> statement-breakpoint
CREATE UNIQUE INDEX "teachers_school_sha_unique" ON "teachers" USING btree ("school_id","sha_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "teachers_school_national_id_unique" ON "teachers" USING btree ("school_id","national_id_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "teachers_school_passport_unique" ON "teachers" USING btree ("school_id","passport_number");
--> statement-breakpoint
CREATE UNIQUE INDEX "terms_academic_year_name_unique" ON "terms" USING btree ("academic_year_id","name");
--> statement-breakpoint
CREATE INDEX "terms_school_id_idx" ON "terms" USING btree ("school_id");
--> statement-breakpoint
CREATE INDEX "timetable_slots_school_id_idx" ON "timetable_slots" USING btree ("school_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_unique" ON "users" USING btree ("phone");
--> statement-breakpoint
ALTER TABLE "admission_applications" ADD CONSTRAINT "admission_applications_academic_year_id_school_id_academic_years_id_school_id_fk" FOREIGN KEY ("academic_year_id","school_id") REFERENCES "public"."academic_years"("id","school_id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admission_applications" ADD CONSTRAINT "admission_applications_requested_stream_id_school_id_streams_id_school_id_fk" FOREIGN KEY ("requested_stream_id","school_id") REFERENCES "public"."streams"("id","school_id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admission_applications" ADD CONSTRAINT "admission_applications_converted_student_school_fk" FOREIGN KEY ("converted_student_id","school_id") REFERENCES "public"."students"("id","school_id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admission_application_events" ADD CONSTRAINT "admission_app_events_application_school_fk" FOREIGN KEY ("application_id","school_id") REFERENCES "public"."admission_applications"("id","school_id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "student_transport_assignments_student_school_fk" FOREIGN KEY ("student_id","school_id") REFERENCES "public"."students"("id","school_id") ON DELETE no action ON UPDATE no action;
