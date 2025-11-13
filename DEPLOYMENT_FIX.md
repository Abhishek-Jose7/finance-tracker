# 🔧 Deployment Fix Guide

## Issues Fixed

✅ **GitHub Actions CI/CD** - Updated to use `--legacy-peer-deps`  
✅ **Package.json** - Updated Clerk to compatible version  
✅ **Environment Variables** - Added to workflow  

---

## Required: Add Secrets to GitHub

Your CI/CD pipeline needs these secrets. Add them here:
**https://github.com/Abhishek-Jose7/finance-tracker/settings/secrets/actions**

### Click "New repository secret" for each:

1. **GEMINI_API_KEY**
   - Value: Your Gemini API key from https://makersuite.google.com/app/apikey

2. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - Value: Your Clerk publishable key from https://dashboard.clerk.com

3. **CLERK_SECRET_KEY**
   - Value: Your Clerk secret key from https://dashboard.clerk.com

4. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase project URL from https://supabase.com/dashboard

5. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon key from https://supabase.com/dashboard

6. **VERCEL_TOKEN** (if using Vercel auto-deploy)
   - Value: Get from https://vercel.com/account/tokens

7. **VERCEL_ORG_ID** (if using Vercel auto-deploy)
   - Value: Found in Vercel project settings

8. **VERCEL_PROJECT_ID** (if using Vercel auto-deploy)
   - Value: Found in Vercel project settings

---

## Required: Add Environment Variables to Vercel

Go to: **https://vercel.com/dashboard** → Your Project → Settings → Environment Variables

### Add these one by one:

| Name | Value | Environments |
|------|-------|--------------|
| `GEMINI_API_KEY` | Your Gemini key | Production, Preview, Development |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Your Clerk pub key | Production, Preview, Development |
| `CLERK_SECRET_KEY` | Your Clerk secret | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `HUGGINGFACE_API_KEY` | Your HF key (optional) | Production, Preview, Development |

**After adding variables, click "Redeploy" in Vercel!**

---

## Step-by-Step Fix Process

### 1. Commit and Push Changes

```powershell
git add .
git commit -m "fix: update dependencies and CI/CD configuration"
git push origin main
```

### 2. Add GitHub Secrets

- Go to: https://github.com/Abhishek-Jose7/finance-tracker/settings/secrets/actions
- Click "New repository secret"
- Add all secrets listed above

### 3. Re-run Failed Workflow

- Go to: https://github.com/Abhishek-Jose7/finance-tracker/actions
- Click on the failed workflow
- Click "Re-run all jobs"

### 4. Configure Vercel

**Option A: Manual Deploy (Recommended First Time)**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all variables listed above
5. Deployments → Click "..." → Redeploy

**Option B: Auto Deploy from GitHub**
- Vercel will automatically deploy when you push to main
- Just make sure environment variables are set!

---

## What Was Changed in Files

### `package.json`
```json
"@clerk/nextjs": "^6.7.2"  // Updated from 6.35.1
```

### `.github/workflows/ci-cd.yml`
```yaml
# Changed npm ci to:
npm ci --legacy-peer-deps

# Added environment variables to build:
env:
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
  # ... etc
```

---

## Quick Commands

### Push your changes:
```powershell
git add .
git commit -m "fix: CI/CD and deployment configuration"
git push origin main
```

### Verify build locally:
```powershell
npm run build
```

### Deploy to Vercel manually:
```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Troubleshooting

### "Secret does not exist" error
- Add the secret in GitHub: Settings → Secrets → Actions → New repository secret

### "Environment variable not found" in Vercel
- Add variable in Vercel: Project Settings → Environment Variables
- **Must redeploy** after adding variables

### CI/CD still failing with dependency errors
- The workflow now uses `--legacy-peer-deps` which should fix it
- Re-run the workflow after pushing the changes

### Build works locally but fails on Vercel
- Check that ALL environment variables are set in Vercel
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables

---

## Verification Checklist

- [ ] Pushed updated `package.json` and workflow file
- [ ] Added all 5-8 secrets to GitHub repository
- [ ] Added all environment variables to Vercel
- [ ] Redeployed on Vercel
- [ ] CI/CD pipeline passes (check GitHub Actions tab)
- [ ] App loads on Vercel URL

---

## Your Next Steps

1. **Push the changes** (files already updated)
2. **Add GitHub secrets** (link above)
3. **Add Vercel env vars** (link above)
4. **Redeploy**

After these steps, both GitHub Actions and Vercel deployment will work! 🚀
