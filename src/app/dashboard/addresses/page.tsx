'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { refreshSupabaseSchema } from '@/lib/refresh-schema';

interface Address {
  id: string;
  clerk_user_id: string;
  street_address: string;
  area: string;
  city: string;
  region: string;
  postal_code?: string;
  country: string;
}

// Guyana's 10 administrative regions
const guyanaRegions = [
  "Barima-Waini (Region 1)",
  "Pomeroon-Supenaam (Region 2)",
  "Essequibo Islands-West Demerara (Region 3)",
  "Demerara-Mahaica (Region 4)",
  "Mahaica-Berbice (Region 5)",
  "East Berbice-Corentyne (Region 6)",
  "Cuyuni-Mazaruni (Region 7)",
  "Potaro-Siparuni (Region 8)",
  "Upper Takutu-Upper Essequibo (Region 9)",
  "Upper Demerara-Berbice (Region 10)"
];

// Common cities/towns in Guyana
const guyanaCities = [
  "Georgetown",
  "Linden",
  "New Amsterdam",
  "Anna Regina",
  "Bartica",
  "Corriverton",
  "Lethem",
  "Mabaruma",
  "Mahdia",
  "Parika",
  "Rosignol",
  "Skeldon",
  "Vreed en Hoop",
  "Other"
];

