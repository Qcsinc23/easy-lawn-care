import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { serviceId, addressId, date, time, price } = await req.json(); // Added addressId

    // Use the price passed from the frontend
    const calculatedAmount = Math.round(price * 100); // Convert dollars to cents

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Lawn Care Service',
                description: `Service on ${date} (${time})`, // Include time in description
              },
              unit_amount: calculatedAmount,
            },
            quantity: 1,
          },
        ],
        customer_email: user?.emailAddresses[0].emailAddress ?? null,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking`,
        metadata: {
          userId: user?.id,
          serviceId,
          addressId, // Include addressId in metadata
          date,
          time,
          price: price.toString(),
        },
      } as Stripe.Checkout.SessionCreateParams
    );

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}

// Remove the old calculateServicePrice function as price is now passed from frontend
// function calculateServicePrice(serviceId: string, lawnSize: number) {
//   // Logic to calculate price based on service type and lawn size
//   const basePrice = 50 // Base price in cents
//   const sizeMultiplier = lawnSize / 1000 // Price per 1000 sq ft
//   return Math.round(basePrice * sizeMultiplier * 100) // Convert to cents
// }
