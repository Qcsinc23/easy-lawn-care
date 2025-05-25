/**
 * Mock Stripe implementation for development/testing environments
 * This file provides a drop-in replacement for the Stripe client when
 * real Stripe API keys are not available or should not be used (e.g., in development)
 */

// Create a mock session ID generator
const generateMockSessionId = () => `mock_sess_${Math.random().toString(36).substring(2, 15)}`;

// Mock Stripe checkout sessions implementation
const mockCheckoutSessions = {
  create: async (options: {
    payment_method_types: string[];
    line_items: Array<{
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
        };
        unit_amount: number;
      };
      quantity: number;
    }>;
    customer_email?: string;
    mode: string;
    success_url: string;
    cancel_url: string;
    metadata: Record<string, string>;
    client_reference_id?: string;
  }) => {
    console.log('[MOCK STRIPE] Creating checkout session with options:', options);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a mock session object
    return {
      id: generateMockSessionId(),
      url: options.success_url.replace('{CHECKOUT_SESSION_ID}', generateMockSessionId()),
      payment_status: 'unpaid',
      status: 'open',
      client_reference_id: options.client_reference_id || null,
      metadata: options.metadata,
      // Add other fields as needed by your application
    };
  }
};

// Main mock Stripe client object
const mockStripe = {
  checkout: {
    sessions: mockCheckoutSessions
  },
  // Add other Stripe APIs as needed
};

export default mockStripe;
