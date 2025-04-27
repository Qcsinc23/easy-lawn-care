'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'

export default function CheckoutButton({
  serviceId,
  addressId,
  date,
  time,
  price,
  disabled,
}: {
  serviceId: string;
  addressId: string;
  date: string;
  time: string;
  price: number;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          addressId,
          date,
          time,
          price,
        }),
      });

      const { sessionId } = await response.json()
      const stripe = await getStripe()

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Error in checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" // Basic Tailwind classes
    >
      {loading ? 'Processing...' : 'Book & Pay Now'}
    </Button>
  )
}
