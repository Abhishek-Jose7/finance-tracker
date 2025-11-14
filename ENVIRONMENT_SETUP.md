# Environment Setup Guide

## ⚠️ CRITICAL: Service Role Key Required

Your app needs the **Supabase Service Role Key** to work properly. Without it, users cannot be created or access the database.

## 🔑 Get Your Service Role Key

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to API Settings**
   - Click **Settings** (gear icon) in sidebar
   - Click **API** 

3. **Copy Service Role Key**
   - Find section: "Project API keys"
   - Copy the `service_role` key (not the anon key!)
   - ⚠️ **Keep this secret** - it bypasses all security rules

## 📝 Add to Local Environment

Create/update `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (Public - safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Supabase Service Role (PRIVATE - server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# HuggingFace (for ML categorization)
HUGGINGFACE_API_KEY=hf_...

# Google Genkit (for AI assistant)
GOOGLE_API_KEY=AIza...
```

## 🚀 Add to Vercel

1. **Open Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your project

2. **Add Environment Variable**
   - Go to **Settings** → **Environment Variables**
   - Add new variable:
     - Name: `SUPABASE_SERVICE_ROLE_KEY`
     - Value: Your service role key (paste here)
     - Environment: Production, Preview, Development (all)
   - Click **Save**

3. **Redeploy**
   - Go to **Deployments**
   - Click **⋯** on latest deployment → **Redeploy**
   - Or push a new commit to trigger auto-deploy

## 🧪 Verify Setup

After adding the service role key:

1. **Sign up a new user** via Clerk
2. **Check browser console** for logs:
   - ✅ "Syncing user to database: user_..."
   - ✅ "User created successfully: ..."
3. **Check Supabase**:
   - Go to Table Editor → users table
   - Your new user should appear

## 🤖 ML Model Information

**Transaction Categorization Model:**
- **Model**: `facebook/bart-large-mnli` (HuggingFace)
- **Endpoint**: https://api-inference.huggingface.co/models/facebook/bart-large-mnli
- **How it works**:
  1. User uploads CSV/JSON/HTML file with transactions
  2. Each transaction description is sent to the model
  3. Model returns confidence scores for each category
  4. If confidence > 50%: Auto-categorize
  5. If confidence ≤ 50%: Ask user to confirm
  6. Fallback: Rule-based categorization (keywords)

**Categories it recognizes:**
- Groceries
- Entertainment  
- Rent
- Dining
- Transportation
- Shopping
- Healthcare
- Education
- Utilities
- Income

## 🔍 Troubleshooting

### "User not found in database"
- ✅ **Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to environment
- The anon key can't create users due to RLS (Row Level Security)

### "Error creating user"
- Check console logs for detailed error
- Verify service role key is correct
- Ensure users table exists in Supabase
- Check Supabase project status

### File upload fails
- Verify `HUGGINGFACE_API_KEY` is set
- Check file format (CSV, JSON, HTML supported)
- Check console for parsing errors

### AI chat doesn't work
- Verify `GOOGLE_API_KEY` is set
- Check Genkit configuration
- Ensure user has transactions/categories

## 📚 Related Files

- **Database client**: `src/lib/supabase.ts`
- **User sync logic**: `src/lib/db-actions.ts`
- **File processing**: `src/lib/file-processing.ts`
- **ML categorization**: Line 402 in `file-processing.ts`

## 🔐 Security Notes

**Never expose the service role key:**
- ❌ Don't commit to Git
- ❌ Don't put in client-side code
- ❌ Don't share publicly
- ✅ Only use in server actions (`'use server'`)
- ✅ Store in environment variables
- ✅ Keep in `.env.local` (Git ignored)

The service role key bypasses ALL database security rules. Only use it in trusted server-side code.
