import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient'; // Corrected import path

/**
 * Server-side API route to fetch available services.
 * This endpoint securely fetches the list of services using the server-side
 * Supabase admin client, bypassing any potential RLS issues for public data.
 */
export async function GET() {
  console.log("API Route /api/services invoked."); // Log route invocation
  try {
    console.log("Attempting to fetch services using supabaseAdmin...");
    // Fetch services using the admin client to bypass RLS
    // Fetch only *active* services using the admin client
    const { data, error, status } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('is_active', true); // Filter for active services only
      // .order('display_order', { ascending: true }); // Removed: Column does not exist

    console.log(`Supabase query completed (fetching active services). Status: ${status}, Error: ${error ? JSON.stringify(error) : 'null'}, Data received: ${!!data}`);

    if (error) {
      console.error('Supabase error fetching services via API:', error);
      return NextResponse.json(
        { error: 'Failed to load available services from Supabase', details: error.message },
        { status: status || 500 } // Use Supabase status if available
      );
    }

    if (!data) {
      console.warn('No services data received from Supabase, returning empty array.');
      return NextResponse.json([]);
    }

    console.log(`Successfully fetched ${data.length} services.`);
    return NextResponse.json(data);

  } catch (error: any) { // Catch any unexpected errors
    console.error('Unexpected server error in /api/services:', error);
    return NextResponse.json(
      { error: 'Internal server error processing request', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add revalidation settings if needed
// export const revalidate = 60; // Revalidate every 60 seconds
