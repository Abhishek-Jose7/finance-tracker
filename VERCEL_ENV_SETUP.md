# Vercel Environment Variables Setup

## Critical: Add SUPABASE_SERVICE_ROLE_KEY to Vercel

The app is currently failing because the `SUPABASE_SERVICE_ROLE_KEY` environment variable is missing from your Vercel deployment.

### Steps to Fix:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `finance-assistant`

2. **Navigate to Environment Variables**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add the Service Role Key**
   - Click "Add New" button
   - Enter the following:
     - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
     - **Value**: Copy the value from your `.env` file (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
     - **Environments**: Select all (Production, Preview, Development)
   - Click "Save"

4. **Redeploy**
   - After adding the variable, Vercel will prompt you to redeploy
   - Click "Redeploy" or push a new commit to trigger deployment

### All Required Environment Variables

Make sure ALL of these are set in Vercel (copy the actual values from your `.env` file):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
GEMINI_API_KEY=<your-gemini-api-key>
HUGGINGFACE_API_KEY=<your-huggingface-api-key>
```

**Important**: Copy the actual values from your local `.env` file - do not use the placeholders above.

### Why This is Critical

The `SUPABASE_SERVICE_ROLE_KEY` allows the app to:
- Create user records in the database (bypassing RLS policies)
- Save uploaded files and transactions
- Store chat history
- Manage user preferences

Without it, users will see errors like:
- "Failed to sync user to database"
- "User not found"
- "Error loading chat history"

### Verification

After adding the environment variable and redeploying:

1. Sign in to your app
2. Open browser console (F12)
3. Look for these success messages:
   - `✅ User created successfully` or `✅ User already exists`
   - `✅ User synced:`
   - Categories and transactions should load

4. If you still see errors, check:
   - The environment variable is set correctly (no extra spaces)
   - All environments are selected (Production, Preview, Development)
   - The deployment completed successfully after adding the variable

### Quick Access Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Project**: https://vercel.com/abhishekjose780-gmailcoms-projects/finance-assistant
- **Settings**: https://vercel.com/abhishekjose780-gmailcoms-projects/finance-assistant/settings/environment-variables
