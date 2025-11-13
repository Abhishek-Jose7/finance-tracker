# Troubleshooting Guide

Common issues and their solutions for FinAI.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [AI/API Issues](#aiapi-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### Error: "Cannot find module 'next'"

**Symptoms:**
```
Error: Cannot find module 'next'
```

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Verify Next.js is installed
npm list next
```

### Error: "EACCES: permission denied"

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**Solution (Windows PowerShell):**
```bash
# Run as administrator or change npm directory
npm config set prefix $env:APPDATA\npm
```

### Error: Node version incompatibility

**Symptoms:**
```
error next@15.0.3: The engine "node" is incompatible
```

**Solution:**
```bash
# Check current version
node --version

# Update Node.js to 18+ from https://nodejs.org
# Or use nvm:
nvm install 18
nvm use 18
```

---

## Build Issues

### Error: "Module not found" during build

**Symptoms:**
```
Module not found: Can't resolve '@/components/...'
```

**Solution:**
```bash
# Verify tsconfig.json paths are correct
# Check that all imports use correct casing
# Restart TypeScript server in VS Code:
# Ctrl+Shift+P > TypeScript: Restart TS Server
```

### Error: TypeScript compilation errors

**Symptoms:**
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solution:**
```bash
# Run type check to see all errors
npx tsc --noEmit

# Common fixes:
# 1. Add missing type definitions
# 2. Check component prop types
# 3. Verify imports are correct

# If using VS Code, restart TS server
```

### Error: "Out of memory" during build

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed
```

**Solution:**
```bash
# Increase Node memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or add to package.json scripts:
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

### Error: Tailwind styles not applied

**Symptoms:**
- App runs but has no styling
- Console shows CSS errors

**Solution:**
```bash
# Verify tailwind.config.ts content paths
# Check globals.css has @tailwind directives
# Restart dev server
npm run dev

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## Runtime Issues

### Error: "Hydration failed"

**Symptoms:**
```
Error: Hydration failed because the initial UI does not match
```

**Common Causes & Solutions:**

1. **localStorage in component body:**
```tsx
// ❌ Wrong
const [data, setData] = useState(localStorage.getItem('key'))

// ✅ Correct
const [data, setData] = useState(null)
useEffect(() => {
  setData(localStorage.getItem('key'))
}, [])
```

2. **Different server/client rendering:**
```tsx
// Use suppressHydrationWarning for timestamps
<time suppressHydrationWarning>
  {new Date().toLocaleString()}
</time>
```

### Error: "Text content does not match"

**Symptoms:**
```
Warning: Text content did not match
```

**Solution:**
```tsx
// For dynamic content that differs server/client
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null
```

### Error: Infinite re-renders

**Symptoms:**
- Browser freezes
- Console shows repeated renders
- Memory usage spikes

**Solution:**
```tsx
// Check useEffect dependencies
useEffect(() => {
  // Add proper dependencies
}, [dependency1, dependency2])

// Avoid setting state that triggers effect
// Use useCallback for function dependencies
const handleClick = useCallback(() => {
  // handler code
}, [deps])
```

### Error: "Cannot read property of undefined"

**Symptoms:**
```
TypeError: Cannot read property 'X' of undefined
```

**Solution:**
```tsx
// Use optional chaining
const value = data?.property?.nested

// Provide default values
const items = data?.items || []

// Guard clauses
if (!data) return <Loading />
```

---

## AI/API Issues

### Error: "Invalid API key"

**Symptoms:**
```
Error: API key not valid
```

**Solution:**
1. Verify `.env` file exists in project root
2. Check `GEMINI_API_KEY` is set correctly
3. No spaces or quotes around the key
4. Restart development server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Error: API rate limit exceeded

**Symptoms:**
```
Error: 429 Too Many Requests
```

**Solution:**
- Wait a few minutes before trying again
- Check API quotas in Google AI Studio
- Implement request caching
- Add rate limiting to your app

### Error: AI responses are slow

**Symptoms:**
- Long wait times for AI features
- Timeouts in production

**Solution:**
1. **Check network:**
```bash
# Test API connectivity
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}' \
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

2. **Optimize prompts:**
- Keep prompts concise
- Reduce context length
- Use streaming responses

3. **Add loading states:**
```tsx
const [loading, setLoading] = useState(false)
// Show skeleton while loading
if (loading) return <Skeleton />
```

### Error: AI responses are incorrect

**Symptoms:**
- AI gives wrong information
- Responses don't match prompt

**Solution:**
1. Review prompt in `src/ai/flows/`
2. Add more specific instructions
3. Include examples in prompt
4. Adjust temperature/parameters

---

## Deployment Issues

### Vercel Deployment Failed

**Symptoms:**
```
Error: Build failed
```

**Solution:**
1. **Check build locally:**
```bash
npm run build
```

2. **Verify environment variables:**
- Go to Vercel dashboard
- Settings → Environment Variables
- Add `GEMINI_API_KEY`

3. **Check logs:**
- View deployment logs in Vercel
- Look for specific error messages

4. **Common fixes:**
```bash
# Update dependencies
npm update

# Clear cache
# In Vercel: Deployments → ... → Redeploy
```

### Docker Build Fails

**Symptoms:**
```
ERROR: failed to solve
```

**Solution:**
1. **Check Dockerfile syntax:**
```bash
# Lint Dockerfile
docker run --rm -i hadolint/hadolint < Dockerfile
```

2. **Build with cache disabled:**
```bash
docker build --no-cache -t finai-app .
```

3. **Check .dockerignore:**
```bash
# Ensure node_modules is ignored
cat .dockerignore
```

### Environment Variables Not Working

**Symptoms:**
- Variables undefined in production
- Features work locally but not deployed

**Solution:**

1. **Verify variable names:**
- Must start with `NEXT_PUBLIC_` for client-side
- Server-side variables don't need prefix

2. **Check deployment platform:**
```bash
# Vercel: Set in dashboard
# Docker: Pass with -e flag
docker run -e GEMINI_API_KEY=xxx finai-app

# Docker Compose: Use .env file
```

3. **Restart after changes:**
- Always redeploy after adding variables
- Restart containers for Docker

---

## Performance Issues

### Slow Page Load

**Symptoms:**
- Pages take long to load
- Poor Lighthouse scores

**Solution:**

1. **Enable production mode:**
```bash
npm run build
npm run start
```

2. **Optimize images:**
```tsx
// Use Next.js Image component
import Image from 'next/image'

<Image 
  src="/image.jpg" 
  width={500} 
  height={300}
  alt="Description"
/>
```

3. **Code splitting:**
```tsx
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />
})
```

4. **Check bundle size:**
```bash
npm run build
# Review output for large chunks
```

### High Memory Usage

**Symptoms:**
- App crashes with "out of memory"
- Slow performance over time

**Solution:**

1. **Check for memory leaks:**
```tsx
// Always cleanup in useEffect
useEffect(() => {
  const subscription = data.subscribe()
  
  return () => {
    subscription.unsubscribe() // Cleanup
  }
}, [])
```

2. **Optimize state management:**
- Don't store large objects in state
- Use pagination for lists
- Implement virtual scrolling

3. **Monitor with DevTools:**
- Open Chrome DevTools
- Performance tab → Record
- Check memory timeline

### Slow AI Responses

**Symptoms:**
- AI takes 10+ seconds to respond
- Timeout errors

**Solution:**

1. **Add streaming:**
```typescript
// Use streaming responses for faster perceived performance
// Update AI flows to use streaming
```

2. **Implement caching:**
```typescript
// Cache common responses
const cache = new Map()

