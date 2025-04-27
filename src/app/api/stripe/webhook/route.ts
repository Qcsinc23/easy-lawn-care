import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseClient'; // Uses service_role key for admin access

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
 * booking records in Supabase).
 *
 * Security Note: Verifying the webhook signature is crucial to ensure requests
 * genuinely originate from Stripe and not a malicious third party.
 *
 * Idempotency Note: Webhook handlers should ideally be idempotent, meaning
 * processing the same event multiple times should not result in duplicate actions
 * (e.g., creating multiple bookings for the same payment). This implementation
 * relies on Supabase potentially handling duplicates based on constraints, but
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
  } catch (err: any) {
    // Log the specific error and return 400 for signature verification issues
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
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
         // Break prevents further processing for this event, Stripe will retry if it doesn't get a 2xx response.
         // Consider if a 500 response is more appropriate if this indicates a server-side issue.
         break;
      }


        // 3. Store booking details in Supabase database
        // Use supabaseAdmin client which has elevated privileges for backend operations.
        console.log(`Attempting to create booking for user ${clerk_user_id}, session ${checkoutSession.id}`);
        const { data: booking, error } = await supabaseAdmin.from('bookings').insert({
          clerk_user_id,
          service_id: serviceId,
          address_id: addressId, // Include the address ID
          booking_date: date,
          booking_time_slot: time,
          status: 'Scheduled', // Initial status after successful payment
          total_price: parseFloat(price), // Parse price string to float. Assumes price is valid number string.
          // Store the Stripe Checkout Session ID for reference.
          // If you need the Payment Intent ID later (e.g., for refunds),
          // you might need to retrieve the session with expand: ['payment_intent']
          // or handle the 'payment_intent.succeeded' event separately.
          stripe_charge_id: checkoutSession.id
        }).select().single(); // Select the newly created record

      if (error) {
        // Log detailed error if Supabase insertion fails
        console.error(`❌ Error creating booking record in Supabase for session ${checkoutSession.id}:`, error);
        // Consider returning a 500 error to Stripe to signal processing failure,
        // which might trigger retries depending on your Stripe webhook settings.
        // For now, we log and break to avoid infinite loops on persistent DB errors.
      } else if (booking) {
        // Log success
        console.log(`✅ Booking created successfully. Booking ID: ${booking.id}, Session ID: ${checkoutSession.id}`);
        // TODO: Implement Phase 5: Send confirmation notification (e.g., email, SMS)
        // This could involve calling another service or queuing a job.
      } else {
        // Handle unexpected case where insert succeeded but no data returned
         console.warn(`Booking insert seemed successful for session ${checkoutSession.id}, but no booking data was returned.`);
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
