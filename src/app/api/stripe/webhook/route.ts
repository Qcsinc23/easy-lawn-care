import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
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

      // Check for all required fields including addressId
      if (!clerk_user_id || !serviceId || !addressId || !date || !time || price === undefined) {
         console.error('Missing required metadata in checkout session (userId, serviceId, addressId, date, time, price)')
         break
      }


        // Store booking in Supabase
      const { data: booking, error } = await supabaseAdmin.from('bookings').insert({
        clerk_user_id,
        service_id: serviceId,
        address_id: addressId,
        booking_date: date,
        booking_time_slot: time,
        status: 'Scheduled',
        total_price: parseFloat(price || '0'), // Ensure price is parsed as a number
        stripe_charge_id: checkoutSession.id // Use the session ID instead of payment_intent
      }).select().single()

      if (error) {
        console.error('Error creating booking record:', error)
      } else {
        console.log('Booking created:', booking.id)
        // TODO: Send confirmation notification (Phase 5)
      }
      break

    // Handle other event types...
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 })
}
