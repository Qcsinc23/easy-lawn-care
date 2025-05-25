import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma'; // Uses Prisma client

// IMPORTANT: Keep your Stripe secret key and webhook secret secure and out of version control.
// Use environment variables. Ensure they are set in your deployment environment.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Ensure required environment variables are set during initialization
if (!stripeSecretKey) {
  console.error('FATAL ERROR: STRIPE_SECRET_KEY environment variable is not set.');
  // Optionally throw an error to prevent the application from starting/running without it
  // throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
}
if (!webhookSecret) {
  console.error('FATAL ERROR: STRIPE_WEBHOOK_SECRET environment variable is not set.');
  // Optionally throw an error
  // throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set.');
}

// Initialize Stripe client only if the key is available
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

/**
 * @fileoverview Stripe Webhook handler API route.
 * Handles incoming webhook events from Stripe, verifies their authenticity using
 * the webhook signing secret, and processes relevant events like
 * 'checkout.session.completed' to update application state (e.g., create
 * booking records using Prisma).
 *
 * Security Note: Verifying the webhook signature is crucial to ensure requests
 * genuinely originate from Stripe and not a malicious third party.
 *
 * Idempotency Note: Webhook handlers should ideally be idempotent, meaning
 * processing the same event multiple times should not result in duplicate actions
 * (e.g., creating multiple bookings for the same payment). This implementation
 * relies on Prisma's unique constraints to handle duplicates, but
 * explicit checks could be added if needed.
 */
export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event;

  // Ensure Stripe client was initialized
  if (!stripe || !webhookSecret) {
    console.error('Stripe client or webhook secret is not available. Check environment variables.');
    return NextResponse.json({ error: 'Webhook configuration error.' }, { status: 500 });
  }

  try {
    // 1. Verify Webhook Signature
    if (!signature) {
      console.warn('Missing Stripe-Signature header.');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }
    // Use the verified webhookSecret from the top scope
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    // Log the specific error and return 400 for signature verification issues
    const errorMessage = err instanceof Error ? err.message : 'Unknown signature verification error';
    console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      
      // Extract metadata from the session
      const {
        userId: clerk_user_id,
        serviceId,
        addressId,
        date,
        time,
        price
      } = checkoutSession.metadata || {}

      // 2. Validate required metadata from the completed session
      // Ensure all necessary details passed from the create-checkout route are present.
      if (!clerk_user_id || !serviceId || !addressId || !date || !time || price === undefined) {
         // Log the session ID for easier debugging if metadata is missing
         console.error(`❌ Missing required metadata in checkout.session.completed event. Session ID: ${checkoutSession.id}. Metadata:`, checkoutSession.metadata);
         // Return error to Stripe to indicate processing failure - this will trigger retries
         return NextResponse.json({
           error: 'Missing required metadata for booking creation',
           sessionId: checkoutSession.id
         }, { status: 400 });
      }


        // 3. Store booking details in database using Prisma
        console.log(`Attempting to create booking for user ${clerk_user_id}, session ${checkoutSession.id}`);
        
        try {
          const booking = await prisma.booking.create({
            data: {
              clerkUserId: clerk_user_id,
              serviceId: serviceId,
              addressId: addressId,
              bookingDate: new Date(date),
              // Handle time slot (morning/afternoon) - store as time for morning=08:00, afternoon=13:00
              bookingTime: time === 'morning' ? new Date('1970-01-01T08:00:00') : new Date('1970-01-01T13:00:00'),
              status: 'Scheduled',
              priceAtBooking: parseFloat(price),
              stripeCheckoutSessionId: checkoutSession.id
            },
            select: {
              id: true
            }
          });

          // Log success
          console.log(`✅ Booking created successfully. Booking ID: ${booking.id}, Session ID: ${checkoutSession.id}`);
          // TODO: Implement Phase 5: Send confirmation notification (e.g., email, SMS)
          // This could involve calling another service or queuing a job.
        } catch (error) {
          // Log detailed error if Prisma insertion fails
          console.error(`❌ Error creating booking record with Prisma for session ${checkoutSession.id}:`, error);
          // Consider returning a 500 error to Stripe to signal processing failure,
          // which might trigger retries depending on your Stripe webhook settings.
          // For now, we log and break to avoid infinite loops on persistent DB errors.
        }
      break; // End processing for 'checkout.session.completed'

    // TODO: Handle other relevant Stripe events if needed
    // Example: 'payment_intent.succeeded', 'payment_intent.payment_failed', 'customer.subscription.created', etc.
    // case 'payment_intent.succeeded':
    //   const paymentIntent = event.data.object;
    //   console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
    //   // Perform actions based on successful payment intent
    //   break;

    default:
      // Log unhandled event types for monitoring purposes
      console.warn(`🤷‍♀️ Unhandled Stripe event type: ${event.type}. Event ID: ${event.id}`);
  }

  // 4. Acknowledge receipt of the event to Stripe
  // Return a 200 OK response quickly to prevent Stripe from retrying the webhook.
  return NextResponse.json({ received: true });
}
