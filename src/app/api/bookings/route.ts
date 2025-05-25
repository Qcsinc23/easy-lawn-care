import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { syncUserProfileWithPrisma } from '@/lib/user-profile';

/**
 * @fileoverview API routes for booking management
 * Handles fetching user bookings and updating booking status
 * Replaces direct Supabase client calls with secure server-side operations
 */

/**
 * GET /api/bookings
 * Fetch all bookings for the authenticated user
 */
export async function GET() {
  try {
    // Verify user is authenticated
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Ensure user profile exists
    await syncUserProfileWithPrisma();

    // Fetch bookings with related service details
    const bookings = await prisma.booking.findMany({
      where: {
        clerkUserId: user.id
      },
      include: {
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

    return NextResponse.json({ bookings });
    
  } catch (error: unknown) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', details: error instanceof Error ? error.message : 'Unknown error' },
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
