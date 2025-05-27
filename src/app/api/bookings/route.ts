import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { syncUserProfileWithPrisma } from '@/lib/user-profile';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
// Reverting to direct import, will use 'any' for map parameter if TS errors persist
import type { Booking } from '@prisma/client'; 

/**
 * @fileoverview API routes for booking management
 * Handles fetching user bookings and updating booking status
 * Includes enhanced error handling for database connection issues
 */

/**
 * Check if required environment variables are configured
 * @returns Object containing environment status and error message if applicable
 */
function checkEnvironmentConfig() {
  const missingVars = [];
  
  if (!process.env.DATABASE_URL) missingVars.push('DATABASE_URL');
  if (!process.env.CLERK_SECRET_KEY) missingVars.push('CLERK_SECRET_KEY');
  
  const isConfigValid = missingVars.length === 0;
  
  return {
    isValid: isConfigValid,
    message: isConfigValid ? 'Environment configured properly' : 
      `Missing required environment variables: ${missingVars.join(', ')}. Please configure these in your Vercel deployment settings.`
  };
}

/**
 * GET /api/bookings
 * Fetch all bookings for the authenticated user
 * Includes enhanced error handling for database connection issues
 */
export async function GET() {
  // Check environment configuration first
  const envConfig = checkEnvironmentConfig();
  if (!envConfig.isValid) {
    console.error(`Environment configuration error: ${envConfig.message}`);
    return NextResponse.json(
      { 
        error: 'Server configuration error', 
        message: 'The server is missing required configuration. Please contact the administrator.',
        details: process.env.NODE_ENV === 'development' ? envConfig.message : undefined
      },
      { status: 500 }
    );
  }
  
  try {
    // Verify user is authenticated
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // Ensure user profile exists
      await syncUserProfileWithPrisma();

      // Fetch bookings with related service details
      const bookings = await prisma.booking.findMany({
        where: {
          clerkUserId: user.id
        },
        include: { // Re-add include here
          service: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          bookingDate: 'desc'
        }
      });

      // Convert priceAtBooking from Decimal to number for frontend compatibility
      // Using 'any' for booking parameter type to bypass persistent TS errors for now
      const bookingsWithNumericPrice = bookings.map((booking: any) => ({
        ...booking,
        // Ensure priceAtBooking is treated as a number after parsing.
        // It might be string if it was a Decimal from Prisma.
        priceAtBooking: booking.priceAtBooking ? parseFloat(String(booking.priceAtBooking)) : null,
      }));

      return NextResponse.json({ bookings: bookingsWithNumericPrice });
    } catch (dbError) {
      // Handle database-specific errors
      console.error('Database operation error:', dbError);
      
      if (dbError instanceof PrismaClientInitializationError) {
        return NextResponse.json(
          { 
            error: 'Database connection error', 
            message: 'Unable to connect to the database. The server may be misconfigured.',
            details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
          },
          { status: 500 }
        );
      }
      
      throw dbError; // Re-throw for general error handling
    }
    
  } catch (error: unknown) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch bookings', 
        message: 'An error occurred while retrieving your bookings. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/bookings
 * Update booking status (e.g., cancel a booking)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingId, status } = body;

    // Validate required fields
    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId and status' },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Update booking status, ensuring user owns the booking
    const updatedBooking = await prisma.booking.updateMany({
      where: {
        id: bookingId,
        clerkUserId: user.id // Ensure user owns this booking
      },
      data: {
        status: status
      }
    });

    if (updatedBooking.count === 0) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking status updated successfully'
    });
    
  } catch (error: unknown) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
