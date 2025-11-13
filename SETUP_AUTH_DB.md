# Authentication & Database Setup Guide

This guide will help you set up Clerk authentication and Supabase database for your FinAI application.

## Table of Contents
1. [Install Dependencies](#1-install-dependencies)
2. [Set Up Clerk Authentication](#2-set-up-clerk-authentication)
3. [Set Up Supabase Database](#3-set-up-supabase-database)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Run the Application](#5-run-the-application)

---

## 1. Install Dependencies

Run the following command in PowerShell to install the required packages:

```powershell
npm install @clerk/nextjs @supabase/supabase-js --legacy-peer-deps
```

---

## 2. Set Up Clerk Authentication

### Step 1: Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose "Next.js" as your framework

### Step 2: Get Your Clerk Keys

1. In the Clerk dashboard, go to **API Keys**
2. Copy the following keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Step 3: Configure Clerk Settings

1. In Clerk dashboard, go to **User & Authentication → Email, Phone, Username**
2. Enable **Email address** (required)
3. Configure **Social Login** providers if desired (Google, GitHub, etc.)
4. Go to **User & Authentication → Sessions**
5. Set session lifetime as needed (default is fine)

---

## 3. Set Up Supabase Database

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Fill in:
   - **Project name**: finai-database (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for the project to be created (~2 minutes)

### Step 2: Get Your Supabase Keys

1. In the Supabase dashboard, go to **Settings → API**
2. Copy the following:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **Run** or press `Ctrl+Enter`

You should see messages like:
- ✅ "Success. No rows returned"
- ✅ "CREATE TABLE"
- ✅ "CREATE INDEX"

### Step 4: Verify Database Setup

Run these verification queries in the SQL Editor:

```sql
-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show: users, transactions, categories
```

### Step 5: Configure Supabase Authentication (Optional but Recommended)

For better security with RLS policies:

1. Go to **Authentication → Providers**
2. Enable **Custom JWT** provider
3. Add Clerk's JWT template:
   - In Clerk dashboard, go to **JWT Templates**
   - Create a new template named "supabase"
   - Add this claim:
     ```json
     {
       "sub": "{{user.id}}"
     }
     ```
4. Copy the JWKS URL from Clerk
5. In Supabase, paste it in the Custom JWT provider settings

---

## 4. Configure Environment Variables

### Step 1: Update Your .env File

Open your `.env` file and add all the keys:

```env
# Google Gemini API Key (existing)
GEMINI_API_KEY=your_actual_gemini_api_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxx

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxx
```

### Step 2: Verify Environment Variables

Create a test file to verify (then delete it):

```typescript
// test-env.ts
console.log('Clerk Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

## 5. Run the Application

### Step 1: Build and Start

```powershell
# Clear any previous builds
Remove-Item -Recurse -Force .next

# Install dependencies
npm install --legacy-peer-deps

# Run in development mode
npm run dev
```

### Step 2: Test the Authentication Flow

1. Open [http://localhost:3000](http://localhost:3000)
2. You should be redirected to `/sign-in`
3. Click **Sign up** to create a new account
4. Fill in your email and password
5. Verify your email (check inbox)
6. You should be redirected to the dashboard

### Step 3: Verify Database Connection

1. Sign in to your application
2. The app should automatically:
   - Create a user record in Supabase
   - Create default categories
3. Check in Supabase dashboard:
   - Go to **Table Editor → users**
   - You should see your user record
   - Go to **Table Editor → categories**
   - You should see 8 default categories

---

## Testing the Chatbot

The AI chatbot should work automatically with your existing Gemini API key. Test it:

1. Go to the **AI Assistant** page
2. Type a message like "Analyze my budget"
3. The chatbot should respond using the Gemini AI

If you get an error:
- Verify your `GEMINI_API_KEY` is set correctly in `.env`
- Restart the dev server after changing `.env`
- Check the browser console for error messages

---

## Common Issues & Solutions

### Issue: "Cannot find module '@clerk/nextjs'"

**Solution:**
```powershell
npm install @clerk/nextjs --legacy-peer-deps
```

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution:**
```powershell
npm install @supabase/supabase-js --legacy-peer-deps
```

### Issue: Sign-in page shows errors

**Solution:**
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct
- Check Clerk dashboard is active
- Clear browser cache

### Issue: Database queries fail

**Solution:**
- Verify Supabase project is active
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Re-run the SQL schema
- Check RLS policies are enabled

### Issue: Chatbot doesn't respond

**Solution:**
- Verify `GEMINI_API_KEY` in `.env`
- Check API key is valid in [Google AI Studio](https://makersuite.google.com/app/apikey)
- Restart dev server

---

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment-specific keys** - Different keys for dev/prod
3. **Rotate keys regularly** - Change API keys every few months
4. **Enable Clerk MFA** - Add multi-factor authentication
5. **Review Supabase RLS policies** - Ensure users can only access their data
6. **Monitor usage** - Check API usage in dashboards

---

## Production Deployment

When deploying to production:

1. **Vercel/Netlify:**
   - Add all environment variables in dashboard
   - Use production Clerk keys
   - Use production Supabase keys

2. **Update Clerk URLs:**
   - Add production domain to allowed origins
   - Update redirect URLs

3. **Supabase Production:**
   - Consider upgrading to paid plan for better performance
   - Enable Point-in-Time Recovery (PITR)
   - Set up database backups

---

## Support

- **Clerk Documentation:** [https://clerk.com/docs](https://clerk.com/docs)
- **Supabase Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
- **FinAI Issues:** Create an issue on GitHub

---

## Quick Reference

### PowerShell Commands

```powershell
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Check environment variables
Get-Content .env
```

### Important URLs

- **Clerk Dashboard:** https://dashboard.clerk.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Google AI Studio:** https://makersuite.google.com
- **Local App:** http://localhost:3000

---

**Setup complete!** 🎉 Your FinAI application now has:
- ✅ Secure authentication with Clerk
- ✅ Database storage with Supabase
- ✅ AI chatbot with Gemini API
- ✅ User-specific data isolation
- ✅ Production-ready architecture
