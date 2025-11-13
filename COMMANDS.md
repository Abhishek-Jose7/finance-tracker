# Quick Setup Commands

Run these commands in PowerShell to set up authentication and database:

## 1. Install Dependencies

```powershell
npm install @clerk/nextjs @supabase/supabase-js --legacy-peer-deps
```

## 2. Set Up Environment Variables

Add these to your `.env` file (get the actual values from dashboards):

```env
# Clerk Authentication (from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase Database (from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# HuggingFace API (optional - for ML transaction categorization)
# Get from: https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=hf_your_key_here
```

## 3. Run Database Schema

### Initial Schema Setup
1. Go to your Supabase project: https://supabase.com/dashboard
2. Click **SQL Editor**
3. Create **New Query**
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click **Run** (or press Ctrl+Enter)

### User Profile Onboarding Schema
1. In the same SQL Editor
2. Create another **New Query**
3. Copy and paste the entire contents of `supabase-profile-update.sql`
4. Click **Run** to add onboarding fields to users table

### File Upload & ML Categorization Schema (NEW)
1. Create another **New Query**
2. Copy and paste the entire contents of `supabase-ml-upload.sql`
3. Click **Run** to add file upload and ML categorization support

## 4. Start the Application

```powershell
# Clear cache and restart
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

## 5. Test Everything

1. Open http://localhost:3000
2. You'll be redirected to sign-in
3. Create an account
4. Verify you can access the dashboard
5. Test the AI chatbot in the Assistant page

---

## Detailed Setup Guide

For step-by-step instructions with screenshots, see: **SETUP_AUTH_DB.md**

---

## Troubleshooting

### If you get module errors:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install --legacy-peer-deps
```

### If environment variables don't work:

```powershell
# Restart the dev server
# Stop with Ctrl+C, then:
npm run dev
```

### If you get Clerk middleware errors:

The middleware file should be at `src/middleware.ts` (not root). This has been fixed.

```powershell
# Clear cache and restart
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

### If database queries fail:

- Verify you ran the SQL schema in Supabase
- Check your Supabase project is active
- Verify the URL and keys in `.env`

---

## What Was Implemented

✅ **Clerk Authentication**
- Sign-in and Sign-up pages with matching design
- Protected routes (requires login to access app)
- User profile integration in header
- Automatic user sync to database

✅ **Supabase Database**
- Users table (stores user profiles)
- Transactions table (stores financial transactions)
- Categories table (stores budget categories)
- Row Level Security (RLS) policies
- Automatic timestamps
- User data isolation

✅ **User Profile Onboarding**
- 4-step enhanced profile setup
- Collects: monthly income, currency, salary day, occupation
- **NEW**: Budget setup for 8 categories with visual feedback
- Optional: phone number, date of birth
- Real-time budget percentage calculation
- Profile data stored in Supabase users table

✅ **File Upload & ML Categorization (NEW)**
- Drag-and-drop transaction file upload
- Supports: CSV, PDF, JSON, Images
- Works with GPay and bank statement exports
- AI-powered categorization using HuggingFace
- Automatic transaction extraction and categorization
- Fast processing with progress feedback

✅ **Budget Management (NEW)**
- Edit budgets anytime in Settings
- Visual budget cards with progress bars
- Real-time income percentage calculation
- Warning alerts for over-budget categories
- One-click save for all changes

✅ **Real User Data Only (NEW)**
- Removed all hardcoded mock data
- All data comes from Supabase database
- Empty state for new users (no fake data)
- Upload transactions to populate your account

✅ **Existing Features Preserved**
- AI chatbot still works with Gemini API
- All UI components unchanged
- Same design and styling
- No breaking changes to existing code

✅ **Data Flow**
- Authenticated users → data saved to Supabase
- Unauthenticated users → mock data (for testing)
- Real-time data sync
- Automatic category creation on first login

---

## Files Created/Modified

### New Files:
- `src/middleware.ts` - Clerk authentication middleware
- `src/lib/supabase.ts` - Supabase client and types
- `src/lib/db-actions.ts` - Database helper functions
- `src/app/sign-in/[[...sign-in]]/page.tsx` - Sign-in page
- `src/app/sign-up/[[...sign-up]]/page.tsx` - Sign-up page
- `src/components/onboarding/ProfileOnboarding.tsx` - User profile onboarding form
- `supabase-schema.sql` - Initial database schema
- `supabase-profile-update.sql` - Onboarding fields migration
- `SETUP_AUTH_DB.md` - Detailed setup guide
- `ONBOARDING_SETUP.md` - Onboarding system documentation
- `COMMANDS.md` - This file

### Modified Files:
- `package.json` - Added Clerk and Supabase dependencies
- `.env.example` - Added new environment variables
- `src/app/layout.tsx` - Added ClerkProvider
- `src/app/(main)/layout.tsx` - Added onboarding check and display logic
- `src/context/AppContext.tsx` - Integrated with Supabase, added userProfile state
- `src/components/layout/Header.tsx` - Added UserButton
- `src/lib/supabase.ts` - Added onboarding fields to Database type
- `src/lib/db-actions.ts` - Added completeUserOnboarding() function

### Not Changed:
- All AI flows (chatbot still works!)
- All UI components
- All existing pages
- Design and styling
- Other functionality

---

**Ready to go!** 🚀
