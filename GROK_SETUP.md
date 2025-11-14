# Grok API Integration Setup

## Overview
The app now supports dual AI providers with automatic fallback:
1. **Primary**: Gemini API (Google)
2. **Fallback**: Grok API (x.ai)

If Gemini fails or is unavailable, the system automatically falls back to Grok.

## Common Issues & Solutions

### Issue: "I apologize, but I'm currently experiencing technical difficulties"

**Why this happens:**
1. **Missing Flow Import**: The `general-financial-assistant` flow wasn't imported in `src/ai/dev.ts` (NOW FIXED ✅)
2. **API Key Not Set**: Neither GEMINI_API_KEY nor GROK_API_KEY is configured in environment variables
3. **Genkit Initialization Failed**: The AI flow framework couldn't initialize properly
4. **Network/API Errors**: The API provider is temporarily unavailable or rate-limited
5. **Invalid API Key**: The key in environment variables is incorrect or expired

**Solutions Applied:**
- ✅ Added `general-financial-assistant.ts` import to `dev.ts`
- ✅ Enhanced error logging to show exact failure reason
- ✅ Error messages now display in chat with specific details
- ✅ Console logs show environment check (API keys presence/length)
- ✅ Fallback to Grok if Gemini fails

**How to diagnose:**
1. Open browser DevTools Console (F12)
2. Look for log messages:
   - `🤖 Calling generalFinancialAssistant with input`
   - `Environment check: { hasGemini: true/false, hasGrok: true/false }`
   - `✅ Gemini response successful` OR `⚠️ Gemini failed with error:`
3. Check the error object for specific failure reason

### Issue: Chat history only shows user messages, not AI responses

**Why this happened:**
- Chat messages were being saved but there was no verification logging
- If save failed silently, the message wouldn't persist
- The getChatHistory function was working, but saves might have failed

**Solutions Applied:**
- ✅ Added console logging for every message save attempt
- ✅ Log format: `💾 Saving user/assistant message for user [id]`
- ✅ Verification: `✅ user/assistant message saved with id: [uuid]`
- ✅ Error handling: Shows specific error if save fails
- ✅ Both user AND assistant messages are explicitly saved to `chat_messages` table

**How to verify:**
1. Send a message in the assistant
2. Check console for: `💾 Saving user message...` then `💾 Saving assistant message...`
3. Verify both show: `✅ message saved with id: [uuid]`
4. Refresh page - both messages should persist

## Vercel Environment Variable Setup

### Step 1: Go to Vercel Dashboard
1. Navigate to https://vercel.com
2. Select your project (finance-tracker)
3. Go to **Settings** → **Environment Variables**

### Step 2: Add GROK_API_KEY
1. Click "Add New" button
2. Fill in the form:
   - **Key**: `GROK_API_KEY`
   - **Value**: `gsk_[YOUR_GROK_API_KEY_HERE]`
   - **Environments**: Select all (Production, Preview, Development)
3. Click "Save"

> **Note**: Your Grok API key starts with `gsk_` and should be kept in your .env file locally.

### Step 3: Redeploy
After adding the environment variable, redeploy your app:
- Go to **Deployments** tab
- Click on the latest deployment
- Click the "..." menu → "Redeploy"
- OR: Simply push a new commit to trigger automatic deployment

## How It Works

### Fallback Logic
```
User sends message to chatbot
  ↓
Try Gemini API
  ↓
Success? → Return Gemini response ✅
  ↓
Failure? → Try Grok API
  ↓
Success? → Return Grok response ✅
  ↓
Failure? → Return friendly error message
```

### Implementation Details

#### genkit.ts
- Checks for both `GEMINI_API_KEY` and `GROK_API_KEY`
- Prefers Gemini if available
- Falls back to Grok if Gemini not configured
- Exports `getCurrentModel()` to identify which AI is in use

#### general-financial-assistant.ts
- First attempts to use Gemini via Genkit flow
- On Gemini failure, catches error and calls Grok directly
- Grok uses OpenAI-compatible API endpoint: `https://api.x.ai/v1/chat/completions`
- Builds comprehensive prompt with user's financial data
- Returns fallback message if both fail

## Testing the Integration

### 1. Test Locally
```bash
# Add to your .env file
GROK_API_KEY=gsk_[YOUR_KEY_HERE]

# Run dev server
npm run dev

# Open http://localhost:3000/assistant
# Send message: "Analyze my spending"
```

### 2. Check Console Logs
Look for these log messages:
- `✅ Gemini response successful` - Gemini working
- `⚠️ Gemini failed, trying Grok fallback` - Falling back to Grok
- `✅ Grok fallback successful` - Grok working
- `Using Grok API directly` - Using Grok as primary (Gemini not configured)

### 3. Verify in Production
After deployment:
1. Go to your Vercel deployment URL
2. Navigate to /assistant
3. Send a message to the chatbot
4. Should receive financial advice with specific numbers

### 4. Check Vercel Logs
Go to Vercel Deployment → Runtime Logs:
- Look for the log messages above
- Verify no errors related to API keys

## Troubleshooting

### Issue: "Experiencing technical difficulties"
**Possible causes:**
- Neither API key is set in environment variables
- Both APIs are failing (network issue)
- Grok API key is invalid

**Solution:**
1. Verify both keys are in Vercel environment variables
2. Check Vercel logs for specific error messages
3. Test Grok API key manually:
   ```bash
   curl https://api.x.ai/v1/chat/completions \
     -H "Authorization: Bearer YOUR_GROK_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"grok-beta","messages":[{"role":"user","content":"Hello"}]}'
   ```

### Issue: Only getting generic responses
**Possible cause:** User data not being passed correctly

**Solution:**
Check that the chatbot is receiving:
- User's monthly income
- Category budgets and spending
- Recent transactions
- Verify `userContext` is populated in the API call

### Issue: Slow responses
**Possible cause:** Gemini failing and waiting for timeout before Grok fallback

**Solution:**
- This is expected behavior on first Gemini failure
- Subsequent requests will be faster
- Consider adjusting timeout values if needed

## API Key Security

⚠️ **IMPORTANT**: Never commit API keys to git!

- `.env` file is in `.gitignore` ✅
- API keys only stored in Vercel environment variables ✅
- Code only references `process.env.GROK_API_KEY` ✅

## Benefits of Dual AI Setup

1. **Reliability**: If one provider has downtime, the other takes over
2. **Cost optimization**: Can use cheaper provider as fallback
3. **Performance**: Can route based on model capabilities
4. **Testing**: Easy to compare responses from different models

## Next Steps

After setting up the Grok API key:
1. ✅ Add GROK_API_KEY to Vercel
2. ✅ Redeploy the application
3. ✅ Test the chatbot with financial queries
4. ✅ Monitor Vercel logs for any errors
5. ✅ Verify fallback behavior works correctly

## Support

If you encounter issues:
1. Check Vercel Runtime Logs
2. Look for console.log messages
3. Verify environment variables are set correctly
4. Test API keys independently
5. Check network connectivity to both APIs
