UPDATE "schools"
SET "school_name" = COALESCE(NULLIF("school_name", ''), NULLIF("name", ''), ''),
    "school_slug" = COALESCE(NULLIF("school_slug", ''), NULLIF("slug", ''), ''),
    "school_motto" = COALESCE(NULLIF("school_motto", ''), NULLIF("motto", ''), ''),
    "vision_statement" = COALESCE(NULLIF("vision_statement", ''), NULLIF("vision", ''), ''),
    "mission_statement" = COALESCE(NULLIF("mission_statement", ''), NULLIF("mission", ''), ''),
    "official_phone" = COALESCE(NULLIF("official_phone", ''), NULLIF("phone", ''), ''),
    "school_email" = COALESCE(NULLIF("school_email", ''), NULLIF("email", ''), ''),
    "head_office_address" = COALESCE(NULLIF("head_office_address", ''), NULLIF("address", ''), ''),
    "school_location" = COALESCE("school_location", '{}'::jsonb) || jsonb_strip_nulls(
      jsonb_build_object(
        'area', COALESCE(NULLIF("school_location" ->> 'area', ''), NULLIF("city", '')),
        'county', COALESCE(NULLIF("school_location" ->> 'county', ''), NULLIF("county", '')),
        'postalCode', COALESCE(NULLIF("school_location" ->> 'postalCode', ''), NULLIF("postal_code", ''))
      )
    );--> statement-breakpoint
DROP INDEX "schools_slug_unique";--> statement-breakpoint
DROP INDEX "schools_phone_unique";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "motto";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "vision";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "mission";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "county";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "postal_code";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "email";