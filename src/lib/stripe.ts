import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * @fileoverview Stripe.js client initialization utility.
 * Provides a singleton promise for the Stripe.js instance, ensuring it's loaded only once.
 * Added improved validation and error handling.
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
 * If the publishable key environment variable is not set or invalid, it logs an error
 * and returns a promise that resolves to `null`.
 *
 * @returns {Promise<Stripe | null>} A promise that resolves to the initialized Stripe object, 
 *                                   or null if initialization failed (e.g., missing/invalid key).
 */
export const getStripe = (): Promise<Stripe | null> => {
  // Check if the promise already exists
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    // Check if the Stripe publishable key is available and valid
    if (!publishableKey) {
      console.error('Error: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables.');
      // Set the promise to resolve to null if the key is missing
      stripePromise = Promise.resolve(null);
    } else if (!publishableKey.startsWith('pk_')) {
      console.error('Error: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with "pk_". Current value is invalid.');
      stripePromise = Promise.resolve(null);
    } else {
      // Initialize Stripe.js and store the promise with error handling
      try {
        console.log(`Initializing Stripe using key type: ${publishableKey.startsWith('pk_test_') ? 'TEST KEY' : 'LIVE KEY'}`);
        stripePromise = loadStripe(publishableKey)
          .catch(error => {
            console.error('Error initializing Stripe:', error);
            return null;
          });
      } catch (error) {
        console.error('Unexpected error during Stripe initialization:', error);
        stripePromise = Promise.resolve(null);
      }
    }
  }
  // Return the existing or newly created promise
  return stripePromise;
};

/**
 * Utility function to convert dollars to cents for Stripe API.
 * Stripe requires amounts in the smallest currency unit (cents for USD).
 * 
 * @param {number} dollars - Amount in dollars
 * @returns {number} - Amount in cents
 */
export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};

/**
 * Utility function to check if an amount meets Stripe's minimum charge.
 * Stripe requires a minimum charge of 50 cents for transactions.
 * 
 * @param {number} cents - Amount in cents
 * @returns {boolean} - True if the amount meets or exceeds the minimum
 */
export const meetsStripeMinimum = (cents: number): boolean => {
  const STRIPE_MINIMUM_CENTS = 50;
  return cents >= STRIPE_MINIMUM_CENTS;
};
