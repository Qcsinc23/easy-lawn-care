import React from 'react';
import Link from 'next/link';

export default function ServiceTiersSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Our Service Plans</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect lawn care package that fits your needs and budget
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div className="bg-gray-50 p-6 border-b">
              <h3 className="text-2xl font-bold text-green-700">Basic Clean-up</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-green-600">$25</span>
                <span className="ml-1 text-xl text-gray-500">per service</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
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
              <div className="mt-auto">
                <Link 
                  href="/services" 
                  className="w-full block text-center border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-md transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Standard Plan */}
          <div className="border border-green-300 rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-shadow duration-300 flex flex-col">
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
            <div className="p-6 flex-1 flex flex-col">
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
              <div className="mt-auto">
                <Link 
                  href="/services" 
                  className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div className="bg-gray-50 p-6 border-b">
              <h3 className="text-2xl font-bold text-green-700">Premium Service</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-green-600">$75</span>
                <span className="ml-1 text-xl text-gray-500">per service</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
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
              <div className="mt-auto">
                <Link 
                  href="/services" 
                  className="w-full block text-center border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-md transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Custom Services Plan */}
          <div className="border border-blue-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div className="bg-blue-50 p-6 border-b">
              <h3 className="text-2xl font-bold text-green-700">Custom Services</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-xl font-bold text-green-600">Custom Quote</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
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
              <div className="mt-auto">
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
    </section>
  );
}
