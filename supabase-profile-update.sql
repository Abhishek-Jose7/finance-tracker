-- ============================================
-- User Profile Onboarding - Database Migration
-- ============================================
-- Run this in Supabase SQL Editor AFTER running the initial schema (supabase-schema.sql)
-- This adds fields needed for user profile onboarding

-- Add user profile fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_income NUMERIC(10, 2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE users ADD COLUMN IF NOT EXISTS salary_day INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create an index for faster queries on onboarding status
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed);

-- Optional: Update existing users to have onboarding_completed = FALSE
-- Uncomment the line below if you have existing users who need to complete onboarding
-- UPDATE users SET onboarding_completed = FALSE WHERE onboarding_completed IS NULL;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('monthly_income', 'currency', 'salary_day', 'occupation', 'onboarding_completed', 'phone', 'date_of_birth')
ORDER BY column_name;
