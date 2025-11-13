# Quick Start Guide

Get FinAI up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18.0.0 or higher installed
- ✅ npm, yarn, or pnpm package manager
- ✅ A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

Check your Node version:
```bash
node --version
# Should output v18.x.x or higher
```

## Installation Steps

### 1. Install Dependencies (2 minutes)

```bash
# Navigate to project directory
cd c:\fpti

# Install all dependencies
npm install
```

This will install all required packages including Next.js, React, Tailwind CSS, and AI dependencies.

### 2. Configure Environment (1 minute)

Create your environment file:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Then edit .env with your favorite editor
notepad .env
```

Update the `.env` file with your API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get your Gemini API key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into `.env`

### 3. Start Development Server (30 seconds)

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.0.3
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 4. Open in Browser

Navigate to: **http://localhost:3000**

## First Time Using the App

### Onboarding Flow

1. **Welcome Screen**: You'll see an AI-powered onboarding
2. **Budget Setup**: Chat with the AI to set up your initial budget
3. **Categories**: The AI will help you define spending categories
4. **Income**: Tell the AI about your monthly income
5. **Goals**: Set your financial goals

This takes about 2-3 minutes and can be customized later!

### After Onboarding

You'll see the **Dashboard** with:
- 📊 Budget overview
- 🔔 AI alerts for potential overspending
- 📈 Spending predictions
- 💡 Personalized recommendations
- 📁 Category breakdown

## Navigation

Use the sidebar to access:
- **Dashboard** (Home) - Overview and insights
- **Budget** - Manage your budget categories
- **Transactions** - View and manage transactions
- **Assistant** - Chat with AI for financial advice
- **Settings** - Customize your preferences

## Quick Tips

### Try These Commands with the AI Assistant

- "How am I doing this month?"
- "Should I adjust my grocery budget?"
- "What are my biggest expenses?"
- "Help me save more money"
- "Analyze my spending patterns"

### Managing Your Budget

1. Go to **Budget** page
2. Click on any category to adjust limits
3. Use sliders to set budget amounts
4. AI will provide recommendations

### Adding Transactions

1. Go to **Transactions** page
2. Click "Add Transaction"
3. Fill in details (amount, category, date)
4. AI will analyze impact on your budget

## Common Issues & Solutions

### Issue: "Cannot find module 'next'"

**Solution:** Dependencies not installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Invalid API key"

**Solution:** Check your `.env` file
- Ensure `GEMINI_API_KEY` is set correctly
- No spaces or quotes around the key
- Restart dev server after changing `.env`

### Issue: AI features not working

**Solution:** Verify API key permissions
- Go to Google AI Studio
- Check API key is active
- Verify it has access to Gemini models
- Check for rate limit errors in console

### Issue: Port 3000 already in use

**Solution:** Use a different port
```bash
# Windows
$env:PORT=3001; npm run dev

# Or kill the process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Issue: TypeScript errors

**Solution:** Type check
```bash
npx tsc --noEmit
# This will show specific type errors
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

## Making Changes

### Customizing Colors

Edit `src/app/globals.css` to change theme colors:
```css
:root {
  --primary: 197 71% 54%;  /* Main brand color */
  --accent: 217 100% 56%;  /* Accent color */
}
```

### Adding New Pages

1. Create file in `src/app/(main)/your-page/page.tsx`
2. Add route to sidebar in `src/components/layout/AppSidebar.tsx`

### Modifying AI Prompts

AI prompts are in `src/ai/flows/` - edit these to customize AI behavior.

## Production Build

Before deploying:

```bash
# Build the app
npm run build

# Test production build locally
npm run start
```

If build succeeds, you're ready to deploy! See `DEPLOYMENT.md` for details.

## Next Steps

- ✅ **Explore Features**: Try all pages and AI features
- ✅ **Customize**: Adjust colors, categories, budgets
- ✅ **Deploy**: See `DEPLOYMENT.md` for deployment options
- ✅ **Contribute**: See `CONTRIBUTING.md` for guidelines

## Getting Help

- 📖 Check `README.md` for detailed documentation
- 🚀 See `DEPLOYMENT.md` for deployment guides
- 🐛 Create an issue on GitHub
- 💬 Check existing issues for solutions

## Success Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with API key
- [ ] Dev server running (`npm run dev`)
- [ ] App opens at http://localhost:3000
- [ ] Onboarding completed
- [ ] AI features working (test in Assistant page)

**Congratulations!** 🎉 You're ready to use FinAI!

---

**Enjoying FinAI?** Give us a ⭐ on GitHub!
