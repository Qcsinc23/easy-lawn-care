import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use the Prisma client
import { currentUser } from '@clerk/nextjs/server';

/**
 * Server-side API route to handle custom assessment submissions.
 * This endpoint securely creates a new custom assessment record in the database
 * using the Prisma client with proper authentication.
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

    // Parse request body
    const body = await request.json();
    const {
      service_id,
      address_id,
      preferred_date,
      preferred_time,
      assessment_data
    } = body;

    // Validate required fields
    if (!service_id || !address_id || !preferred_date || !preferred_time || !assessment_data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert assessment data using Prisma client
    const customAssessment = await prisma.customAssessment.create({
      data: {
        clerkUserId: user.id,
        serviceId: service_id,
        addressId: address_id,
        preferredDate: new Date(preferred_date),
        preferredTime: preferred_time,
        assessmentData: assessment_data,
        status: 'Pending'
      },
      select: {
        id: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment request submitted successfully',
      assessment_id: customAssessment.id
    });
    
  } catch (error: unknown) {
    // Improved error logging: Log the full error object
    console.error('Unexpected error in assessment submission:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      // Ensure details field always has content
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}
