# Vercel Deployment Guide - Easy Lawn Care

This guide will walk you through deploying your Easy Lawn Care application to Vercel with all the necessary configurations.

## Prerequisites

Before deploying to Vercel, ensure you have:

1. **Prisma Accelerate Setup** - Your database is configured with Prisma Accelerate
2. **Clerk Account** - Production keys from [Clerk Dashboard](https://dashboard.clerk.com/)
3. **Stripe Account** - Production keys from [Stripe Dashboard](https://dashboard.stripe.com/)
4. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

## Step 1: Prepare Your Repository

1. **Commit all changes** to your Git repository
2. **Push to GitHub/GitLab/Bitbucket**
3. **Verify `.env.example`** is in your repository for reference

## Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect this as a Next.js project

## Step 3: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Required Environment Variables

```bash
# Database
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_ACCELERATE_API_KEY

# Authentication (Clerk) - Use PRODUCTION keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Payment Processing (Stripe) - Use PRODUCTION keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Feature Flags
USE_MOCK_STRIPE=false
```

### How to Set Environment Variables in Vercel:

1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in the sidebar
4. Add each variable with its value
5. Select "Production", "Preview", and "Development" for all variables

## Step 4: Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Step 5: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Step 6: Post-Deployment Configuration

### Update Clerk Settings

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Update your production environment settings:
   - **Allowed origins**: Add your Vercel domain
   - **Redirect URLs**: Update sign-in/sign-up redirect URLs

### Update Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Create a new webhook endpoint:
   - **URL**: `https://your-vercel-domain.vercel.app/api/stripe/webhook`
   - **Events**: Select relevant events (payment_intent.succeeded, etc.)
3. Copy the webhook secret and update in Vercel environment variables

### Test Your Deployment

1. Visit your deployed application
2. Test user registration/login
3. Test booking flow
4. Test payment processing (use Stripe test cards initially)

## Step 7: Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update Clerk and Stripe settings with your custom domain

## Important Notes

### Database Considerations

- Your app uses **Prisma Accelerate** which handles connection pooling automatically
- No additional database configuration needed for Vercel
- Ensure your Prisma Accelerate API key is valid and has sufficient quota

### Performance Optimizations

- The app is configured with `output: 'standalone'` for optimal Vercel performance
- Image optimization is enabled for WebP and AVIF formats
- Bundle optimization with SWC minification

### Security Headers

- CORS headers are configured for API routes
- Content Security Policy is set for SVG images
- Production environment variables should use `pk_live_` and `sk_live_` prefixes

### Monitoring

- Use Vercel's built-in analytics and monitoring
- Monitor function execution times (configured for 10s max duration)
- Set up error tracking if needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all environment variables are set
   - Ensure Prisma client is generating correctly
   - Verify all dependencies are in package.json

2. **Database Connection Issues**
   - Verify Prisma Accelerate API key is correct
   - Check DATABASE_URL format
   - Ensure database schema is up to date

3. **Authentication Issues**
   - Verify Clerk domain settings
   - Check redirect URLs match your deployment
   - Ensure production keys are being used

4. **Payment Issues**
   - Verify Stripe webhook URL is correct
   - Check webhook secret matches
   - Test with Stripe test cards first

### Useful Commands

```bash
# Build locally to test
npm run build

# Check for build issues
npm run lint

# Test production build locally
npm run start
```

## Environment Variables Checklist

- [ ] DATABASE_URL (Prisma Accelerate)
- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (Production)
- [ ] CLERK_SECRET_KEY (Production)
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (Production)
- [ ] STRIPE_SECRET_KEY (Production)
- [ ] STRIPE_WEBHOOK_SECRET (Production)
- [ ] USE_MOCK_STRIPE=false

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review Vercel documentation
3. Check Clerk and Stripe documentation
4. Review this project's other documentation in the `/docs` folder

---

**Next Steps**: After successful deployment, consider setting up monitoring, error tracking, and automated testing for your production environment.
