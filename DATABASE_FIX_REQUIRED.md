# 🚨 URGENT: Database Schema Fix Required

## Problem
Your database is missing required columns in the `users` table, causing user sync to fail with:
```
Could not find the 'currency' column of 'users' in the schema cache
```

## Solution: Run This SQL Script

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `jncxcymqpbyrulmsqfdr`
3. **Go to SQL Editor** (left sidebar)
4. **Create a new query**
5. **Copy and paste this ENTIRE script**:

```sql
-- Add missing user profile columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_income NUMERIC(10, 2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';
ALTER TABLE users ADD COLUMN IF NOT EXISTS salary_day INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed);

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('monthly_income', 'currency', 'salary_day', 'occupation', 'onboarding_completed', 'phone', 'date_of_birth')
ORDER BY column_name;
```

6. **Click "Run"** (or press Ctrl+Enter)
7. **Verify output** - You should see 7 rows showing the new columns

## After Running the Script

1. Refresh your app: https://your-domain.vercel.app
2. Try signing in again
3. You should see: `✅ User synced:` in the console

## What This Does

Adds these columns to your `users` table:
- `monthly_income` - User's monthly income (optional)
- `currency` - Currency preference (default: INR)
- `salary_day` - Day of month salary is received
- `occupation` - User's occupation
- `onboarding_completed` - Whether user completed setup (default: false)
- `phone` - User's phone number
- `date_of_birth` - User's date of birth

## Alternative: Full Schema Reset (if above doesn't work)

If you want to start fresh, run `supabase-schema.sql` first, then `supabase-profile-update.sql`.

⚠️ **This will delete all existing data!**

## Verification

After running the migration, visit:
```
https://your-domain.vercel.app/api/test-sync
```

You should see:
```json
{
  "tests": {
    "createAttempt": {
      "success": true,
      "data": { ... user data ... }
    }
  }
}
```
