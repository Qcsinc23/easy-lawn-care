'use client'

import { useState } from 'react'
// Removed unused useRouter import
import { getStripe, dollarsToCents, meetsStripeMinimum } from '@/lib/stripe';
import { Button } from '@/components/ui/button';

/**
 * Props for the CheckoutButton component.
 */
interface CheckoutButtonProps {
  /** The ID of the service being booked. */
  serviceId: string;
  /** The ID of the user's address for the service. */
  addressId: string;
  /** The selected date for the service (e.g., 'YYYY-MM-DD'). */
  date: string;
  /** The selected time slot for the service (e.g., 'HH:MM'). */
  time: string;
  /** The price of the service in the smallest currency unit (e.g., cents). */
  price: number;
  /** Optional flag to disable the button. */
  disabled?: boolean;
  /** Optional assessment data for custom services. */
  assessment?: {
    lawnSize: "small" | "medium" | "large" | "extra-large";
    lawnCondition: "good" | "fair" | "poor";
    hasObstacles: boolean;
    obstacleDetails?: string;
    hasSpecialRequests: boolean;
    specialRequestDetails?: string;
    hasExistingIrrigationSystem: boolean;
  };
}

/**
 * Renders a button that initiates the Stripe checkout process for booking a service.
 * It sends booking details to the backend to create a Stripe Checkout session,
 * redirects the user to Stripe's hosted checkout page, and displays errors if they occur.
 *
 * @param {CheckoutButtonProps} props - The component props.
 */
export default function CheckoutButton({
  serviceId,
  addressId,
  date,
  time,
  price,
  disabled,
  assessment,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for user-facing errors

  /**
   * Handles the button click event to initiate the Stripe checkout process.
   * Sends booking details to the `/api/stripe/create-checkout` endpoint,
   * retrieves the Stripe session ID, redirects the user to Stripe Checkout,
   * and sets an error message state if any step fails.
   */
  const handleCheckout = async () => {
    if (disabled) return; // Prevent action if button is disabled
    setError(null); // Clear previous errors
    setLoading(true);
    
    // Make sure price meets Stripe's minimum requirement
    if (!meetsStripeMinimum(price)) {
      setError(`Payment amount must be at least $0.50 USD (${price} cents provided).`);
      setLoading(false);
      return;
    }
    
    console.log('Initiating checkout with:', { serviceId, addressId, date, time, price });

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
          assessment, // Include assessment data if available
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('Checkout API error response:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          // Ignore if response body is not JSON or empty
        }
        throw new Error(errorMessage);
      }

      const { sessionId } = await response.json();
      console.log('Stripe session ID received:', sessionId);

      if (!sessionId) {
        throw new Error('Failed to retrieve Stripe session ID.');
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }

      // Redirect to Stripe Checkout
      console.log('Redirecting to Stripe Checkout...');
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        // This point is typically not reached because redirectToCheckout navigates away.
        // However, handle potential errors during the redirect initiation.
        console.error('Stripe redirection error:', stripeError);
        // Optionally, display an error message to the user here.
      }
    } catch (error: unknown) {
      console.error('Error during checkout process:', error);
      
      // Safely handle errors with proper type checking
      if (error instanceof Error) {
        // Check if Stripe.js loaded
        if (error.message === 'Stripe.js failed to load.') {
          setError('Payment system initialization failed. Please ensure you have a stable internet connection and try again.');
        } 
        // Check for environment variable issues
        else if (error.message.includes('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')) {
          setError('Payment system configuration error. Please contact support.');
          console.error('Missing Stripe publishable key in environment variables');
        }
        // Handle other Error instances
        else {
          setError(error.message);
        }
      } else {
        // Handle non-Error objects
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={loading || disabled} // Disable if loading or explicitly disabled via props
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles and full width
        aria-busy={loading} // Indicate loading state for accessibility
        aria-label="Book and pay for the selected service"
      >
        {loading ? 'Processing...' : 'Book & Pay Now'}
      </Button>
      {error && (
        <p className="text-red-600 text-sm text-center" role="alert">
          Error: {error}
        </p>
      )}
    </div>
  )
}
