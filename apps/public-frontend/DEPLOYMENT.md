# Production Deployment Guide

This guide outlines the steps to deploy the Rally Round AI public frontend to production environments.

## Prerequisites

- Node.js 18+ and pnpm installed on the deployment server
- A Supabase project set up for production
- A domain name configured for your application

## Environment Configuration

1. Set up the following environment variables in your hosting platform:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-production-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Enhanced cookie security for production
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME=sb-auth-token
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_LIFETIME=28800
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_SAME_SITE=strict
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_SECURE=true
NEXT_PUBLIC_COOKIE_DOMAIN=yourdomain.com

# API URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Deployment Steps

### 1. Build the Application

```bash
# Install dependencies
pnpm install

# Build the application
pnpm -F public-frontend build
```

### 2. Deploy to Hosting Platforms

#### Vercel

1. Connect your GitHub repository to Vercel
2. Set the root directory to `apps/public-frontend`
3. Set the build command to `pnpm build`
4. Set the output directory to `.next`
5. Configure environment variables in the Vercel dashboard
6. Deploy

#### Netlify

1. Connect your GitHub repository to Netlify
2. Set the base directory to `apps/public-frontend`
3. Set the build command to `pnpm build`
4. Set the publish directory to `.next`
5. Configure environment variables in the Netlify dashboard
6. Deploy

#### Docker Deployment

```bash
# Build the Docker image
docker build -t rally-round-frontend:latest -f apps/public-frontend/Dockerfile .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-production-supabase-url.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key \
  -e NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME=sb-auth-token \
  -e NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_LIFETIME=28800 \
  -e NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_SAME_SITE=strict \
  -e NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_SECURE=true \
  -e NEXT_PUBLIC_COOKIE_DOMAIN=yourdomain.com \
  rally-round-frontend:latest
```

## Post-Deployment Checks

After deploying, verify the following:

1. **Authentication Flow**: Test login, signup, and social authentication
2. **Protected Routes**: Verify that protected routes require authentication
3. **404 Handling**: Confirm that non-existent routes show the 404 page without redirect loops
4. **API Integration**: Check that API calls to Supabase are working correctly
5. **Cookie Security**: Verify that auth cookies are set with the correct security flags

## Troubleshooting

### Authentication Issues

- **Cookies Not Being Set**: Ensure the `NEXT_PUBLIC_COOKIE_DOMAIN` matches your production domain
- **Redirect Loops**: Check that the middleware is correctly identifying known routes
- **CORS Errors**: Verify that your Supabase project has the correct CORS configuration

### Build Failures

- **Type Errors**: Ensure all dependencies are compatible and types are correctly defined
- **ESM Compatibility**: Check for ESM compatibility issues with dependencies

## Monitoring and Maintenance

- Set up health checks to monitor the `/api/healthcheck` endpoint
- Configure logging to capture authentication errors
- Regularly update dependencies to address security vulnerabilities

## Rollback Procedure

If issues are detected after deployment:

1. Identify the last stable version
2. Roll back to that version using your hosting platform's rollback feature
3. Investigate and fix issues in a development environment before redeploying
