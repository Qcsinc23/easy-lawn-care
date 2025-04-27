import React from 'react';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">Our Service Plans</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect lawn care package that fits your needs and budget
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <p className="text-gray-700 text-center mb-12">
                Easy Lawn Care offers tiered service packages to meet your specific needs, from basic clean-up to premium service with before & after photos. If you need custom services, we offer free in-person assessments to create a tailored solution.
              </p>
              
              {/* Service Comparison Table for larger screens */}
              <div className="hidden lg:block mb-12 overflow-hidden">
                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-6 border-r">
                      <h3 className="text-xl font-bold text-green-800">Features</h3>
                    </div>
                    <div className="p-6 border-r bg-gray-50">
                      <h3 className="text-xl font-bold text-green-700">Basic Clean-up</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-extrabold text-green-600">$25</span>
                        <span className="text-gray-500 ml-1">per service</span>
                      </div>
                    </div>
                    <div className="p-6 border-r bg-green-50 relative">
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-semibold">
                        Most Popular
                      </div>
                      <h3 className="text-xl font-bold text-green-700">Standard Service</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-extrabold text-green-600">$50</span>
                        <span className="text-gray-500 ml-1">per service</span>
                      </div>
                    </div>
                    <div className="p-6 border-r bg-gray-50">
                      <h3 className="text-xl font-bold text-green-700">Premium Service</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-extrabold text-green-600">$75</span>
                        <span className="text-gray-500 ml-1">per service</span>
                      </div>
                    </div>
                    <div className="p-6 bg-blue-50">
                      <h3 className="text-xl font-bold text-green-700">Custom Services</h3>
                      <div className="mt-2">
                        <span className="text-xl font-bold text-green-600">Custom Quote</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Row: Mowing & Weed Wacking */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-6 border-r bg-gray-50 font-medium">
                      Mowing & Weed Wacking
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 flex items-center justify-center text-blue-500">
                      <span className="text-sm">Based on assessment</span>
                    </div>
                  </div>

                  {/* Feature Row: Blowing Clippings */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-6 border-r bg-gray-50 font-medium">
                      Blowing Clippings into a Pile
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 flex items-center justify-center text-blue-500">
                      <span className="text-sm">Based on assessment</span>
                    </div>
                  </div>

                  {/* Feature Row: Edging */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-6 border-r bg-gray-50 font-medium">
                      Edging
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 flex items-center justify-center text-blue-500">
                      <span className="text-sm">Based on assessment</span>
                    </div>
                  </div>

                  {/* Feature Row: Removal of Cut Grass */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-6 border-r bg-gray-50 font-medium">
                      Removal of Cut Grass
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 flex items-center justify-center text-blue-500">
                      <span className="text-sm">Based on assessment</span>
                    </div>
                  </div>

                  {/* Feature Row: Before & After Photos */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-6 border-r bg-gray-50 font-medium">
                      Before & After Photos
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 flex items-center justify-center text-blue-500">
                      <span className="text-sm">Based on assessment</span>
                    </div>
                  </div>

                  {/* Feature Row: Media in Dashboard */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-6 border-r bg-gray-50 font-medium">
                      Media in Dashboard
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="p-6 flex items-center justify-center text-blue-500">
                      <span className="text-sm">Based on assessment</span>
                    </div>
                  </div>

                  {/* Feature Row: Free In-person Assessment */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-6 border-r bg-gray-50 font-medium">
                      Free In-person Assessment
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 border-r flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="p-6 flex items-center justify-center text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="grid grid-cols-5">
                    <div className="p-6 border-r bg-gray-50"></div>
                    <div className="p-6 border-r">
                      <Link 
                        href="/booking" 
                        className="w-full block text-center border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-md transition"
                      >
                        Book Now
                      </Link>
                    </div>
                    <div className="p-6 border-r">
                      <Link 
                        href="/booking" 
                        className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                      >
                        Book Now
                      </Link>
                    </div>
                    <div className="p-6 border-r">
                      <Link 
                        href="/booking" 
                        className="w-full block text-center border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-md transition"
                      >
                        Book Now
                      </Link>
                    </div>
                    <div className="p-6">
                      <Link 
                        href="/contact" 
                        className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                      >
                        Request Assessment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Service Cards */}
            <div className="lg:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Clean-up */}
                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gray-50 p-6 border-b">
                    <h3 className="text-2xl font-bold text-green-700">Basic Clean-up</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold text-green-600">$25</span>
                      <span className="ml-1 text-xl text-gray-500">per service</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Mowing & Weed Wacking designed areas</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Blowing clippings into a pile</span>
                      </li>
                    </ul>
                    <Link 
                      href="/booking" 
                      className="w-full block text-center border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-md transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>

                {/* Standard Service */}
                <div className="border border-green-300 rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
                  {/* "Most Popular" badge */}
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-semibold">
                    Most Popular
                  </div>
                  <div className="bg-green-50 p-6 border-b">
                    <h3 className="text-2xl font-bold text-green-700">Standard Service</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold text-green-600">$50</span>
                      <span className="ml-1 text-xl text-gray-500">per service</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Includes Basic Clean-up</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Edging</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Removal of cut grass</span>
                      </li>
                    </ul>
                    <Link 
                      href="/booking" 
                      className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>

                {/* Premium Service */}
                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gray-50 p-6 border-b">
                    <h3 className="text-2xl font-bold text-green-700">Premium Service</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold text-green-600">$75</span>
                      <span className="ml-1 text-xl text-gray-500">per service</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Includes Standard Service</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Before & After Photos</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Media in Dashboard</span>
                      </li>
                    </ul>
                    <Link 
                      href="/booking" 
                      className="w-full block text-center border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-md transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>

                {/* Custom Services */}
                <div className="border border-blue-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="bg-blue-50 p-6 border-b">
                    <h3 className="text-2xl font-bold text-green-700">Custom Services</h3>
                    <div className="mt-4">
                      <span className="text-xl font-bold text-green-600">Custom Quote</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Free In-person Assessment</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Tailored to your specific needs</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Advanced landscaping options</span>
                      </li>
                    </ul>
                    <Link 
                      href="/contact" 
                      className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                    >
                      Request Assessment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
