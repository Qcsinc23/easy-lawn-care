# Stripe Integration Documentation

This document outlines the Stripe integration for Easy Lawn Care.

## API Keys

- **Publishable Key**: `pk_live_51NfrYJAATeGvNFzMgC2a5hnCGkWlOZZbAfwUaZBFVcyBL94SVJNoPmMkIZya1mxOpWdjBXHmA7qCwbkVGp4i7Zdr00zVM7mbMS`

NOTE: The Secret Key should be stored securely in environment variables and never exposed in code repositories or client-side code.

## Implementation Details

The application uses Stripe Checkout for processing payments:

1. Users select services and provide lawn details
2. API creates a Stripe Checkout session
3. Users are redirected to Stripe's hosted checkout page
4. After payment, users return to the success page
5. Webhooks process the payment confirmation

## Testing

For testing, use Stripe's test cards:
- Success: 4242 4242 4242 4242
- Requires Authentication: 4000 0025 0000 3155

## Webhooks

Webhook endpoints process events from Stripe:
- Payment success
- Payment failure
- Refund processing
