# User Profile Onboarding - Quick Start

## 🎯 What This Does

After a user signs up with Clerk, they are automatically prompted to complete their financial profile with:
- Monthly income
- Preferred currency
- Salary payment day
- Occupation (optional)
- Phone number (optional)
- Date of birth (optional)

This data is stored in Supabase and used to provide personalized financial insights and AI recommendations.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Run the SQL Migration

In Supabase SQL Editor, run this:

```sql
-- Run in Supabase SQL Editor
-- Copy from: supabase-profile-update.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_income NUMERIC(10, 2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE users ADD COLUMN IF NOT EXISTS salary_day INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;

CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed);
```

### Step 2: Restart Your Dev Server

```powershell
# Stop the server (Ctrl+C), then restart
npm run dev
```

### Step 3: Test It

1. Sign up as a new user at http://localhost:3000
2. You'll see the onboarding form with 3 steps
3. Complete the form
4. You'll be redirected to the dashboard

---

## 📋 How It Works

### User Flow

```
New User Signs Up
    ↓
Clerk Creates Account
    ↓
User Synced to Supabase (onboarding_completed = false)
    ↓
Onboarding Form Appears (3 steps)
    ↓
User Fills Out Profile
    ↓
Data Saved to Supabase (onboarding_completed = true)
    ↓
Dashboard Access Granted ✅
```

### Technical Flow

1. **Layout Check**: `src/app/(main)/layout.tsx` checks if `onboarding_completed === false`
2. **Show Form**: If incomplete, shows `ProfileOnboarding` component
3. **Form Submit**: Calls `completeUserOnboarding()` server action
4. **Update DB**: Sets `onboarding_completed = true` in Supabase
5. **Redirect**: User sees the main dashboard

---

## 🎨 Form Steps

### Step 1: Financial Basics
- **Monthly Income** (required) - Used for budget calculations
- **Currency** (required) - USD, EUR, GBP, JPY, AUD, CAD, INR

### Step 2: Payment Details
- **Salary Day** (required) - Day of month (1-31) when salary arrives
- **Occupation** (optional) - For personalized financial advice

### Step 3: Personal Info
- **Phone Number** (optional) - For future notifications
- **Date of Birth** (optional) - For long-term financial planning

All data is protected by Supabase Row Level Security (RLS).

---

## 🔧 Files Changed

### Created
- `src/components/onboarding/ProfileOnboarding.tsx` - The form component
- `supabase-profile-update.sql` - Database migration
- `ONBOARDING_SETUP.md` - Full documentation
- `QUICK_START_ONBOARDING.md` - This file

### Modified
- `src/lib/supabase.ts` - Added profile fields to type definitions
- `src/lib/db-actions.ts` - Added `completeUserOnboarding()` function
- `src/context/AppContext.tsx` - Added `userProfile` state
- `src/app/(main)/layout.tsx` - Added onboarding check logic
- `COMMANDS.md` - Updated with onboarding instructions

---

## 💡 Using Profile Data in Your App

### In Components

```typescript
import { useAppContext } from "@/context/AppContext";

function MyComponent() {
  const { userProfile } = useAppContext();
  
  return (
    <div>
      <p>Monthly Income: {userProfile?.monthly_income} {userProfile?.currency}</p>
      <p>Salary Day: {userProfile?.salary_day}</p>
    </div>
  );
}
```

### In Server Actions

```typescript
import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function myServerAction() {
  const user = await currentUser();
  
  const { data } = await supabase
    .from("users")
    .select("monthly_income, currency, salary_day")
    .eq("clerk_user_id", user.id)
    .single();
  
  // Use the data...
}
```

---

## 🐛 Troubleshooting

### "Onboarding keeps showing even after completion"
**Solution**: Clear browser cache and check database:
```sql
SELECT clerk_user_id, email, onboarding_completed FROM users;
```

### "Form submit fails"
**Solution**: Check Supabase logs and ensure RLS policies allow user updates:
```sql
-- In Supabase SQL Editor
SELECT * FROM users WHERE clerk_user_id = 'user_xxx';
```

### "TypeScript errors about userProfile"
**Solution**: Make sure you ran `npm run dev` after the changes. TypeScript should recognize the new types.

---

## ✅ Testing Checklist

- [ ] SQL migration runs without errors in Supabase
- [ ] New users see the onboarding form after sign-up
- [ ] All 3 form steps work correctly
- [ ] Required field validation works (can't skip steps)
- [ ] Data saves to Supabase users table
- [ ] `onboarding_completed` becomes `true` after submission
- [ ] User redirected to dashboard after completion
- [ ] Existing users (if any) don't see onboarding repeatedly
- [ ] Profile data accessible via `useAppContext()`
- [ ] No TypeScript or build errors

---

## 📚 Full Documentation

For complete details, see:
- **ONBOARDING_SETUP.md** - Full implementation guide
- **SETUP_AUTH_DB.md** - Initial auth/database setup
- **COMMANDS.md** - All setup commands

---

## 🎉 That's It!

Your users will now have a smooth onboarding experience that collects essential financial information for personalized AI-powered insights!

**Need help?** Check the full documentation in `ONBOARDING_SETUP.md`
