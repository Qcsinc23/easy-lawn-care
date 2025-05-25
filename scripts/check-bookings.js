// Database check script to directly query bookings using Prisma
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const checkBookings = async () => {
  try {
    // Query recent bookings
    console.log('Querying recent bookings...');
    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        clerkUserId: true,
        bookingDate: true,
        bookingTime: true,
        status: true,
        priceAtBooking: true,
        stripeCheckoutSessionId: true,
        createdAt: true,
        service: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    if (bookings.length === 0) {
      console.log('No bookings found in the database.');
    } else {
      console.log(`Found ${bookings.length} recent bookings:\n`);
      
      bookings.forEach(booking => {
        console.log(`
Booking ID: ${booking.id}
User ID: ${booking.clerkUserId}
Service: ${booking.service?.name || 'Unknown service'}
Date: ${new Date(booking.bookingDate).toLocaleDateString()}
Time: ${booking.bookingTime === 'morning' ? 'Morning (8 AM - 12 PM)' : 'Afternoon (1 PM - 5 PM)'}
Status: ${booking.status}
Price: $${booking.priceAtBooking.toFixed(2)}
Stripe ID: ${booking.stripeCheckoutSessionId || 'None'}
Created: ${new Date(booking.createdAt).toLocaleString()}
-------------------------------------------`);
      });
    }
    
  } catch (error) {
    console.error('Error querying bookings:', error);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};

checkBookings();