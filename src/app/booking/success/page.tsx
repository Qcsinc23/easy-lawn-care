'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

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
  const simulateMode = searchParams.get('simulate'); // For testing purposes
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
      
      // Simulate mode - for testing successful payment message
      if (simulateMode === 'payment-success') {
        console.log('Simulating successful payment with no booking yet');
        setError('Your booking is being processed in our system.');
        setLoading(false);
        return;
      }
      
      // Simulate mode - for testing fully successful booking
      if (simulateMode === 'booking-success') {
        console.log('Simulating successful booking retrieval');
        setBooking({
          id: 'simulated-booking-123',
          service: {
            id: 'service-123',
            name: 'Premium Lawn Care',
            price: 99.99
          },
          address: {
            street_address: '123 Main St',
            area: 'Downtown',
            city: 'Springfield',
            region: 'IL'
          },
          booking_date: new Date().toISOString().split('T')[0],
          booking_time_slot: 'morning',
          status: 'Scheduled',
          total_price: 99.99,
          stripe_charge_id: 'sim_charge_123456'
        });
        setLoading(false);
        return;
      }
      
      // For normal bookings, proceed with fetching details
      if (!sessionId || !isLoaded || !user) return;

      // Implement a retry mechanism to handle the delay between 
      // Stripe payment completion and webhook processing
      let retryCount = 0;
      const maxRetries = 3;
      const retryDelay = 2000; // 2 seconds between retries
      
      const attemptFetch = async () => {
        try {
          // Find the booking with this Stripe session ID
          console.log(`Searching for booking with session ID (attempt ${retryCount + 1}):`, sessionId);
          
          // Fetch booking details via API
          const response = await fetch(`/api/bookings?stripe_charge_id=${sessionId}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.bookings && data.bookings.length > 0) {
              // Success! We found the booking
              const bookingData = data.bookings[0];
              setBooking(bookingData as BookingDetails);
              setLoading(false);
            } else if (retryCount < maxRetries) {
              // No booking found yet, but we still have retries left
              console.log(`Booking not found yet. Retrying in ${retryDelay/1000} seconds...`);
              retryCount++;
              setTimeout(attemptFetch, retryDelay);
            } else {
              // We've exhausted our retries
              console.log('No booking found after retries');
              setError('Your booking is being processed in our system.');
              setLoading(false);
            }
          } else if (retryCount < maxRetries) {
            // API call failed, but we still have retries left
            console.log(`API call failed. Retrying in ${retryDelay/1000} seconds...`);
            retryCount++;
            setTimeout(attemptFetch, retryDelay);
          } else {
            // We've exhausted our retries or encountered a different error
            console.error('Error fetching booking details after retries');
            setError('Your booking is being processed in our system.');
            setLoading(false);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          setError('An unexpected error occurred. Please check your dashboard for booking details.');
          setLoading(false);
        }
      };
      
      // Start the first attempt
      attemptFetch();
    }

    if (isLoaded) {
      fetchBookingDetails();
    }
  }, [sessionId, isLoaded, user, requestType, simulateMode]);

  // In simulation mode, we don't need to wait for authentication
  if (!simulateMode && (!isLoaded || (isLoaded && !user))) {
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
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-700">Payment Successful!</h1>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Booking In Progress</h2>
            <p className="text-yellow-700 mb-2">
              Your payment was processed successfully! Your booking is currently being processed in our system.
            </p>
            <p className="text-yellow-700">
              Please check your dashboard in a few minutes to see your confirmed booking details.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Link 
              href="/dashboard?refresh=true" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
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
            <p className="text-gray-600 mt-1">We&apos;ve received your request for a custom lawn care assessment</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">What&apos;s Next?</h2>
            <p className="text-blue-700 mb-2">
              One of our lawn care specialists will review your assessment request within 1-2 business days.
            </p>
            <p className="text-blue-700 mb-2">
              We&apos;ll contact you to schedule an in-person visit to evaluate your lawn and provide a custom quote.
            </p>
            <p className="text-blue-700">
              You&apos;ll receive a confirmation email with these details shortly.
            </p>
          </div>

          <div className="flex flex-col space-y-3 mt-6">
            <Link 
              href="/dashboard?refresh=true" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
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
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-700">Payment Successful!</h1>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Booking Processing</h2>
            <p className="text-blue-700 mb-2">
              Your payment was successful, but we&apos;re still processing your booking details.
            </p>
            <p className="text-blue-700">
              Please check your dashboard in a few moments to see your confirmed booking.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
          <Link 
            href="/dashboard?refresh=true" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
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
          <h2 className="text-lg font-semibold text-blue-800 mb-2">What&apos;s Next?</h2>
          <p className="text-blue-700 mb-2">
            Our team will arrive at your location on {formattedDate} during the {booking.booking_time_slot} time slot.
          </p>
          <p className="text-blue-700">
            You&apos;ll receive a confirmation email with these details shortly.
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
