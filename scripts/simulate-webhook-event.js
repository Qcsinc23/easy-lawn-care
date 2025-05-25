// Simulate a Stripe webhook event to test the webhook route handler
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const fetch = require('node-fetch');

// Initialize Prisma client
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// Function to create a booking directly in the database
async function createTestBooking() {
  const clerkUserId = 'user_2wH7krcnLqH1wnVdFsWeoKFd6TP'; // The user ID from the logs
  
  try {
    // Query for an existing service
    const services = await prisma.service.findMany({
      take: 1,
    });
      
    if (!services || services.length === 0) {
      console.error('No services found in the database');
      return null;
    }
    
    // Query for an existing address
    const addresses = await prisma.address.findMany({
      where: {
        clerkUserId: clerkUserId
      },
      take: 1,
    });
      
    if (!addresses || addresses.length === 0) {
      console.error('No addresses found for the user');
      return null;
    }
    
    // Create a new booking
    const bookingData = {
      clerkUserId: clerkUserId,
      serviceId: services[0].id,
      addressId: addresses[0].id,
      bookingDate: new Date(),
      // Handle time slot properly - convert to DateTime like the webhook does
      bookingTime: new Date('1970-01-01T08:00:00'), // morning time
      status: 'Scheduled',
      priceAtBooking: 99.99,
      stripeCheckoutSessionId: `test_checkout_${Date.now()}`
    };
    
    console.log('Creating test booking with data:', bookingData);
    
    const booking = await prisma.booking.create({
      data: bookingData,
    });
      
    console.log('Test booking created successfully:', booking);
    
    // Print a success page URL that can be used for testing
    console.log('\n-----------------------------------------------------');
    console.log('SUCCESS PAGE TEST URL:');
    console.log(`http://localhost:3000/booking/success?session_id=${booking.stripeCheckoutSessionId}`);
    console.log('Copy and paste this URL in your browser to test the success page');
    console.log('-----------------------------------------------------\n');
    
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
}

// Function to simulate a checkout.session.completed event
async function simulateWebhookEvent() {
  try {
    const testBooking = await createTestBooking();
    
    if (!testBooking) {
      console.error('Failed to create test booking. Cannot proceed with webhook simulation.');
      return;
    }
    
    console.log('Test booking created. Check your dashboard to see if it appears.');
    console.log(`You can navigate to http://localhost:3000/dashboard to view your bookings.`);
  } catch (error) {
    console.error('Error during webhook simulation:', error);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

// Run the simulation
simulateWebhookEvent().catch(console.error);