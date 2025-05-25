'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  clerkUserId: string;
  streetAddress: string;
  area: string;
  city: string;
  region: string;
  postalCode?: string;
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
    streetAddress: '',
    area: '',
    city: 'Georgetown',
    region: 'Demerara-Mahaica (Region 4)',
    postalCode: '',
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
        const response = await fetch('/api/addresses');
        
        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }
        
        const data = await response.json();
        setAddresses(data.addresses || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError('Failed to load addresses.');
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
      streetAddress: address.streetAddress,
      area: address.area,
      city: address.city,
      region: address.region,
      postalCode: address.postalCode || '',
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
      const response = await fetch(`/api/addresses?id=${addressId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      // Update local state to remove the deleted address
      setAddresses(prev => prev.filter(address => address.id !== addressId));
    } catch (err) {
      console.error('Error deleting address:', err);
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

    // Construct the address data object with all required fields
    const addressData = {
      streetAddress: newAddress.streetAddress.trim(),
      area: newAddress.area.trim(),
      city: newAddress.city.trim(),
      region: newAddress.region.trim(),
      postalCode: newAddress.postalCode?.trim() || undefined,
      country: newAddress.country.trim() || 'Guyana',
    };

    try {
      let response;
      if (editingAddressId) {
        // Update existing address
        response = await fetch('/api/addresses', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addressId: editingAddressId,
            ...addressData
          }),
        });
      } else {
        // Insert new address
        response = await fetch('/api/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save address');
      }

      const result = await response.json();

      if (editingAddressId) {
        // Update was successful, refresh the addresses
        const refreshResponse = await fetch('/api/addresses');
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setAddresses(refreshData.addresses || []);
        }
        setEditingAddressId(null);
      } else {
        // Add was successful, add to local state
        if (result.address) {
          setAddresses(prev => [...prev, result.address]);
        }
      }

      // Reset form
      setNewAddress({
        streetAddress: '',
        area: '',
        city: 'Georgetown',
        region: 'Demerara-Mahaica (Region 4)',
        postalCode: '',
        country: 'Guyana',
      });
      setShowAddForm(false);
    } catch (err: unknown) {
      console.error('Error saving address:', err);
      setAddError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
              <label htmlFor="streetAddress" className="block text-gray-700 text-sm font-bold mb-2">
                Lot/House Number and Street:
              </label>
              <input 
                type="text" 
                id="streetAddress" 
                name="streetAddress" 
                placeholder="Lot 42 Charlotte Street" 
                value={newAddress.streetAddress} 
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
              <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">
                Postal Code (if applicable):
              </label>
              <input 
                type="text" 
                id="postalCode" 
                name="postalCode" 
                value={newAddress.postalCode} 
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {addresses.length === 0 ? (
          <p className="text-gray-600">You have no saved addresses.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="border p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Address:</h3>
                <p className="text-gray-700">{address.streetAddress || 'No street address'}</p>
                <p className="text-gray-700">{address.area || 'No area specified'}</p>
                <p className="text-gray-700">{address.city || 'No city specified'}</p>
                <p className="text-gray-700">{address.region || 'No region specified'}</p>
                {address.postalCode && <p className="text-gray-700">{address.postalCode}</p>}
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
