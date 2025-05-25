/**
 * Dummy Stripe Keys for Development
 * 
 * These dummy keys follow the format of real Stripe keys but are not valid.
 * They're provided for testing environment setup and error handling paths.
 * 
 * In a real implementation, you would replace these with actual Stripe test keys
 * obtained from your Stripe dashboard.
 */

module.exports = {
  // Publishable key - this would be exposed in the client-side code
  // Format: pk_test_[51 characters]
  STRIPE_PUBLISHABLE_KEY: 'pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWx',
  
  // Secret key - this should only be on the server-side and never exposed
  // Format: sk_test_[51 characters]
  STRIPE_SECRET_KEY: 'sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWx',
  
  // Webhook signing secret - used to verify webhook payloads
  // Format: whsec_[24 characters]
  STRIPE_WEBHOOK_SECRET: 'whsec_AbCdEfGhIjKlMnOpQrStUv'
};

/**
 * Usage example:
 * 
 * In development, to avoid errors related to missing or malformed keys:
 * 
 * const stripe = require('stripe')(
 *   process.env.NODE_ENV === 'production' 
 *     ? process.env.STRIPE_SECRET_KEY 
 *     : require('./dummy-stripe-keys').STRIPE_SECRET_KEY
 * );
 */
