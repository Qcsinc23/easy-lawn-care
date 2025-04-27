'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  includes_media: boolean;
  is_active: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services.');
      } else {
        setServices(data || []);
      }
      setLoading(false);
    }

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading pricing information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Pricing</h1>
      <p className="text-xl text-gray-700 mb-12 text-center">Transparent pricing based on your lawn size and chosen services.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {services.map((service) => (
          <div key={service.id} className="border p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">{service.name}</h2>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="list-disc list-inside text-gray-700 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
                {service.includes_media && <li>Includes before/after media</li>}
              </ul>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-800 mb-4">${service.price.toFixed(2)}</p>
              {/* Placeholder for a button to the booking page */}
              <button 
                onClick={() => router.push(`/booking?serviceId=${service.id}`)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border p-6 rounded-lg shadow-md text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold text-green-700 mb-2">Need a Custom Quote?</h2>
        <p className="text-gray-600 mb-4">Contact us for a precise estimate tailored to your specific needs.</p>
        {/* Placeholder for a contact button */}
        <button 
          onClick={() => router.push('/contact')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}
