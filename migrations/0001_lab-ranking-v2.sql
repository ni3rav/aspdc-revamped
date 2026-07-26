CREATE TABLE "lab_profile_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"score_version" integer NOT NULL,
	"developer_score" integer NOT NULL,
	"pillar_scores" jsonb NOT NULL,
	"ranking_snapshot" jsonb NOT NULL,
	"captured_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lab_profile_scores_developer_score_check" CHECK ("lab_profile_scores"."developer_score" between 0 and 100)
);
--> statement-breakpoint
ALTER TABLE "lab_profile_scores" ADD CONSTRAINT "lab_profile_scores_profile_id_lab_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."lab_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lab_profile_scores_profile_version_idx" ON "lab_profile_scores" USING btree ("profile_id","score_version");--> statement-breakpoint
CREATE INDEX "lab_profile_scores_version_score_idx" ON "lab_profile_scores" USING btree ("score_version","developer_score");