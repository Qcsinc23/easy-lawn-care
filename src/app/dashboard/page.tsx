'use client';

import { useUser } from '@clerk/nextjs';
import { redirect, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * @fileoverview User dashboard page component.
 * Displays the logged-in user's bookings fetched from API endpoints.
 * Allows users to view booking details, cancel, or reschedule upcoming services.
 */

/**
 * Represents a booking record fetched from the API, including related service details.
 */
interface Booking {
  /** Unique identifier for the booking. */
  id: string;
  /** Foreign key referencing the service booked. */
  serviceId: string;
  /** Optional nested object containing the name of the booked service. */
  service?: {
    name: string;
  };
  /** Foreign key referencing the user's address for the service. */
  addressId: string;
  /** The scheduled date for the service (YYYY-MM-DD). */
  bookingDate: string;
  /** The selected time slot (stored as time). */
  bookingTime: string;
  /** Current status of the booking (e.g., 'Scheduled', 'Completed', 'Cancelled'). */
  status: string;
  /** The final price paid for the booking. */
  priceAtBooking: number;
  /** Optional Stripe charge ID if payment was processed. */
  stripeCheckoutSessionId?: string;
}

/**
 * Renders the user dashboard page.
 * Fetches the current user via Clerk and their associated bookings from API endpoints
 * for secure data access. Displays bookings in a list format
 * with options to cancel or reschedule based on the booking status.
 * Redirects unauthenticated users to the sign-in page.
 */
export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get('refresh') === 'true';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check for authentication
  useEffect(() => {
    if (isLoaded && !user) {
      redirect('/sign-in');
    }
  }, [isLoaded, user]);
  
  // Trigger immediate refresh if coming from success page
  useEffect(() => {
    if (shouldRefresh) {
      setRefreshTrigger(prev => prev + 1);
    }
  }, [shouldRefresh]);

  // Fetch bookings when component mounts or refreshTrigger changes
  useEffect(() => {
    if (!user) return;
    
    const fetchBookings = async () => {
      setLoading(true);
      
      try {
        // Fetch bookings via API endpoint
        const response = await fetch('/api/bookings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const data = await response.json();
        setBookings(data.bookings || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error loading bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    
    // Set up automatic refresh every 5 seconds
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [user, refreshTrigger]);
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status: 'Cancelled'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Refresh bookings after cancellation
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    }
  };
  
  // Manual refresh button handler
  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Show loading state if authentication is still loading
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <p>Loading user data...</p>
      </div>
    );
  }

  // Render the main dashboard layout
  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      {/* Welcome message using the user's first name */}
      <h1 className="text-4xl font-bold text-green-800 mb-8">Welcome, {user?.firstName}!</h1>

      {/* Container for the bookings section */}
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-green-700">Your Bookings</h2>
          <button 
            onClick={handleManualRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
          </div>
        )}

        {/* Display error message if fetching failed */}
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {/* Display message if there are no bookings */}
        {!loading && !error && bookings.length === 0 && (
          <p className="text-gray-600">You have no upcoming bookings.</p>
        )}

        {/* Grid layout for booking cards */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {/* Map through the fetched bookings and render a card for each */}
            {bookings.map((booking: Booking) => (
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
                    <p className="text-gray-700 mb-1">Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                    {/* Display formatted time slot */}
                    <p className="text-gray-700 mb-1">
                      Time: {booking.bookingTime.includes('08:00') ? 'Morning (8 AM - 12 PM)' : 'Afternoon (1 PM - 5 PM)'}
                    </p>
                    {/* Display booking status with conditional styling */}
                    <p className="text-gray-700 mb-1">
                      Status: <span className={`font-semibold ${booking.status === 'Scheduled' ? 'text-green-600' : booking.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'}`}>
                        {booking.status}
                      </span>
                    </p>
                    {/* Display total price */}
                    <p className="text-gray-700 mb-1">Total Price: ${booking.priceAtBooking.toFixed(2)}</p>
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
                    {/* Cancel button */}
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Cancel Booking
                    </button>
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
