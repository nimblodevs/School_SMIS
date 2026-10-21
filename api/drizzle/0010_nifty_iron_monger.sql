ALTER TABLE "student_transport_assignments" DROP CONSTRAINT "student_transport_assignments_student_school_fk";
--> statement-breakpoint
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "student_transport_assignments_student_school_fk" FOREIGN KEY ("student_id","school_id") REFERENCES "public"."students"("id","school_id") ON DELETE cascade ON UPDATE no action;
