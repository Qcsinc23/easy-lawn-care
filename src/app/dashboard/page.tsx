import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient'; // Import supabaseAdmin
import Link from 'next/link';

/**
 * @fileoverview User dashboard page component.
 * Displays the logged-in user's bookings fetched from Supabase.
 * Allows users to view booking details, cancel, or reschedule upcoming services.
 */

/**
 * Represents a booking record fetched from the database, including related service details.
 */
interface Booking {
  /** Unique identifier for the booking. */
  id: string;
  /** Foreign key referencing the service booked. */
  service_id: string;
  /** Optional nested object containing the name of the booked service. */
  service?: {
    name: string;
  };
  /** Foreign key referencing the user's address for the service. */
  address_id: string;
  /** The scheduled date for the service (YYYY-MM-DD). */
  booking_date: string;
  /** The selected time slot ('morning' or 'afternoon'). */
  booking_time_slot: string;
  /** Current status of the booking (e.g., 'Scheduled', 'Completed', 'Cancelled'). */
  status: string;
  /** The final price paid for the booking. */
  total_price: number;
  /** Optional Stripe charge ID if payment was processed. */
  stripe_charge_id?: string;
}

/**
 * Renders the user dashboard page.
 * Fetches the current user via Clerk and their associated bookings from Supabase
 * using the admin client for secure data access. Displays bookings in a list format
 * with options to cancel or reschedule based on the booking status.
 * Redirects unauthenticated users to the sign-in page.
 */
export default async function Dashboard() {
  // Get the current logged-in user from Clerk
  const user = await currentUser();
  // Redirect to sign-in if no user is found
  if (!user) redirect('/sign-in');

  // Fetch bookings with related service details for the current user using Supabase Admin client
  // Note: Using supabaseAdmin ensures data fetching happens securely on the server.
  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      service:service_id (
        name
      )
    `) 
    .eq('clerk_user_id', user.id) // Filter by the Clerk user ID
    .order('booking_date', { ascending: false }); // Order bookings by date, newest first

  // Log any errors during fetching, the UI will display a generic error message
  if (error) {
    console.error('Error fetching bookings:', error);
    // UI handles displaying a user-friendly error message below
  }

  // Render the main dashboard layout
  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      {/* Welcome message using the user's first name */}
      <h1 className="text-4xl font-bold text-green-800 mb-8">Welcome, {user.firstName}!</h1>

      {/* Container for the bookings section */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">Your Bookings</h2>

        {/* Display error message if fetching failed */}
        {error && (
          <p className="text-red-600">Error loading bookings. Please try again later.</p>
        )}

        {/* Display message if there are no bookings or if fetching is still in progress (and no error) */}
        {!error && (!bookings || bookings.length === 0) ? (
          <p className="text-gray-600">You have no upcoming bookings.</p>
        ) : (
          // Grid layout for booking cards
          <div className="grid grid-cols-1 gap-6">
            {/* Map through the fetched bookings and render a card for each */}
            {bookings?.map((booking: Booking) => (
              <div key={booking.id} className="border p-6 rounded-lg shadow-md bg-white">
                {/* Flex container for booking details and ID */}
                <div className="flex justify-between items-start">
                  {/* Booking details */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {/* Display service name or a default */}
                      {booking.service?.name || 'Lawn Care Service'}
                    </h3>
                    {/* Display formatted booking date */}
                    <p className="text-gray-700 mb-1">Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                    {/* Display formatted time slot */}
                    <p className="text-gray-700 mb-1">
                      Time: {booking.booking_time_slot === 'morning' ? 'Morning (8 AM - 12 PM)' : 'Afternoon (1 PM - 5 PM)'}
                    </p>
                    {/* Display booking status with conditional styling */}
                    <p className="text-gray-700 mb-1">
                      Status: <span className={`font-semibold ${booking.status === 'Scheduled' ? 'text-green-600' : booking.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'}`}>
                        {booking.status}
                      </span>
                    </p>
                    {/* Display total price */}
                    <p className="text-gray-700 mb-1">Total Price: ${booking.total_price.toFixed(2)}</p>
                  </div>
                  {/* Booking ID (truncated) */}
                  <div className="text-right">
                    <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mb-2">
                      ID: {booking.id.substring(0, 8)}...
                    </span>
                  </div>
                </div>

                {/* Conditionally render action buttons only for 'Scheduled' bookings */}
                {booking.status === 'Scheduled' && (
                  <div className="mt-4 flex space-x-2">
                    {/* Form containing a server action to cancel the booking */}
                    <form action={async () => {
                      'use server'; // Indicate this is a Server Action
                      // Update booking status to 'Cancelled' in Supabase
                      await supabaseAdmin
                        .from('bookings')
                        .update({ status: 'Cancelled' })
                        .eq('id', booking.id);
                      // Redirect back to the dashboard to reflect the change
                      redirect('/dashboard');
                    }}>
                      {/* Cancel button */}
                      <button
                        type="submit"
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Cancel Booking
                      </button>
                    </form>
                    {/* Link to the reschedule page, passing the booking ID */}
                    <Link
                      href={`/booking/reschedule?id=${booking.id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Reschedule
                    </Link>
                  </div>
                )}

                {/* Link to the user's addresses page */}
                <div className="mt-2">
                  <Link
                    href="/dashboard/addresses"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Service Address
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
