'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabaseClient';
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

export default function ReschedulePage() {
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
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            service_id, 
            address_id,
            booking_date, 
            booking_time_slot, 
            status, 
            total_price,
            service:service_id (
              name
            )
          `)
          .eq('id', bookingId)
          .eq('clerk_user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching booking details:', error);
          setError('Could not find this booking.');
        } else if (data) {
          // Transform the raw data into our Booking type with proper structure
          const bookingData: Booking = {
            id: data.id,
            service_id: data.service_id,
            address_id: data.address_id,
            booking_date: data.booking_date,
            booking_time_slot: data.booking_time_slot,
            status: data.status,
            total_price: data.total_price,
            service: data.service && data.service.length > 0 ? { name: data.service[0].name } : undefined
          };
          
          setBooking(bookingData);
          // Initialize form with current values
          setNewDate(data.booking_date);
          setNewTimeSlot(data.booking_time_slot);
        } else {
          setError('Booking not found or you do not have permission to reschedule it.');
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
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_date: newDate,
          booking_time_slot: newTimeSlot,
          // Optionally add a note about rescheduling
          status: 'Rescheduled' // You could keep as 'Scheduled' or use a 'Rescheduled' status
        })
        .eq('id', booking.id);
        
      if (error) {
        console.error('Error rescheduling booking:', error);
        setError(`Failed to reschedule: ${error.message}`);
      } else {
        setSuccess(true);
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
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
            We couldn't find the booking you're trying to reschedule.
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
