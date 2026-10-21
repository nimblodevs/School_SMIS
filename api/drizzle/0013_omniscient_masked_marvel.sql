CREATE TABLE "user_password_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_password_history" ADD CONSTRAINT "user_password_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_password_history_user_created_idx" ON "user_password_history" USING btree ("user_id","created_at");
--> statement-breakpoint
ALTER TABLE public.user_password_history ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE public.user_password_history FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY user_password_history_tenant_access ON public.user_password_history
  FOR ALL
  USING (
    public.app_auth_operation()
    OR public.app_is_super_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = user_id
        AND (
          u.id = public.app_current_user_id()
          OR u.school_id = public.app_current_school_id()
        )
    )
  )
  WITH CHECK (
    public.app_auth_operation()
    OR public.app_is_super_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = user_id
        AND (
          u.id = public.app_current_user_id()
          OR u.school_id = public.app_current_school_id()
        )
    )
  );