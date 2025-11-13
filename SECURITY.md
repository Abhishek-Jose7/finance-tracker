# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of FinAI seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

Please do not create a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send details to: [Your security contact email]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- We will acknowledge receipt within 48 hours
- We will provide an initial assessment within 5 business days
- We will work on a fix and keep you updated

### 4. Disclosure

- We will coordinate disclosure with you
- Credit will be given to reporters (if desired)
- We will publish a security advisory after the fix

## Security Best Practices

### For Users

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique API keys
   - Rotate keys regularly

2. **Dependencies**
   - Keep dependencies updated
   - Run `npm audit` regularly
   - Review security advisories

3. **Deployment**
   - Use HTTPS in production
   - Implement rate limiting
   - Add authentication for sensitive data
   - Regular security audits

### For Contributors

1. **Code Review**
   - Review code for security issues
   - Validate all user inputs
   - Use parameterized queries (when adding DB)
   - Sanitize outputs

2. **API Keys**
   - Never hardcode API keys
   - Use environment variables
   - Implement key rotation

3. **Authentication**
   - Use secure authentication methods
   - Implement proper session management
   - Follow OAuth best practices (when adding auth)

## Known Security Considerations

### Current Implementation

1. **No Authentication**: The current version does not include user authentication. For production use, implement:
   - User authentication (NextAuth.js, Clerk, etc.)
   - Session management
   - Protected routes

2. **Client-Side Storage**: Currently uses localStorage for:
   - Onboarding status
   - User preferences
   
   For production:
   - Implement server-side storage
   - Use secure cookies for sensitive data
   - Add database for persistence

3. **API Keys**: Gemini API key is server-side only (Next.js Server Actions), which is secure. However:
   - Implement rate limiting
   - Add usage monitoring
   - Consider adding user quotas

4. **Data Privacy**: 
   - Currently no personal data is stored persistently
   - AI queries may contain financial information
   - Review Google Gemini's data usage policy

## Security Checklist for Production

Before deploying to production, ensure:

- [ ] Environment variables are set securely
- [ ] HTTPS is enabled
- [ ] Authentication is implemented
- [ ] Rate limiting is configured
- [ ] Input validation is thorough
- [ ] Dependencies are up to date
- [ ] Security headers are configured
- [ ] CORS is properly configured
- [ ] Monitoring and logging are set up
- [ ] Regular security audits are scheduled

## Security Headers

Add these to your `next.config.mjs` for production:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## Third-Party Dependencies

We use the following third-party services:

1. **Google Gemini AI**: For AI features
   - Review: [Google AI Terms](https://ai.google.dev/terms)
   - Data is processed according to Google's policies

## Updates and Patches

- Security updates will be released as soon as possible
- Users will be notified via GitHub releases
- Critical updates will be clearly marked

## Contact

For security concerns: [Your contact information]

## Acknowledgments

We appreciate responsible disclosure and will credit security researchers who help improve FinAI's security.
