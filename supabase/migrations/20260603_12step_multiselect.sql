-- Migration: 12-step wizard multi-select fields
-- Date: 2026-06-03
-- Description: Convert text fields to text[] arrays and add new columns for multi-select support

-- 1. Rename old text columns and add new array columns
ALTER TABLE public.onboarding_submissions
  -- Convert current_pain_point (text) -> current_pain_points (text[])
  ADD COLUMN IF NOT EXISTS current_pain_points text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS current_pain_point_other text;

-- Migrate existing data
UPDATE public.onboarding_submissions
  SET current_pain_points = ARRAY[current_pain_point]
  WHERE current_pain_point IS NOT NULL AND current_pain_point != '' AND current_pain_points = '{}';

-- 2. Convert target_audience (text) -> target_audience_types (text[])
ALTER TABLE public.onboarding_submissions
  ADD COLUMN IF NOT EXISTS target_audience_types text[] NOT NULL DEFAULT '{}';

UPDATE public.onboarding_submissions
  SET target_audience_types = ARRAY[target_audience]
  WHERE target_audience IS NOT NULL AND target_audience != '' AND target_audience_types = '{}';

-- 3. Convert competitor_likes (text) -> competitor_likes_arr (text[])
-- Note: competitor_likes was already a text column, we need to convert to text[]
-- Since we can't just change the type, rename old and create new
ALTER TABLE public.onboarding_submissions
  RENAME COLUMN competitor_likes TO competitor_likes_old;

ALTER TABLE public.onboarding_submissions
  ADD COLUMN competitor_likes text[] NOT NULL DEFAULT '{}';

UPDATE public.onboarding_submissions
  SET competitor_likes = ARRAY[competitor_likes_old]
  WHERE competitor_likes_old IS NOT NULL AND competitor_likes_old != '';

-- 4. Convert unique_value_prop (text) -> unique_value_props (text[])
ALTER TABLE public.onboarding_submissions
  ADD COLUMN IF NOT EXISTS unique_value_props text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS unique_value_prop_other text;

UPDATE public.onboarding_submissions
  SET unique_value_props = ARRAY[unique_value_prop]
  WHERE unique_value_prop IS NOT NULL AND unique_value_prop != '' AND unique_value_props = '{}';

-- 5. Add social_media_networks column
ALTER TABLE public.onboarding_submissions
  ADD COLUMN IF NOT EXISTS social_media_networks text[] NOT NULL DEFAULT '{}';

-- 6. Convert project_description (text) -> project_goals (text[])
ALTER TABLE public.onboarding_submissions
  ADD COLUMN IF NOT EXISTS project_goals text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS project_goals_other text;

UPDATE public.onboarding_submissions
  SET project_goals = ARRAY[project_description]
  WHERE project_description IS NOT NULL AND project_description != '' AND project_goals = '{}';

-- 7. Drop old columns (keep backups for safety, drop after verification)
-- Uncomment these after verifying data migration:
-- ALTER TABLE public.onboarding_submissions DROP COLUMN IF EXISTS current_pain_point;
-- ALTER TABLE public.onboarding_submissions DROP COLUMN IF EXISTS target_audience;
-- ALTER TABLE public.onboarding_submissions DROP COLUMN IF EXISTS competitor_likes_old;
-- ALTER TABLE public.onboarding_submissions DROP COLUMN IF EXISTS unique_value_prop;
-- ALTER TABLE public.onboarding_submissions DROP COLUMN IF EXISTS project_description;
