CREATE OR REPLACE FUNCTION public.app_current_school_id()
RETURNS uuid
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT NULLIF(current_setting('app.current_school_id', true), '')::uuid
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.app_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.app_is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT COALESCE(NULLIF(current_setting('app.is_super_admin', true), '')::boolean, false)
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.app_auth_operation()
RETURNS boolean
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT COALESCE(NULLIF(current_setting('app.auth_operation', true), '')::boolean, false)
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.app_onboarding_operation()
RETURNS boolean
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT COALESCE(NULLIF(current_setting('app.onboarding_operation', true), '')::boolean, false)
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.app_school_lookup()
RETURNS boolean
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
  SELECT COALESCE(NULLIF(current_setting('app.school_lookup', true), '')::boolean, false)
$$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'school_smis_app') THEN
    CREATE ROLE school_smis_app
      NOLOGIN
      NOSUPERUSER
      NOCREATEDB
      NOCREATEROLE
      NOINHERIT
      NOREPLICATION
      NOBYPASSRLS;
  ELSE
    IF EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'school_smis_app'
        AND (rolsuper OR rolbypassrls)
    ) THEN
      RAISE EXCEPTION 'school_smis_app must not be a superuser or have BYPASSRLS';
    END IF;
    ALTER ROLE school_smis_app NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END
$$;
--> statement-breakpoint

GRANT USAGE ON SCHEMA public TO school_smis_app;
--> statement-breakpoint

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO school_smis_app;
--> statement-breakpoint

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO school_smis_app;
--> statement-breakpoint

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO school_smis_app;
--> statement-breakpoint

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO school_smis_app;
--> statement-breakpoint

DO $$
DECLARE
  tenant_table text;
BEGIN
  FOR tenant_table IN
    SELECT DISTINCT c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON t.table_schema = c.table_schema
     AND t.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND c.column_name = 'school_id'
      AND t.table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tenant_table);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', tenant_table);
    IF tenant_table = 'users' THEN
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT USING (
          school_id = public.app_current_school_id()
          OR public.app_is_super_admin()
          OR public.app_auth_operation()
        )',
        tenant_table || '_tenant_read',
        tenant_table
      );
    ELSE
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT USING (
          school_id = public.app_current_school_id()
          OR school_id IS NULL
          OR public.app_is_super_admin()
          OR public.app_auth_operation()
        )',
        tenant_table || '_tenant_read',
        tenant_table
      );
    END IF;
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (
        school_id = public.app_current_school_id()
        OR public.app_is_super_admin()
        OR public.app_auth_operation()
      ) WITH CHECK (
        school_id = public.app_current_school_id()
        OR public.app_is_super_admin()
        OR public.app_auth_operation()
      )',
      tenant_table || '_tenant_write',
      tenant_table
    );
  END LOOP;
END
$$;
--> statement-breakpoint

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

ALTER TABLE public.schools FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY schools_tenant_read ON public.schools
  FOR SELECT USING (
    id = public.app_current_school_id()
    OR public.app_is_super_admin()
    OR public.app_auth_operation()
    OR public.app_school_lookup()
    OR public.app_onboarding_operation()
  );
--> statement-breakpoint

CREATE POLICY schools_tenant_insert ON public.schools
  FOR INSERT WITH CHECK (
    public.app_is_super_admin()
    OR public.app_onboarding_operation()
  );
--> statement-breakpoint

CREATE POLICY schools_tenant_update ON public.schools
  FOR UPDATE
  USING (id = public.app_current_school_id() OR public.app_is_super_admin())
  WITH CHECK (id = public.app_current_school_id() OR public.app_is_super_admin());
--> statement-breakpoint

CREATE POLICY schools_tenant_delete ON public.schools
  FOR DELETE USING (public.app_is_super_admin());
--> statement-breakpoint

CREATE POLICY users_tenant_self_read ON public.users
  FOR SELECT USING (id = public.app_current_user_id());
--> statement-breakpoint

CREATE POLICY users_tenant_self_update ON public.users
  FOR UPDATE
  USING (id = public.app_current_user_id())
  WITH CHECK (
    id = public.app_current_user_id()
    AND (
      school_id IS NOT DISTINCT FROM public.app_current_school_id()
      OR public.app_onboarding_operation()
    )
  );
--> statement-breakpoint

ALTER TABLE public.system_sequences ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

ALTER TABLE public.system_sequences FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY system_sequences_platform_access ON public.system_sequences
  FOR ALL
  USING (public.app_is_super_admin() OR public.app_onboarding_operation())
  WITH CHECK (public.app_is_super_admin() OR public.app_onboarding_operation());
--> statement-breakpoint

DO $$
DECLARE
  auth_table text;
BEGIN
  FOREACH auth_table IN ARRAY ARRAY[
    'auth_sessions',
    'auth_challenges',
    'password_reset_otps',
    'refresh_sessions',
    'activation_tokens'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', auth_table);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', auth_table);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (
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
      ) WITH CHECK (
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
      )',
      auth_table || '_tenant_access',
      auth_table
    );
  END LOOP;
END
$$;
--> statement-breakpoint

ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

ALTER TABLE public.student_parents FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY student_parents_tenant_access ON public.student_parents
  FOR ALL
  USING (
    public.app_is_super_admin()
    OR public.app_auth_operation()
    OR EXISTS (
      SELECT 1
      FROM public.students s
      WHERE s.id = student_id
        AND s.school_id = public.app_current_school_id()
    )
    OR EXISTS (
      SELECT 1
      FROM public.parents p
      WHERE p.id = parent_id
        AND p.school_id = public.app_current_school_id()
    )
  )
  WITH CHECK (
    public.app_is_super_admin()
    OR public.app_auth_operation()
    OR (
      EXISTS (
        SELECT 1
        FROM public.students s
        WHERE s.id = student_id
          AND s.school_id = public.app_current_school_id()
      )
      AND EXISTS (
        SELECT 1
        FROM public.parents p
        WHERE p.id = parent_id
          AND p.school_id = public.app_current_school_id()
      )
    )
  );
--> statement-breakpoint

ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

ALTER TABLE public.teacher_subjects FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY teacher_subjects_tenant_access ON public.teacher_subjects
  FOR ALL
  USING (
    public.app_is_super_admin()
    OR public.app_auth_operation()
    OR (
      EXISTS (
        SELECT 1
        FROM public.teachers t
        WHERE t.id = teacher_id
          AND t.school_id = public.app_current_school_id()
      )
      AND EXISTS (
        SELECT 1
        FROM public.subjects s
        WHERE s.id = subject_id
          AND s.school_id = public.app_current_school_id()
      )
    )
  )
  WITH CHECK (
    public.app_is_super_admin()
    OR public.app_auth_operation()
    OR (
      EXISTS (
        SELECT 1
        FROM public.teachers t
        WHERE t.id = teacher_id
          AND t.school_id = public.app_current_school_id()
      )
      AND EXISTS (
        SELECT 1
        FROM public.subjects s
        WHERE s.id = subject_id
          AND s.school_id = public.app_current_school_id()
      )
    )
  );