async function getCachedResponse(prompt: string) {
  if (cache.has(prompt)) {
    return cache.get(prompt)
  }
  const response = await ai.generate(prompt)
  cache.set(prompt, response)
  return response
}
```

3. **Optimize prompts:**
- Reduce prompt length
- Remove unnecessary context
- Use more efficient models

---

## Browser-Specific Issues

### Safari Issues

**Problem:** Features work in Chrome but not Safari

**Solution:**
1. Check for unsupported APIs
2. Add polyfills if needed
3. Test with Safari's Responsive Design Mode

### Firefox Issues

**Problem:** Styling looks different in Firefox

**Solution:**
1. Check for vendor prefixes
2. Test with Firefox DevTools
3. Review Tailwind browser support

---

## Data & State Issues

### State Not Updating

**Symptoms:**
- UI doesn't reflect state changes
- Changes lost after refresh

**Solution:**

1. **Check state updates:**
```tsx
// ❌ Wrong - mutating state
items.push(newItem)

// ✅ Correct - new array
setItems([...items, newItem])
```

2. **Verify context provider:**
```tsx
// Ensure AppProvider wraps components
<AppProvider>
  <YourComponent />
</AppProvider>
```

### LocalStorage Data Lost

**Symptoms:**
- Onboarding resets
- Settings not persisting

**Solution:**
```tsx
// Check localStorage is available
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value')
}

// Error handling
try {
  const data = localStorage.getItem('key')
} catch (error) {
  console.error('localStorage not available:', error)
}
```

---

## Getting Additional Help

If your issue isn't listed here:

1. **Check existing issues:**
   - GitHub Issues tab
   - Search for similar problems

2. **Enable verbose logging:**
```bash
# Run with debug mode
DEBUG=* npm run dev
```

3. **Collect information:**
   - Node version: `node --version`
   - npm version: `npm --version`
   - OS and version
   - Browser and version
   - Error messages (full stack trace)
   - Steps to reproduce

4. **Create an issue:**
   - Use the issue template
   - Include all relevant information
   - Add screenshots if applicable

5. **Community resources:**
   - Next.js documentation
   - Tailwind CSS docs
   - Stack Overflow
   - Next.js Discord

---

## Preventive Measures

**Avoid common issues:**

✅ Keep dependencies updated
✅ Use TypeScript for type safety
✅ Test in multiple browsers
✅ Implement error boundaries
✅ Add proper error handling
✅ Use ESLint and Prettier
✅ Write tests for critical features
✅ Monitor production errors
✅ Regular backups of data
✅ Document custom changes

---

**Still need help?** Create a detailed issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages and logs
