import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * @fileoverview Stripe.js client initialization utility.
 * Provides a singleton promise for the Stripe.js instance, ensuring it's loaded only once.
 */

// Singleton promise to hold the Stripe instance.
let stripePromise: Promise<Stripe | null>;

/**
 * Gets the singleton Stripe.js instance.
 *
 * Initializes Stripe.js using the public key from environment variables
 * (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) the first time it's called.
 * Subsequent calls return the same promise, ensuring Stripe.js is loaded only once.
 *
 * If the publishable key environment variable is not set, it logs an error
 * and returns a promise that resolves to `null`.
 *
 * @returns {Promise<Stripe | null>} A promise that resolves to the initialized Stripe object, or null if initialization failed (e.g., missing key).
 */
export const getStripe = (): Promise<Stripe | null> => {
  // Check if the promise already exists
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    // Check if the Stripe publishable key is available in environment variables
    if (!publishableKey) {
      console.error('Error: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables.');
      // Set the promise to resolve to null if the key is missing
      stripePromise = Promise.resolve(null);
    } else {
      // Initialize Stripe.js and store the promise
      stripePromise = loadStripe(publishableKey);
    }
  }
  // Return the existing or newly created promise
  return stripePromise;
};
