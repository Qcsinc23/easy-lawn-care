import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient'; // Use the dedicated admin client
import { currentUser } from '@clerk/nextjs/server';

/**
 * Server-side API route to handle custom assessment submissions.
 * This endpoint securely creates a new custom assessment record in the database
 * using the server-side Supabase client with proper authentication.
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

    // Insert assessment data using server-side supabaseAdmin
    const { data, error } = await supabaseAdmin
      .from('custom_assessments')
      .insert({
        clerk_user_id: user.id,
        service_id,
        address_id,
        preferred_date,
        preferred_time,
        assessment_data,
        status: 'Pending'
      })
      .select('id')
      .single();
    if (error) {
      // Enhanced logging for Supabase errors
      // Enhanced logging for Supabase errors - Log the full error object
      console.error('Error creating assessment (Supabase):', JSON.stringify(error, null, 2));

      // Attempt to extract more specific details from the PostgREST error object
      // Supabase error objects might have code, details, hint, message
      const errorInfo = {
        message: error?.message || 'N/A',
        code: error?.code || 'N/A',
        details: error?.details || 'N/A',
        hint: error?.hint || 'N/A',
        fullErrorString: JSON.stringify(error) || '{}'
      };
      console.error('Extracted Supabase Error Details:', errorInfo); // Log extracted details server-side

      return NextResponse.json(
        {
          error: 'Failed to create assessment',
          // Send a more structured error detail string back to the client
          details: `Supabase Error - Code: ${errorInfo.code}, Details: ${errorInfo.details}, Hint: ${errorInfo.hint}, Message: ${errorInfo.message}`
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment request submitted successfully',
      assessment_id: data.id
    });
    
  } catch (error: any) { // Added : any for better logging
    // Improved error logging: Log the full error object
    console.error('Unexpected error in assessment submission:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      // Ensure details field always has content
      { error: 'Internal server error', details: error?.message || JSON.stringify(error) || 'Unknown server error' }, 
      { status: 500 }
    );
  }
}
