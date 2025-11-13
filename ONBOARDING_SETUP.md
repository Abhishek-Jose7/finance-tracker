# User Profile Onboarding - Setup Guide

## Overview
The user profile onboarding system collects essential financial information from new users after they sign up. This ensures personalized budgeting and AI recommendations.

## What Was Added

### 1. Database Schema Updates
**File**: `supabase-profile-update.sql`

New columns added to the `users` table:
- `monthly_income` (NUMERIC) - User's monthly income
- `currency` (TEXT) - Preferred currency (default: USD)
- `salary_day` (INTEGER) - Day of month when salary is received (1-31)
- `occupation` (TEXT) - User's occupation/profession
- `onboarding_completed` (BOOLEAN) - Tracks if profile setup is complete
- `phone` (TEXT) - Phone number (optional)
- `date_of_birth` (DATE) - Date of birth (optional)

### 2. Components Created

#### ProfileOnboarding Component
**File**: `src/components/onboarding/ProfileOnboarding.tsx`

A multi-step onboarding form with:
- **Step 1**: Monthly income and currency selection
- **Step 2**: Salary day and occupation
- **Step 3**: Phone number and date of birth (optional)

Features:
- Progress indicator
- Form validation
- Dark theme matching FinAI design
- Smooth animations between steps
- Currency selection with 7 major currencies

### 3. Server Actions

#### completeUserOnboarding
**File**: `src/lib/db-actions.ts`

Server action that:
- Accepts profile data from the form
- Updates the user record in Supabase
- Sets `onboarding_completed` to true
- Returns success/error status

### 4. Context Updates

#### AppContext Enhancements
**File**: `src/context/AppContext.tsx`

Added:
- `UserProfile` interface with all profile fields
- `userProfile` state in context
- Loads user profile data on authentication
- Exports profile data for use across the app

### 5. Layout Integration

#### Main Layout Update
**File**: `src/app/(main)/layout.tsx`

- Checks if user has completed onboarding
- Shows ProfileOnboarding component if `onboarding_completed` is false
- Redirects to dashboard after completion

## Setup Instructions

### Step 1: Run Database Migration

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run the SQL from `supabase-profile-update.sql`:

\`\`\`sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_income NUMERIC(10, 2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE users ADD COLUMN IF NOT EXISTS salary_day INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;

CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed);
\`\`\`

### Step 2: Install Missing Dependencies (if needed)

The onboarding form uses `date-fns` for date formatting:

\`\`\`powershell
npm install date-fns
\`\`\`

### Step 3: Test the Flow

1. Sign up as a new user
2. After authentication, you should see the onboarding form
3. Complete all three steps
4. You'll be redirected to the dashboard

## User Flow

1. **New User Signs Up** → Clerk creates account
2. **User Redirected to App** → `syncUserToDatabase()` creates user in Supabase with `onboarding_completed = false`
3. **Onboarding Detected** → Layout shows ProfileOnboarding component
4. **User Completes Form** → Data saved to Supabase, `onboarding_completed = true`
5. **Dashboard Access** → User can now use the full app

## Data Collected

### Required Fields
- Monthly income (for budget calculations)
- Currency (for proper formatting)
- Salary day (for cash flow predictions)

### Optional Fields
- Occupation (for industry-specific insights)
- Phone number (for notifications, future feature)
- Date of birth (for long-term financial planning)

## How It Works

### Profile Check Logic
\`\`\`typescript
// In MainLayoutContent component
if (isSignedIn && !isLoading && userProfile && !userProfile.onboarding_completed) {
  return <ProfileOnboarding />;
}
\`\`\`

### Form Submission
\`\`\`typescript
const { error } = await completeUserOnboarding({
  monthly_income: parseFloat(monthly_income),
  currency: "USD",
  salary_day: 15,
  occupation: "Software Engineer",
  // ... optional fields
});
\`\`\`

## Customization

### Adding More Fields
1. Update database schema in `supabase-profile-update.sql`
2. Add field to `Database` interface in `src/lib/supabase.ts`
3. Add to form in `ProfileOnboarding.tsx`
4. Update `completeUserOnboarding()` to accept new field

### Changing Required Fields
Edit validation in `ProfileOnboarding.tsx`:
\`\`\`typescript
const isStep1Valid = formData.monthly_income && formData.currency;
\`\`\`

### Styling
The component uses Tailwind classes matching the FinAI theme:
- Dark background: `bg-slate-900`
- Primary color: `bg-primary` (cyan/blue gradient)
- Card styling: `bg-slate-800/50` with backdrop blur

## Accessing User Profile Data

### In Any Component
\`\`\`typescript
import { useAppContext } from "@/context/AppContext";

function MyComponent() {
  const { userProfile } = useAppContext();
  
  if (userProfile?.monthly_income) {
    // Use the data
    console.log(\`Income: \${userProfile.monthly_income} \${userProfile.currency}\`);
  }
}
\`\`\`

### In Server Actions
\`\`\`typescript
const user = await currentUser();
const { data: dbUser } = await supabase
  .from('users')
  .select('monthly_income, currency')
  .eq('clerk_user_id', user.id)
  .single();
\`\`\`

## Future Enhancements

Potential improvements:
- Email verification step
- Financial goals selection (predefined options)
- Budget preferences setup
- Notification preferences
- Skip option with ability to complete later
- Progress saving (partially complete profiles)
- Profile edit page in settings

## Troubleshooting

### Onboarding Loop (shows repeatedly)
- Check that `onboarding_completed` is being set to `true`
- Verify database update is successful
- Check browser console for errors

### Form Not Showing
- Verify user is authenticated (`isSignedIn === true`)
- Check that `userProfile.onboarding_completed === false`
- Ensure user exists in database

### Data Not Saving
- Check Supabase RLS policies allow updates
- Verify `clerk_user_id` matches between Clerk and Supabase
- Check network tab for API errors

## Security Notes

- All profile data is protected by Row Level Security (RLS)
- Only authenticated users can update their own profile
- Server actions validate user identity via Clerk
- Phone and date of birth are optional for privacy

## Files Modified/Created

### Created
- `supabase-profile-update.sql` - Database migration
- `src/components/onboarding/ProfileOnboarding.tsx` - Onboarding form
- `ONBOARDING_SETUP.md` - This documentation

### Modified
- `src/lib/supabase.ts` - Added profile fields to Database type
- `src/lib/db-actions.ts` - Added completeUserOnboarding()
- `src/context/AppContext.tsx` - Added userProfile state and loading
- `src/app/(main)/layout.tsx` - Added onboarding check and display

## Testing Checklist

- [ ] Database migration runs without errors
- [ ] New user sees onboarding after signup
- [ ] All form steps work correctly
- [ ] Validation prevents skipping required fields
- [ ] Data saves to Supabase correctly
- [ ] User redirected to dashboard after completion
- [ ] Existing users don't see onboarding
- [ ] Profile data accessible via useAppContext()
- [ ] Build completes without TypeScript errors
- [ ] No console errors in browser
