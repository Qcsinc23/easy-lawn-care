'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
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
}

// Separate the content component from the page component
function ReschedulePageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // New scheduling values
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId || !isLoaded || !user) return;

      try {
        // Fetch booking details via API
        const response = await fetch(`/api/bookings?id=${bookingId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.bookings && data.bookings.length > 0) {
            const bookingData = data.bookings[0];
            setBooking(bookingData);
            // Initialize form with current values
            setNewDate(bookingData.booking_date);
            setNewTimeSlot(bookingData.booking_time_slot);
          } else {
            setError('Booking not found or you do not have permission to reschedule it.');
          }
        } else {
          console.error('Error fetching booking details');
          setError('Could not find this booking.');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      fetchBookingDetails();
    }
  }, [bookingId, isLoaded, user]);

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking || !newDate || !newTimeSlot) {
      setError('Please select a new date and time.');
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      // Update booking via API
      const response = await fetch(`/api/bookings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: booking.id,
          booking_date: newDate,
          booking_time_slot: newTimeSlot,
          status: 'Rescheduled'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuccess(true);
          // Wait a moment before redirecting
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setError(`Failed to reschedule: ${data.error || 'Unknown error'}`);
        }
      } else {
        console.error('Error rescheduling booking');
        setError('Failed to reschedule booking.');
      }
    } catch (err) {
      console.error('Unexpected error during rescheduling:', err);
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || (isLoaded && !user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <p>Please sign in to reschedule your booking...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link 
            href="/dashboard" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded block text-center"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-700">Booking Rescheduled!</h1>
            <p className="text-gray-600 mt-1">Your lawn care service has been successfully rescheduled.</p>
          </div>
          <p className="text-center text-gray-600 mb-6">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Booking Not Found</h1>
          <p className="text-gray-700 mb-6">
            We couldn&apos;t find the booking you&apos;re trying to reschedule.
          </p>
          <Link 
            href="/dashboard" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded block text-center"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Format date for display
  const currentDate = new Date(booking.booking_date).toLocaleDateString();
  
  // Current time slot for display
  const currentTimeSlot = booking.booking_time_slot === 'morning' 
    ? 'Morning (8 AM - 12 PM)'
    : 'Afternoon (1 PM - 5 PM)';

  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Reschedule Booking</h1>
      
      <div className="w-full max-w-md border p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Booking Details</h2>
          <p className="text-gray-700 mb-1">Service: {booking.service?.name || 'Lawn Care Service'}</p>
          <p className="text-gray-700 mb-1">Current Date: {currentDate}</p>
          <p className="text-gray-700 mb-1">Current Time: {currentTimeSlot}</p>
        </div>
        
        <form onSubmit={handleReschedule}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select New Date & Time</h2>
          
          {error && <p className="text-red-600 mb-4">{error}</p>}
          
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
              New Date:
            </label>
            <input
              type="date"
              id="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">
              New Time Slot:
            </label>
            <select
              id="time"
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">-- Select a Time --</option>
              <option value="morning">Morning (8 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (1 PM - 5 PM)</option>
            </select>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex-1"
            >
              {saving ? 'Saving...' : 'Confirm Reschedule'}
            </button>
            
            <Link
              href="/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex-1 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main page component that uses the content component
export default function ReschedulePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-lg">Loading...</div>
    </div>}>
      <ReschedulePageContent />
    </Suspense>
  );
}