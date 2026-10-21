ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "credit_note_applications" DROP CONSTRAINT "credit_note_applications_positive_amount_check";--> statement-breakpoint
ALTER TABLE "credit_notes" DROP CONSTRAINT "credit_notes_amounts_check";--> statement-breakpoint
ALTER TABLE "custom_deductions" DROP CONSTRAINT "custom_deductions_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "custom_deductions" DROP CONSTRAINT "custom_deductions_nonnegative_amount_check";--> statement-breakpoint
ALTER TABLE "employee_loan_requests" DROP CONSTRAINT "employee_loan_requests_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "employee_loan_requests" DROP CONSTRAINT "employee_loan_requests_positive_amounts_check";--> statement-breakpoint
ALTER TABLE "employee_salary_loans" DROP CONSTRAINT "employee_salary_loans_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "employee_salary_loans" DROP CONSTRAINT "employee_salary_loans_nonnegative_amounts_check";--> statement-breakpoint
ALTER TABLE "employee_salary_loans" DROP CONSTRAINT "employee_salary_loans_date_range_check";--> statement-breakpoint
ALTER TABLE "employment_contracts" DROP CONSTRAINT "employment_contracts_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "employment_contracts" DROP CONSTRAINT "employment_contracts_date_range_check";--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_nonnegative_amounts_check";--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_paid_not_over_amount_check";--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_balance_within_amount_check";--> statement-breakpoint
ALTER TABLE "leave_balances" DROP CONSTRAINT "leave_balances_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "leave_balances" DROP CONSTRAINT "leave_balances_nonnegative_days_check";--> statement-breakpoint
ALTER TABLE "leave_requests" DROP CONSTRAINT "leave_requests_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "leave_requests" DROP CONSTRAINT "leave_requests_date_range_check";--> statement-breakpoint
ALTER TABLE "leave_requests" DROP CONSTRAINT "leave_requests_positive_days_check";--> statement-breakpoint
ALTER TABLE "leave_types" DROP CONSTRAINT "leave_types_nonnegative_days_check";--> statement-breakpoint
ALTER TABLE "ledger_entries" DROP CONSTRAINT "ledger_entries_positive_amount_check";--> statement-breakpoint
ALTER TABLE "loan_repayments" DROP CONSTRAINT "loan_repayments_positive_amount_check";--> statement-breakpoint
ALTER TABLE "payment_allocations" DROP CONSTRAINT "payment_allocations_positive_amount_check";--> statement-breakpoint
ALTER TABLE "payment_refunds" DROP CONSTRAINT "payment_refunds_positive_amount_check";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_positive_amount_check";--> statement-breakpoint
ALTER TABLE "payroll_runs" DROP CONSTRAINT "payroll_runs_period_range_check";--> statement-breakpoint
ALTER TABLE "payroll_runs" DROP CONSTRAINT "payroll_runs_nonnegative_totals_check";--> statement-breakpoint
ALTER TABLE "payslips" DROP CONSTRAINT "payslips_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "payslips" DROP CONSTRAINT "payslips_nonnegative_amounts_check";--> statement-breakpoint
ALTER TABLE "resignation_records" DROP CONSTRAINT "resignation_records_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "resignation_records" DROP CONSTRAINT "resignation_records_date_range_check";--> statement-breakpoint
ALTER TABLE "salary_structures" DROP CONSTRAINT "salary_structures_employee_exactly_one_check";--> statement-breakpoint
ALTER TABLE "salary_structures" DROP CONSTRAINT "salary_structures_nonnegative_salary_check";--> statement-breakpoint
ALTER TABLE "salary_structures" DROP CONSTRAINT "salary_structures_date_range_check";--> statement-breakpoint
ALTER TABLE "statutory_rate_configs" DROP CONSTRAINT "statutory_rate_configs_date_range_check";--> statement-breakpoint
ALTER TABLE "statutory_rate_configs" DROP CONSTRAINT "statutory_rate_configs_nonnegative_rate_check";--> statement-breakpoint
ALTER TABLE "timetable_slots" DROP CONSTRAINT "timetable_slots_positive_duration_check";--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_student_school_fk";
--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_enrollment_school_fk";
--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_marker_school_fk";
--> statement-breakpoint
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_stream_school_fk";
--> statement-breakpoint
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_subject_school_fk";
--> statement-breakpoint
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "credit_note_applications" DROP CONSTRAINT "credit_note_applications_credit_note_school_fk";
--> statement-breakpoint
ALTER TABLE "credit_note_applications" DROP CONSTRAINT "credit_note_applications_invoice_school_fk";
--> statement-breakpoint
ALTER TABLE "credit_notes" DROP CONSTRAINT "credit_notes_student_school_fk";
--> statement-breakpoint
ALTER TABLE "credit_notes" DROP CONSTRAINT "credit_notes_invoice_school_fk";
--> statement-breakpoint
ALTER TABLE "custom_deductions" DROP CONSTRAINT "custom_deductions_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "custom_deductions" DROP CONSTRAINT "custom_deductions_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "employee_loan_requests" DROP CONSTRAINT "employee_loan_requests_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "employee_loan_requests" DROP CONSTRAINT "employee_loan_requests_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "employee_loan_requests" DROP CONSTRAINT "employee_loan_requests_provider_school_fk";
--> statement-breakpoint
ALTER TABLE "employee_salary_loans" DROP CONSTRAINT "employee_salary_loans_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "employee_salary_loans" DROP CONSTRAINT "employee_salary_loans_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "employee_salary_loans" DROP CONSTRAINT "employee_salary_loans_provider_school_fk";
--> statement-breakpoint
ALTER TABLE "employment_contracts" DROP CONSTRAINT "employment_contracts_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "employment_contracts" DROP CONSTRAINT "employment_contracts_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_student_school_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_stream_school_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_academic_year_school_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_grade_school_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_pathway_school_fk";
--> statement-breakpoint
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_exam_school_fk";
--> statement-breakpoint
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_student_school_fk";
--> statement-breakpoint
ALTER TABLE "exam_results" DROP CONSTRAINT "exam_results_enrollment_school_fk";
--> statement-breakpoint
ALTER TABLE "exams" DROP CONSTRAINT "exams_term_school_fk";
--> statement-breakpoint
ALTER TABLE "exams" DROP CONSTRAINT "exams_subject_school_fk";
--> statement-breakpoint
ALTER TABLE "fee_reminders" DROP CONSTRAINT "fee_reminders_invoice_school_fk";
--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_student_school_fk";
--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_enrollment_school_fk";
--> statement-breakpoint
ALTER TABLE "leave_balances" DROP CONSTRAINT "leave_balances_leave_type_school_fk";
--> statement-breakpoint
ALTER TABLE "leave_balances" DROP CONSTRAINT "leave_balances_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "leave_balances" DROP CONSTRAINT "leave_balances_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "leave_requests" DROP CONSTRAINT "leave_requests_leave_type_school_fk";
--> statement-breakpoint
ALTER TABLE "leave_requests" DROP CONSTRAINT "leave_requests_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "leave_requests" DROP CONSTRAINT "leave_requests_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "ledger_entries" DROP CONSTRAINT "ledger_entries_student_school_fk";
--> statement-breakpoint
ALTER TABLE "ledger_entries" DROP CONSTRAINT "ledger_entries_invoice_school_fk";
--> statement-breakpoint
ALTER TABLE "ledger_entries" DROP CONSTRAINT "ledger_entries_payment_school_fk";
--> statement-breakpoint
ALTER TABLE "loan_repayments" DROP CONSTRAINT "loan_repayments_loan_school_fk";
--> statement-breakpoint
ALTER TABLE "payment_allocations" DROP CONSTRAINT "payment_allocations_payment_school_fk";
--> statement-breakpoint
ALTER TABLE "payment_allocations" DROP CONSTRAINT "payment_allocations_invoice_school_fk";
--> statement-breakpoint
ALTER TABLE "payment_refunds" DROP CONSTRAINT "payment_refunds_payment_school_fk";
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_student_school_fk";
--> statement-breakpoint
ALTER TABLE "payslips" DROP CONSTRAINT "payslips_payroll_run_school_fk";
--> statement-breakpoint
ALTER TABLE "payslips" DROP CONSTRAINT "payslips_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "payslips" DROP CONSTRAINT "payslips_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "resignation_records" DROP CONSTRAINT "resignation_records_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "resignation_records" DROP CONSTRAINT "resignation_records_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "salary_structures" DROP CONSTRAINT "salary_structures_teacher_school_fk";
--> statement-breakpoint
ALTER TABLE "salary_structures" DROP CONSTRAINT "salary_structures_staff_school_fk";
--> statement-breakpoint
ALTER TABLE "statutory_rate_configs" DROP CONSTRAINT "statutory_rate_configs_deduction_school_fk";
--> statement-breakpoint
ALTER TABLE "timetable_slots" DROP CONSTRAINT "timetable_slots_stream_school_fk";
--> statement-breakpoint
ALTER TABLE "timetable_slots" DROP CONSTRAINT "timetable_slots_class_subject_school_fk";
--> statement-breakpoint
DROP INDEX "class_subjects_id_school_unique";--> statement-breakpoint
DROP INDEX "credit_notes_id_school_unique";--> statement-breakpoint
DROP INDEX "employee_salary_loans_id_school_unique";--> statement-breakpoint
DROP INDEX "enrollments_id_school_unique";--> statement-breakpoint
DROP INDEX "exams_id_school_unique";--> statement-breakpoint
DROP INDEX "invoices_id_school_unique";--> statement-breakpoint
DROP INDEX "job_groups_id_school_unique";--> statement-breakpoint
DROP INDEX "leave_balances_employee_type_year_unique";--> statement-breakpoint
DROP INDEX "leave_types_id_school_unique";--> statement-breakpoint
DROP INDEX "loan_providers_id_school_unique";--> statement-breakpoint
DROP INDEX "payments_id_school_unique";--> statement-breakpoint
DROP INDEX "payroll_runs_id_school_unique";--> statement-breakpoint
DROP INDEX "statutory_deductions_id_school_unique";--> statement-breakpoint
DROP INDEX "attendance_student_date_unique";--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "school_nemis_no" text;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "school_kra_pin" text;--> statement-breakpoint
CREATE UNIQUE INDEX "schools_school_nemis_no_unique" ON "schools" USING btree ("school_nemis_no") WHERE "schools"."school_nemis_no" IS NOT NULL AND "schools"."school_nemis_no" <> '';--> statement-breakpoint
CREATE UNIQUE INDEX "schools_school_kra_pin_unique" ON "schools" USING btree ("school_kra_pin") WHERE "schools"."school_kra_pin" IS NOT NULL AND "schools"."school_kra_pin" <> '';--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_student_date_unique" ON "attendance" USING btree ("student_id","date");