export default function AddressesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street_address: '',
    area: '',
    city: 'Georgetown',
    region: 'Demerara-Mahaica (Region 4)',
    postal_code: '',
    country: 'Guyana',
  });
  const [addingAddress, setAddingAddress] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  
  // State for editing addresses
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchAddresses() {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('clerk_user_id', user.id);

        if (error) {
          console.error('Error fetching addresses:', error);
          setError('Failed to load addresses.');
        } else {
          setAddresses(data || []);
        }
      } catch (err) {
        console.error('Exception when fetching addresses:', err);
        setError('An unexpected error occurred while loading addresses.');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && user) {
      fetchAddresses();
    } else if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  // Handler for editing address
  const handleEditAddress = (address: Address) => {
    setNewAddress({
      street_address: address.street_address,
      area: address.area,
      city: address.city,
      region: address.region,
      postal_code: address.postal_code || '',
      country: address.country,
    });
    setEditingAddressId(address.id);
    setShowAddForm(true);
  };

  // Handler for deleting address
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);
        
      if (error) {
        console.error('Error deleting address:', error);
        alert(`Failed to delete address: ${error.message}`);
      } else {
        // Update local state to remove the deleted address
        setAddresses(prev => prev.filter(address => address.id !== addressId));
      }
    } catch (err) {
      console.error('Unexpected error during address deletion:', err);
      alert('An error occurred while deleting the address');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddOrUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setAddError("User ID is missing. Please sign in again.");
      return;
    }

    setAddingAddress(true);
    setAddError(null);

    // Log that Supabase client is being used (without accessing protected properties)
    console.log('Using Supabase client for database operations');

    // Construct the address data object with all required fields
    const addressData = {
      clerk_user_id: user.id,
      street_address: newAddress.street_address.trim(),
      area: newAddress.area.trim(),
      city: newAddress.city.trim(),
      region: newAddress.region.trim(),
      postal_code: newAddress.postal_code?.trim() || null,
      country: newAddress.country.trim() || 'Guyana',
    };

    // Log the data we're trying to insert or update
    console.log(`${editingAddressId ? 'Updating' : 'Submitting'} address with data:`, addressData);

    try {
      // Try to refresh the Supabase schema cache to fix PGRST204 errors
      console.log('Refreshing Supabase schema cache...');
      const refreshResult = await refreshSupabaseSchema();
      console.log('Schema refresh result:', refreshResult);
      
      // Direct debugging of the Supabase connection
      const testQuery = await supabase.from('addresses').select('*').limit(1);
      console.log('Test query result:', testQuery);

      if (testQuery.error && testQuery.error.code === 'PGRST204') {
        console.log('Schema cache issue detected. The "addresses" table exists but PostgREST schema cache needs updating.');
        // Continue anyway, since we already attempted a refresh
      } else if (testQuery.error) {
        console.error('Supabase connection test failed:', testQuery.error);
        setAddError(`Database connection error: ${testQuery.error.message || 'Unknown error'}`);
        setAddingAddress(false);
        return;
      }

      // Determine if we're inserting or updating
      let result;
      if (editingAddressId) {
        // Update existing address
        console.log('Updating address record...');
        result = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingAddressId)
          .select();
      } else {
        // Insert new address
        console.log('Inserting address record...');
        result = await supabase
          .from('addresses')
          .insert([addressData])
          .select();
      }

      console.log(`${editingAddressId ? 'Update' : 'Insert'} operation complete. Result:`, result);

      if (result.error) {
        // Detailed error logging with fallbacks for empty objects
        const errorCode = result.error.code || 'unknown';
        const errorMessage = result.error.message || 'Unknown database error';
        const errorDetails = JSON.stringify(result.error.details) || 'No details available';
        
        console.error('Error adding address. Code:', errorCode);
        console.error('Error message:', errorMessage);
        console.error('Error details:', errorDetails);
        
        // User-friendly error message based on error code
        if (errorCode === '42P01') {
          setAddError(`The addresses table does not exist. Please follow the setup instructions in the documentation.`);
        } else if (errorCode === '23502') {
          setAddError(`Missing required field: ${errorDetails}`);
        } else if (errorCode === '23505') {
          setAddError(`This address already exists.`);
        } else if (errorCode.includes('auth')) {
          setAddError(`Authentication error: ${errorMessage}. You may need to sign in again.`);
        } else {
          setAddError(`Database error (${errorCode}): ${errorMessage}`);
        }
      } else if (result.data && result.data.length > 0) {
        // Success path
        if (editingAddressId) {
          console.log('Address updated successfully:', result.data[0]);
          setAddresses(prev => prev.map(addr => 
            addr.id === editingAddressId ? result.data[0] : addr
          ));
          setEditingAddressId(null);
        } else {
          console.log('Address added successfully:', result.data[0]);
          setAddresses(prev => [...prev, result.data[0]]);
        }
        setNewAddress({
          street_address: '',
          area: '',
          city: 'Georgetown',
          region: 'Demerara-Mahaica (Region 4)',
          postal_code: '',
          country: 'Guyana',
        });
        setShowAddForm(false);
      } else {
        console.warn('No error, but no data returned after insert');
        setAddError('Address may have been added but no confirmation was received. Please refresh the page to check.');
      }
    } catch (err) {
      // Catch and log any unexpected errors
      console.error('Unexpected exception during address submission:', err);
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        errorMessage = `${err.name}: ${err.message}`;
      } else if (err && typeof err === 'object') {
        errorMessage = JSON.stringify(err);
      }
      
      setAddError(`System error: ${errorMessage}`);
    } finally {
      setAddingAddress(false);
    }
  };

  if (!isLoaded || (isLoaded && !user)) {
    return null; // Redirect handled by useEffect
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md border border-red-200">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Database Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Need to set up your database?</h2>
            <p className="mb-4">It looks like you might need to create the necessary tables in your Supabase database.</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Quick Setup Instructions:</h3>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>Log in to your <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                <li>Select your project</li>
                <li>Go to the "SQL Editor" section</li>
                <li>Create a new query</li>
                <li>Copy and paste the SQL code below</li>
                <li>Run the query</li>
                <li>Refresh this page</li>
              </ol>
            </div>
            
            <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-4">
              <pre className="text-sm">
                <code>
{`-- Create addresses table
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT NOT NULL,
    street_address TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    postal_code TEXT,
    country TEXT NOT NULL DEFAULT 'Guyana',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                </code>
              </pre>
            </div>
            
            <p className="text-sm text-gray-600">
              For complete setup instructions and documentation, see the 
              <a href="/docs/SUPABASE.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                Supabase Integration Guide
              </a> in the project documentation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Your Addresses</h1>

      <div className="w-full max-w-4xl">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-6"
        >
          {showAddForm ? 'Cancel Add Address' : 'Add New Address'}
        </button>

        {showAddForm && (
          <form onSubmit={handleAddOrUpdateAddress} className="border p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <p className="text-gray-600 mb-4">Please enter your address in Guyana format</p>
            
            {addError && <p className="text-red-600 mb-4">{addError}</p>}
            
            <div className="mb-4">
              <label htmlFor="street_address" className="block text-gray-700 text-sm font-bold mb-2">
                Lot/House Number and Street:
              </label>
              <input 
                type="text" 
                id="street_address" 
                name="street_address" 
                placeholder="Lot 42 Charlotte Street" 
                value={newAddress.street_address} 
                onChange={handleInputChange} 
                required 
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="area" className="block text-gray-700 text-sm font-bold mb-2">
                Area/Village/Community:
              </label>
              <input 
                type="text" 
                id="area" 
                name="area" 
                placeholder="Bourda" 
                value={newAddress.area} 
                onChange={handleInputChange} 
                required 
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                City/Town:
              </label>
              <select
                id="city"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {guyanaCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="region" className="block text-gray-700 text-sm font-bold mb-2">
                Region/County:
              </label>
              <select
                id="region"
                name="region"
                value={newAddress.region}
                onChange={handleInputChange}
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {guyanaRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="postal_code" className="block text-gray-700 text-sm font-bold mb-2">
                Postal Code (if applicable):
              </label>
              <input 
                type="text" 
                id="postal_code" 
                name="postal_code" 
                value={newAddress.postal_code} 
                onChange={handleInputChange} 
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
                Country:
              </label>
              <input 
                type="text" 
                id="country" 
                name="country" 
                value={newAddress.country} 
                onChange={handleInputChange}  
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={addingAddress} 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              {addingAddress 
                ? (editingAddressId ? 'Updating...' : 'Adding...') 
                : (editingAddressId ? 'Update Address' : 'Save Address')
              }
            </button>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-gray-600">You have no saved addresses.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="border p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Address:</h3>
                <p className="text-gray-700">{address.street_address || 'No street address'}</p>
                <p className="text-gray-700">{address.area || 'No area specified'}</p>
                <p className="text-gray-700">{address.city || 'No city specified'}</p>
                <p className="text-gray-700">{address.region || 'No region specified'}</p>
                {address.postal_code && <p className="text-gray-700">{address.postal_code}</p>}
                <p className="text-gray-700">{address.country || 'Guyana'}</p>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => handleEditAddress(address)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
