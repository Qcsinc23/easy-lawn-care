'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface BookingDetails {
  id: string;
  service: {
    id: string;
    name: string;
    price: number;
  };
  address: {
    street_address: string;
    area: string;
    city: string;
    region: string;
  };
  booking_date: string;
  booking_time_slot: string;
  status: string;
  total_price: number;
  stripe_charge_id: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const requestType = searchParams.get('type'); // Add type param check
  const { user, isLoaded } = useUser();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookingDetails() {
      // If it's an assessment request, we don't need to fetch booking details
      if (requestType === 'assessment') {
        setLoading(false);
        return;
      }
      
      // For normal bookings, proceed with fetching details
      if (!sessionId || !isLoaded || !user) return;

      try {
        // Find the booking with this Stripe session ID
        // Added logging to help debug
        console.log('Searching for booking with session ID:', sessionId);
        
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            id, 
            booking_date, 
            booking_time_slot, 
            status, 
            total_price,
            stripe_charge_id,
            service:service_id (
              id, 
              name, 
              price
            ),
            address:address_id (
              street_address, 
              area, 
              city, 
              region
            )
          `)
          .eq('stripe_charge_id', sessionId)
          .eq('clerk_user_id', user.id)
          .single();

        if (bookingError) {
          console.error('Error fetching booking details:', bookingError);
          setError('Could not find your booking. Please check your dashboard for details.');
        } else if (bookingData) {
          setBooking(bookingData as unknown as BookingDetails);
        } else {
          setError('Booking not found. It may still be processing.');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please check your dashboard for booking details.');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      fetchBookingDetails();
    }
  }, [sessionId, isLoaded, user]);

  if (!isLoaded || (isLoaded && !user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <p>Please sign in to view your booking...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <p>Loading your booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Booking Information Unavailable</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex flex-col space-y-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/booking" 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Book Another Service
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Display custom success message for assessment requests
  if (requestType === 'assessment') {
    return (
      <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-blue-700">Assessment Request Submitted!</h1>
            <p className="text-gray-600 mt-1">We've received your request for a custom lawn care assessment</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">What's Next?</h2>
            <p className="text-blue-700 mb-2">
              One of our lawn care specialists will review your assessment request within 1-2 business days.
            </p>
            <p className="text-blue-700 mb-2">
              We'll contact you to schedule an in-person visit to evaluate your lawn and provide a custom quote.
            </p>
            <p className="text-blue-700">
              You'll receive a confirmation email with these details shortly.
            </p>
          </div>

          <div className="flex flex-col space-y-3 mt-6">
            <Link 
              href="/dashboard" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              View Your Dashboard
            </Link>
            <Link 
              href="/" 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!booking && !requestType) {
    return (
      <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Payment Processed</h1>
          <p className="text-gray-700 mb-6">
            Your payment was successful, but we couldn't find your booking details just yet. 
            They may still be processing. Please check your dashboard in a few minutes.
          </p>
          <div className="flex flex-col space-y-4">
            <Link 
              href="/dashboard" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // At this point we know booking is not null
  // TypeScript needs this guard to prevent "possibly null" errors
  if (!booking) {
    return null; // This should never happen but keeps TypeScript happy
  }

  // Format date for display
  const formattedDate = new Date(booking.booking_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format time slot for display
  const timeSlotDisplay = booking.booking_time_slot === 'morning' 
    ? 'Morning (8 AM - 12 PM)'
    : 'Afternoon (1 PM - 5 PM)';

  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-700">Booking Confirmed!</h1>
          <p className="text-gray-600 mt-1">Your lawn care service has been scheduled</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Service Details</h2>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-gray-600">Service:</p>
            <p className="text-gray-800 font-medium">{booking.service.name}</p>
            
            <p className="text-gray-600">Date:</p>
            <p className="text-gray-800 font-medium">{formattedDate}</p>
            
            <p className="text-gray-600">Time:</p>
            <p className="text-gray-800 font-medium">{timeSlotDisplay}</p>
            
            <p className="text-gray-600">Status:</p>
            <p className="text-green-600 font-medium">{booking.status}</p>
            
            <p className="text-gray-600">Total:</p>
            <p className="text-gray-800 font-medium">${booking.total_price.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Service Location</h2>
          <p className="text-gray-800">{booking.address.street_address}</p>
          <p className="text-gray-800">{booking.address.area}</p>
          <p className="text-gray-800">{booking.address.city}, {booking.address.region}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">What's Next?</h2>
          <p className="text-blue-700 mb-2">
            Our team will arrive at your location on {formattedDate} during the {booking.booking_time_slot} time slot.
          </p>
          <p className="text-blue-700">
            You'll receive a confirmation email with these details shortly.
          </p>
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          <Link 
            href="/dashboard" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
          >
            View Your Bookings
          </Link>
          <Link 
            href="/booking" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center"
          >
            Book Another Service
          </Link>
        </div>
      </div>
    </div>
  );
}
