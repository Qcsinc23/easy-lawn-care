# Local Webhook Testing Setup

## Using ngrok for Local Webhook Testing

1. **Install ngrok**: Download from https://ngrok.com/

2. **Start your development server**:
   ```bash
   npm run dev
   ```

3. **Start ngrok tunnel**:
   ```bash
   ngrok http 3000
   ```

4. **Configure Stripe webhook**:
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://your-ngrok-url.ngrok.io/api/stripe/webhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret

5. **Update environment variables**:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_real_webhook_secret_from_stripe
   ```

## For Production Deployment

When deploying to production:
- Use your production domain for webhook URL
- Configure webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
- Use live Stripe keys for production environment