import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient'; // Import supabaseAdmin
import Link from 'next/link';

interface Booking {
  id: string;
  service_id: string;
  service?: {
    name: string;
  };
  address_id: string;
  booking_date: string;
  booking_time_slot: string;
  status: string;
  total_price: number;
  stripe_charge_id?: string;
}

export default async function Dashboard() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  // Fetch bookings with service details for the current user from Supabase
  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      service:service_id (
        name
      )
    `) 
    .eq('clerk_user_id', user.id) // Filter by the Clerk user ID
    .order('booking_date', { ascending: false }); // Order by date

  if (error) {
    console.error('Error fetching bookings:', error);
    // Handle error display in the UI
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Welcome, {user.firstName}!</h1>

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">Your Bookings</h2>

        {error && (
          <p className="text-red-600">Error loading bookings. Please try again later.</p>
        )}

        {!bookings || bookings.length === 0 ? (
          <p className="text-gray-600">You have no upcoming bookings.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking: Booking) => (
              <div key={booking.id} className="border p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {booking.service?.name || 'Lawn Care Service'}
                    </h3>
                    <p className="text-gray-700 mb-1">Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                    <p className="text-gray-700 mb-1">
                      Time: {booking.booking_time_slot === 'morning' ? 'Morning (8 AM - 12 PM)' : 'Afternoon (1 PM - 5 PM)'}
                    </p>
                    <p className="text-gray-700 mb-1">
                      Status: <span className={`font-semibold ${booking.status === 'Scheduled' ? 'text-green-600' : 'text-gray-600'}`}>
                        {booking.status}
                      </span>
                    </p>
                    <p className="text-gray-700 mb-1">Total Price: ${booking.total_price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mb-2">
                      ID: {booking.id.substring(0, 8)}...
                    </span>
                  </div>
                </div>
                
                {/* Action buttons based on status */}
                {booking.status === 'Scheduled' && (
                  <div className="mt-4 flex space-x-2">
                    <form action={async () => {
                      'use server';
                      await supabaseAdmin
                        .from('bookings')
                        .update({ status: 'Cancelled' })
                        .eq('id', booking.id);
                      redirect('/dashboard'); // Refresh the page
                    }}>
                      <button 
                        type="submit"
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Cancel Booking
                      </button>
                    </form>
                    <Link 
                      href={`/booking/reschedule?id=${booking.id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Reschedule
                    </Link>
                  </div>
                )}

                {/* Quick link to view address details */}
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
