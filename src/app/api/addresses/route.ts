import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { syncUserProfileWithPrisma } from '@/lib/user-profile';

/**
 * @fileoverview API routes for address management
 * Handles fetching, creating, updating, and deleting user addresses
 * Replaces direct Supabase client calls with secure server-side operations
 */

/**
 * GET /api/addresses
 * Fetch all addresses for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch user's addresses
    const addresses = await prisma.address.findMany({
      where: {
        clerkUserId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      addresses
    });
    
  } catch (error: any) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/addresses
 * Create a new address for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Ensure user profile exists before creating address
    await syncUserProfileWithPrisma();

    const body = await request.json();
    const {
      streetAddress,
      area,
      city,
      region,
      postalCode,
      country = 'Guyana'
    } = body;

    // Validate required fields
    if (!streetAddress || !area || !city || !region) {
      return NextResponse.json(
        { error: 'Missing required fields: streetAddress, area, city, region' },
        { status: 400 }
      );
    }

    // Create new address
    const address = await prisma.address.create({
      data: {
        clerkUserId: user.id,
        streetAddress,
        area,
        city,
        region,
        postalCode,
        country
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Address created successfully',
      address
    });
    
  } catch (error: any) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/addresses
 * Update an existing address for the authenticated user
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
    const {
      addressId,
      streetAddress,
      area,
      city,
      region,
      postalCode,
      country
    } = body;

    // Validate required fields
    if (!addressId) {
      return NextResponse.json(
        { error: 'Missing required field: addressId' },
        { status: 400 }
      );
    }

    // Build update data object with only provided fields
    const updateData: any = {};
    if (streetAddress !== undefined) updateData.streetAddress = streetAddress;
    if (area !== undefined) updateData.area = area;
    if (city !== undefined) updateData.city = city;
    if (region !== undefined) updateData.region = region;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (country !== undefined) updateData.country = country;

    // Update address, ensuring user owns the address
    const updatedAddress = await prisma.address.updateMany({
      where: {
        id: addressId,
        clerkUserId: user.id // Ensure user owns this address
      },
      data: updateData
    });

    if (updatedAddress.count === 0) {
      return NextResponse.json(
        { error: 'Address not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully'
    });
    
  } catch (error: any) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to update address', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/addresses
 * Delete an address for the authenticated user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');

    // Validate required fields
    if (!addressId) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    // Delete address, ensuring user owns the address
    const deletedAddress = await prisma.address.deleteMany({
      where: {
        id: addressId,
        clerkUserId: user.id // Ensure user owns this address
      }
    });

    if (deletedAddress.count === 0) {
      return NextResponse.json(
        { error: 'Address not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Failed to delete address', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
