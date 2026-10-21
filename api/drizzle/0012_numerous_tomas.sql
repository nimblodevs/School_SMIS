ALTER TABLE "staff" ADD COLUMN "branch_id" uuid;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "branch_id" uuid;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "branch_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "school_branches_id_school_unique" ON "school_branches" USING btree ("id","school_id");--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_branch_school_fk" FOREIGN KEY ("branch_id","school_id") REFERENCES "public"."school_branches"("id","school_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_branch_school_fk" FOREIGN KEY ("branch_id","school_id") REFERENCES "public"."school_branches"("id","school_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_branch_school_fk" FOREIGN KEY ("branch_id","school_id") REFERENCES "public"."school_branches"("id","school_id") ON DELETE no action ON UPDATE no action;