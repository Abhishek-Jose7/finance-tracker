# Deployment Guide

This document provides detailed instructions for deploying the FinAI application to various platforms.

## Table of Contents
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Railway Deployment](#railway-deployment)
- [Netlify Deployment](#netlify-deployment)

## Prerequisites

Before deploying, ensure you have:
1. A Google Gemini API key
2. All environment variables configured
3. Successfully built the application locally

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure project:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Set Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Docker Deployment

### Build and Run Locally

```bash
# Build the Docker image
docker build -t finai-app .

# Run the container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key finai-app
```

### Using Docker Compose

```bash
# Create .env file with your API key
echo "GEMINI_API_KEY=your_api_key" > .env

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Deploy to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag finai-app your-username/finai-app:latest

# Push to Docker Hub
docker push your-username/finai-app:latest
```

## AWS Deployment

### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your Git provider

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Set Environment Variables**
   - Add `GEMINI_API_KEY` in Amplify Console

4. **Deploy**
   - Click "Save and deploy"

### AWS ECS (Elastic Container Service)

1. **Push Docker image to ECR**
   ```bash
   aws ecr create-repository --repository-name finai-app
   
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   docker tag finai-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/finai-app:latest
   
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/finai-app:latest
   ```

2. **Create ECS Task Definition**
   - Set image URI
   - Configure environment variables
   - Set port mapping: 3000

3. **Create ECS Service**
   - Choose Fargate launch type
   - Configure load balancer
   - Deploy

## Railway Deployment

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure**
   - Railway auto-detects Next.js
   - Add environment variable: `GEMINI_API_KEY`

3. **Deploy**
   - Railway automatically deploys on push

## Netlify Deployment

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Configure netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy**
   ```bash
   # Login
   netlify login

   # Initialize
   netlify init

   # Deploy
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   - In Netlify dashboard: Site settings → Environment variables
   - Add `GEMINI_API_KEY`

## Environment Variables

All deployments require these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NODE_ENV` | Set to `production` | Auto |

## Post-Deployment Checklist

- [ ] Verify the application loads correctly
- [ ] Test AI features (assistant, recommendations)
- [ ] Check all pages are accessible
- [ ] Verify responsive design on mobile
- [ ] Test onboarding flow
- [ ] Monitor error logs
- [ ] Set up analytics (optional)
- [ ] Configure custom domain (optional)

## Troubleshooting

### Build Failures

**Issue**: Build fails with dependency errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue**: TypeScript errors during build
```bash
# Solution: Run type check locally first
npx tsc --noEmit
```

### Runtime Issues

**Issue**: AI features not working
- Verify `GEMINI_API_KEY` is set correctly
- Check API key has necessary permissions
- Review error logs for API rate limits

**Issue**: 404 errors on routes
- Ensure Next.js app router structure is correct
- Check that all page files export default components

### Performance Issues

- Enable Next.js caching in production
- Use CDN for static assets
- Implement image optimization
- Monitor bundle size

## Monitoring and Maintenance

### Vercel
- Built-in analytics and monitoring
- View logs in dashboard
- Set up notifications for deployment failures

### Docker
```bash
# View container logs
docker logs <container-id>

# Monitor resource usage
docker stats

# Health check
docker ps --filter "health=healthy"
```

### AWS
- Use CloudWatch for logs and metrics
- Set up alarms for errors
- Monitor ECS service health

## CI/CD Setup

The included GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:
- Runs linting and type checking
- Builds the application
- Deploys to Vercel on main branch

Required GitHub Secrets:
- `GEMINI_API_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Scaling Considerations

- **Serverless (Vercel/Netlify)**: Auto-scales, pay per invocation
- **Docker (AWS ECS)**: Configure auto-scaling policies
- **Load Balancing**: Add load balancer for high traffic
- **Database**: Currently uses local state, consider adding database for production
- **Caching**: Implement Redis for session/data caching

## Security Best Practices

1. Never commit `.env` files
2. Rotate API keys regularly
3. Use environment-specific keys
4. Enable HTTPS (auto on most platforms)
5. Implement rate limiting for AI endpoints
6. Add authentication for production use
7. Regular dependency updates

## Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Create an issue in the repository
- Contact platform support

## Next Steps

After successful deployment:
1. Set up custom domain
2. Configure analytics
3. Add authentication
4. Implement database
5. Set up monitoring alerts
6. Plan backup strategy
