import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';
import mockStripe from '@/lib/mock-stripe';

/**
 * @fileoverview API route handler for creating Stripe Checkout sessions.
 * This server-side route receives booking details from the client,
 * validates the user's authentication status, checks for required input data,
 * and initiates a payment session with Stripe using the provided details.
 *
 * Required Environment Variables:
 * - STRIPE_SECRET_KEY: Your Stripe secret API key.
 * - NEXT_PUBLIC_APP_URL: The base URL of your application for constructing redirect URLs.
 */

// Initialize Stripe client
let stripeClient: any;

// Function to initialize Stripe client - separated for better error handling
const initializeStripe = () => {
  // Check if we should use real Stripe
  if (process.env.USE_MOCK_STRIPE !== 'true') {
    try {
      // Get Stripe API key
      const apiKey = process.env.STRIPE_SECRET_KEY;
      
      if (!apiKey) {
        throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
      }
      
      if (!apiKey.startsWith('sk_')) {
        throw new Error('Invalid STRIPE_SECRET_KEY format.');
      }
      
      // Initialize real Stripe
      const stripe = new Stripe(apiKey);
      console.log('Using REAL Stripe implementation with key type:', 
        apiKey.startsWith('sk_test_') ? 'TEST KEY' : 
        apiKey.startsWith('sk_live_') ? 'LIVE KEY' : 'UNKNOWN KEY FORMAT');
      return stripe;
    } catch (error) {
      console.error('Failed to initialize real Stripe:', error);
      throw error; // Re-throw to be caught by caller
    }
  } else {
    // Use mock implementation when explicitly enabled via environment variable
    console.warn('Using MOCK Stripe implementation. No real payments will be processed.');
    return mockStripe;
  }
};

// Try to initialize Stripe - will throw an error if it fails
try {
  stripeClient = initializeStripe();
} catch (error) {
  console.error('Stripe initialization failed, payments will not work:', error);
}

// Ensure the base URL is available for redirects
if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set.');
}
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

/**
 * Handles POST requests to create a Stripe Checkout session.
 * 1. Authenticates the user using Clerk.
 * 2. Validates the incoming request body for required booking details.
 * 3. Creates a Stripe Checkout session with line items based on the provided `price`
 *    (assuming price calculation is done client-side) and metadata for webhook processing.
 * 4. Returns the session ID to the client for redirection to Stripe's hosted checkout page.
 *
 * @param {Request} req - The incoming Next.js request object.
 * @returns {NextResponse} A JSON response containing the Stripe session ID or an appropriate error message with status code.
 */
export async function POST(req: Request) {
  try {
    // Confirm Stripe is initialized
    if (!stripeClient) {
      return NextResponse.json(
        { error: 'Payment processor is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // 1. Authenticate the user
    const user = await currentUser();
    if (!user) {
      console.warn('Checkout attempt by unauthenticated user.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate input data
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { serviceId, addressId, date, time, price, assessment } = body;

    if (!serviceId || !addressId || !date || !time || typeof price !== 'number' || price <= 0) {
      console.warn('Checkout attempt with missing or invalid data:', body);
      return NextResponse.json({ error: 'Missing or invalid booking details.' }, { status: 400 });
    }
    
    // Enforce Stripe's minimum payment amount (50 cents)
    const MINIMUM_PAYMENT_AMOUNT = 50; // 50 cents minimum for Stripe
    if (price < MINIMUM_PAYMENT_AMOUNT) {
      console.warn(`Payment amount too small: ${price} cents. Minimum required: ${MINIMUM_PAYMENT_AMOUNT} cents`);
      return NextResponse.json({ 
        error: `Payment amount must be at least $${MINIMUM_PAYMENT_AMOUNT/100} USD.` 
      }, { status: 400 });
    }
    
    // Assessment data is optional but must be valid if provided
    if (assessment && typeof assessment !== 'object') {
      console.warn('Invalid assessment data provided:', assessment);
      return NextResponse.json({ error: 'Invalid assessment data format.' }, { status: 400 });
    }

    // 3. Prepare Stripe session data
    // Price is received from the frontend, assumed to be in cents based on frontend component comment.
    const calculatedAmount = Math.round(price); // Assuming price is already in cents

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Lawn Care Service',
                description: `Service scheduled for ${date} at ${time}`,
              },
              unit_amount: calculatedAmount, // Amount in cents
            },
            quantity: 1,
          },
        ],
        // Pre-fill customer email if available from Clerk user data
        customer_email: user.emailAddresses?.[0]?.emailAddress ?? undefined,
        mode: 'payment',
        // Construct redirect URLs using the environment variable
        success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/booking`,
        // Metadata is crucial for linking the Stripe payment back to your application's data
        metadata: {
          userId: user.id, // Clerk user ID
          serviceId,       // Your application's service identifier
          addressId,       // Your application's address identifier
          date,            // Scheduled date
          time,            // Scheduled time
          price: price.toString(), // Store original price (in cents) as a string
          ...(assessment && { assessment: JSON.stringify(assessment) }), // Include assessment data if available
        },
      });

      // 4. Return the session ID
      console.log(`Stripe Checkout session created for user ${user.id}: ${session.id}`);
      return NextResponse.json({ sessionId: session.id });
    } catch (stripeError: any) {
      // Handle Stripe-specific errors with more detailed logging
      console.error('Stripe error creating checkout session:', stripeError);
      
      let errorMessage = 'Payment processing error. Please try again later.';
      let statusCode = 500;
      
      // Map common Stripe errors to user-friendly messages
      if (stripeError.type === 'StripeCardError') {
        errorMessage = 'Your card was declined. Please try a different payment method.';
        statusCode = 400;
      } else if (stripeError.type === 'StripeInvalidRequestError') {
        errorMessage = 'Invalid payment request. Please check your information and try again.';
        statusCode = 400;
      } else if (stripeError.type === 'StripeAuthenticationError') {
        // Don't expose API key issues to the client
        console.error('Stripe API key authentication error:', stripeError.message);
        errorMessage = 'Payment system configuration error. Please contact support.';
        statusCode = 500;
      } else if (stripeError.type === 'StripeAPIError') {
        errorMessage = 'Stripe API error. Please try again later.';
        statusCode = 503;
      } else if (stripeError.type === 'StripeConnectionError') {
        errorMessage = 'Could not connect to payment processor. Please try again later.';
        statusCode = 503;
      } else if (stripeError.type === 'StripeRateLimitError') {
        errorMessage = 'Too many payment requests. Please try again in a few minutes.';
        statusCode = 429;
      }
      
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
  } catch (error) {
    // Log the detailed error server-side
    console.error('Unexpected error creating checkout session:', error);
    
    // Return a generic error response to the client
    return NextResponse.json(
      { error: 'Failed to initiate payment. Please try again later.' },
      { status: 500 }
    );
  }
}
