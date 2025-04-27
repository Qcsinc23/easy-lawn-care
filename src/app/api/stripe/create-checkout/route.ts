import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';

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

// Ensure Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    
    // Assessment data is optional but must be valid if provided
    if (assessment && typeof assessment !== 'object') {
      console.warn('Invalid assessment data provided:', assessment);
      return NextResponse.json({ error: 'Invalid assessment data format.' }, { status: 400 });
    }

    // 3. Prepare Stripe session data
    // Price is received from the frontend (in dollars), convert to cents for Stripe
    const calculatedAmount = Math.round(price * 100);

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                // Consider making the product name more specific if you offer different core services
                name: 'Lawn Care Service Booking',
                description: `Service scheduled for ${date} at ${time}`, // Slightly clearer description
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
        // during webhook processing (e.g., in the webhook handler to update booking status).
        metadata: {
          userId: user.id, // Clerk user ID
          serviceId,       // Your application's service identifier
          addressId,       // Your application's address identifier
          date,            // Scheduled date
          time,            // Scheduled time
          price: price.toString(), // Store original price (in dollars) as a string
          ...(assessment && { assessment: JSON.stringify(assessment) }), // Include assessment data if available
        },
      } // Removed unnecessary type assertion 'as Stripe.Checkout.SessionCreateParams' as the object should match
    );

    // 4. Return the session ID
    console.log(`Stripe Checkout session created for user ${user.id}: ${session.id}`);
    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    // Log the detailed error server-side
    console.error('Error creating Stripe checkout session:', error);

    // Return a generic error response to the client
    // Avoid exposing detailed Stripe errors or internal logic.
    return NextResponse.json(
      { error: 'Failed to initiate payment. Please try again later.' },
      { status: 500 }
    );
  }
}

// --- Removed old calculateServicePrice function ---
// Price calculation is now expected to happen on the client-side before calling this API.

// Remove the old calculateServicePrice function as price is now passed from frontend
// function calculateServicePrice(serviceId: string, lawnSize: number) {
//   // Logic to calculate price based on service type and lawn size
//   const basePrice = 50 // Base price in cents
//   const sizeMultiplier = lawnSize / 1000 // Price per 1000 sq ft
//   return Math.round(basePrice * sizeMultiplier * 100) // Convert to cents
// }
