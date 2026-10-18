CREATE TABLE "school_branches" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"name" text NOT NULL,
	"county" text NOT NULL,
	"sub_county" text NOT NULL,
	"ward" text NOT NULL,
	"area" text NOT NULL,
	"latitude" text DEFAULT '' NOT NULL,
	"longitude" text DEFAULT '' NOT NULL,
	"nearest_landmark" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_ownerships" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"ownership_type" text NOT NULL,
	"school_admin_name" text NOT NULL,
	"school_admin_email" text NOT NULL,
	"school_admin_mobile" text NOT NULL,
	"alternative_mobile" text DEFAULT '' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" uuid PRIMARY KEY NOT NULL,
	"school_name" text NOT NULL,
	"school_code" text NOT NULL,
	"school_slug" text NOT NULL,
	"school_motto" text NOT NULL,
	"vision_statement" text NOT NULL,
	"mission_statement" text NOT NULL,
	"school_type" text NOT NULL,
	"school_location" jsonb,
	"official_phone" text NOT NULL,
	"school_email" text NOT NULL,
	"website" text DEFAULT '' NOT NULL,
	"head_office_address" text DEFAULT '' NOT NULL,
	"logo_object_key" text,
	"logo_content_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "school_branches" ADD CONSTRAINT "school_branches_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_ownerships" ADD CONSTRAINT "school_ownerships_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "school_branches_school_id_idx" ON "school_branches" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "school_ownerships_school_id_idx" ON "school_ownerships" USING btree ("school_id");--> statement-breakpoint
CREATE UNIQUE INDEX "schools_school_code_unique" ON "schools" USING btree ("school_code");--> statement-breakpoint
CREATE UNIQUE INDEX "schools_school_slug_unique" ON "schools" USING btree ("school_slug");--> statement-breakpoint
CREATE INDEX "schools_school_name_idx" ON "schools" USING btree ("school_name");