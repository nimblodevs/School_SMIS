CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"action" text NOT NULL,
	"actor_id" uuid,
	"school_id" uuid,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"ip_address" text,
	"user_agent" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_numbers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"employee_no" text NOT NULL,
	"owner_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parent_students" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parent_id" uuid NOT NULL,
	"student_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"national_id_number" text,
	"passport_number" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_otps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"code_hash" text NOT NULL,
	"challenge_token_hash" text,
	"purpose" text NOT NULL,
	"is_resend" boolean DEFAULT false NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"family_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"replaced_by_id" text,
	"reused_at" timestamp with time zone,
	"is_impersonated" boolean DEFAULT false NOT NULL,
	"impersonated_user_id" uuid,
	"actor_session_id" uuid,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_settings" (
	"school_id" uuid PRIMARY KEY NOT NULL,
	"mpesa_shortcode" text,
	"mpesa_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"national_id_number" text,
	"passport_number" text,
	"employee_key" text NOT NULL,
	"nssf_number" text,
	"kra_pin" text,
	"sha_number" text,
	"job_group_id" uuid,
	"hire_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"department" text NOT NULL,
	"job_title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_module_access" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"module" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"user_id" uuid,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"national_id_number" text,
	"passport_number" text,
	"birth_certificate_number" text,
	"admission_no" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_sequences" (
	"key" text PRIMARY KEY NOT NULL,
	"next_school_code" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"national_id_number" text,
	"passport_number" text,
	"employee_key" text NOT NULL,
	"nssf_number" text,
	"kra_pin" text,
	"sha_number" text,
	"job_group_id" uuid,
	"hire_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "next_teacher_sequence" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "next_staff_sequence" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "next_student_sequence" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "school_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "must_change_password" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "auth_provider" text DEFAULT 'LOCAL' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "google_subject" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_session_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "failed_login_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "locked_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_ip" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_numbers" ADD CONSTRAINT "employee_numbers_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_parent_id_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parents" ADD CONSTRAINT "parents_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parents" ADD CONSTRAINT "parents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_otps" ADD CONSTRAINT "password_reset_otps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_impersonated_user_id_users_id_fk" FOREIGN KEY ("impersonated_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_module_access" ADD CONSTRAINT "staff_module_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_school_created_idx" ON "audit_logs" USING btree ("school_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "employee_numbers_school_employee_no_unique" ON "employee_numbers" USING btree ("school_id","employee_no");--> statement-breakpoint
CREATE UNIQUE INDEX "employee_numbers_owner_key_unique" ON "employee_numbers" USING btree ("owner_key");--> statement-breakpoint
CREATE UNIQUE INDEX "parent_students_parent_student_unique" ON "parent_students" USING btree ("parent_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "parents_user_id_unique" ON "parents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "parents_school_id_idx" ON "parents" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "password_reset_otps_user_purpose_created_idx" ON "password_reset_otps" USING btree ("user_id","purpose","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "password_reset_otps_challenge_token_unique" ON "password_reset_otps" USING btree ("challenge_token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "refresh_sessions_token_hash_unique" ON "refresh_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "refresh_sessions_user_id_idx" ON "refresh_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_sessions_family_id_idx" ON "refresh_sessions" USING btree ("family_id");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_user_id_unique" ON "staff" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_employee_key_unique" ON "staff" USING btree ("employee_key");--> statement-breakpoint
CREATE INDEX "staff_school_id_idx" ON "staff" USING btree ("school_id");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_module_access_user_module_unique" ON "staff_module_access" USING btree ("user_id","module");--> statement-breakpoint
CREATE UNIQUE INDEX "students_user_id_unique" ON "students" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "students_school_id_idx" ON "students" USING btree ("school_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teachers_user_id_unique" ON "teachers" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "teachers_employee_key_unique" ON "teachers" USING btree ("employee_key");--> statement-breakpoint
CREATE INDEX "teachers_school_id_idx" ON "teachers" USING btree ("school_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "schools_official_phone_nonempty_unique" ON "schools" USING btree ("official_phone") WHERE "schools"."official_phone" <> '';--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_google_subject_unique" ON "users" USING btree ("google_subject");--> statement-breakpoint
CREATE INDEX "users_school_id_idx" ON "users" USING btree ("school_id");