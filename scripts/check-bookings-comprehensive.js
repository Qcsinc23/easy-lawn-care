// Comprehensive booking check script using Prisma
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const checkBookings = async () => {
  try {
    console.log('🔍 Querying recent bookings from database...\n');
    
    // Fetch most recent bookings with full relationship data
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        address: true,
        profile: true,
        bookingMedia: true
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
    
    if (!bookings || bookings.length === 0) {
      console.log('📭 No bookings found in the database.');
      return;
    }
    
    console.log(`📋 Found ${bookings.length} recent booking(s):\n`);
    
    bookings.forEach((booking, index) => {
      const serviceName = booking.service ? booking.service.name : 'Unknown service';
      const servicePrice = booking.service ? booking.service.price : null;
      const addressStr = booking.address ? 
        `${booking.address.streetAddress}, ${booking.address.area}, ${booking.address.city}` : 
        'Unknown address';
      
      console.log(`--- Booking ${index + 1} ---`);
      console.log(`📌 ID: ${booking.id}`);
      console.log(`👤 User ID: ${booking.clerkUserId}`);
      console.log(`🏠 Service: ${serviceName}${servicePrice ? ` ($${servicePrice})` : ''}`);
      console.log(`📍 Address: ${addressStr}`);
      console.log(`📅 Date: ${new Date(booking.bookingDate).toLocaleDateString()}`);
      console.log(`⏰ Time: ${booking.bookingTime}`);
      console.log(`📊 Status: ${booking.status}`);
      console.log(`💰 Price at Booking: $${booking.priceAtBooking ? booking.priceAtBooking.toFixed(2) : 'N/A'}`);
      console.log(`💳 Stripe Session ID: ${booking.stripeCheckoutSessionId || 'None'}`);
      console.log(`📸 Media Files: ${booking.bookingMedia.length}`);
      console.log(`📝 Notes: ${booking.customerNotes || 'None'}`);
      console.log(`🕐 Created: ${new Date(booking.createdAt).toLocaleString()}`);
      console.log(`🔄 Updated: ${new Date(booking.updatedAt).toLocaleString()}`);
      console.log('');
    });

    // Additional statistics
    console.log('\n📊 Summary Statistics:');
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    const totalRevenue = bookings.reduce((sum, booking) => 
      sum + (booking.priceAtBooking ? parseFloat(booking.priceAtBooking) : 0), 0);
    console.log(`💵 Total Revenue (recent bookings): $${totalRevenue.toFixed(2)}\n`);
    
  } catch (error) {
    console.error('❌ Error querying bookings:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};

// Run the check
checkBookings();