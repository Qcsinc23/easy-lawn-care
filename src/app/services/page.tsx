'use client';

import React from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Lawn Care Services</h1>
            <p className="text-xl mb-8">Professional, reliable lawn care tailored to your needs</p>
            <Link 
              href="/booking" 
              className="inline-block bg-white text-green-800 font-bold py-3 px-8 rounded-md hover:bg-green-100 transition duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Service Plans Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Our Service Plans</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect lawn care package that fits your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="bg-gray-50 p-6 border-b">
                <h3 className="text-2xl font-bold text-green-700">Basic Clean-up</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-green-600">$25</span>
                  <span className="ml-1 text-xl text-gray-500">per service</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 mb-4">Our entry-level service for smaller lawns or basic maintenance needs.</p>
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Mowing & Weed Wacking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Blowing clippings into a pile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Basic turf maintenance</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link 
                    href="/booking?service=basic" 
                    className="w-full block text-center border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-md transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="border border-green-300 rounded-lg shadow-md overflow-hidden relative hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
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
                <p className="text-gray-600 mb-4">Our most popular choice, offering comprehensive lawn care for the average-sized yard.</p>
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">All Basic Clean-up features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Edging</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Removal of cut grass</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Spot treatment of weeds</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link 
                    href="/booking?service=standard" 
                    className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="bg-gray-50 p-6 border-b">
                <h3 className="text-2xl font-bold text-green-700">Premium Service</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-green-600">$75</span>
                  <span className="ml-1 text-xl text-gray-500">per service</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 mb-4">Our comprehensive premium service with detailed care and documentation.</p>
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">All Standard Service features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Before & After Photos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Media in Dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Fertilization (seasonal)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Detailed lawn health report</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link 
                    href="/booking?service=premium" 
                    className="w-full block text-center border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-md transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Custom Services Plan */}
            <div className="border border-blue-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full md:col-span-3 lg:col-span-1">
              <div className="bg-blue-50 p-6 border-b">
                <h3 className="text-2xl font-bold text-blue-700">Custom Services</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-xl font-bold text-blue-600">Custom Quote</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 mb-4">Have unique lawn care needs? Our custom service packages are tailored to your specific requirements.</p>
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Free In-person Assessment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Tailored to your specific needs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Advanced landscaping options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Complex property maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600">Seasonal planning and care</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link 
                    href="/booking?service=custom" 
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

      {/* Service Details Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">What Our Services Include</h2>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-bold text-green-700 mb-4">Mowing & Weed Wacking</h3>
              <p className="text-gray-600 mb-6">
                Our professional mowing service ensures your lawn maintains a consistent, healthy height. We use premium equipment
                to achieve a clean, even cut every time, and our weed wacking service provides precise trimming around obstacles,
                edges, and hard-to-reach areas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Equipment</h4>
                  <p className="text-gray-600">Commercial-grade mowers calibrated for optimal grass health</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Technique</h4>
                  <p className="text-gray-600">Pattern cutting to prevent soil compaction and promote even growth</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-bold text-green-700 mb-4">Edging</h3>
              <p className="text-gray-600 mb-6">
                Our edging service creates crisp, clean lines along walkways, driveways, and garden beds. This detail-oriented 
                service adds a professional finish to your lawn and helps prevent grass from invading paved areas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Precision</h4>
                  <p className="text-gray-600">Sharp, defined edges that enhance your property's appearance</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Maintenance</h4>
                  <p className="text-gray-600">Regular edging prevents creeping grass and reduces manual weeding</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-green-700 mb-4">Advanced Lawn Care</h3>
              <p className="text-gray-600 mb-6">
                Our premium services include comprehensive lawn health management, from fertilization to 
                detailed documentation with before and after photos. We monitor your lawn's conditions and 
                make recommendations to keep it looking its best year-round.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Documentation</h4>
                  <p className="text-gray-600">Track your lawn's progress with detailed visual records</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Health Monitoring</h4>
                  <p className="text-gray-600">Early detection of issues like disease, pests, or nutrient deficiencies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-700 mb-2">How often should I have my lawn serviced?</h3>
                <p className="text-gray-600">
                  During the growing season, we recommend service every 1-2 weeks depending on your grass type and local climate. 
                  We can create a customized schedule based on your lawn's specific needs.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-700 mb-2">What happens if it rains on my service day?</h3>
                <p className="text-gray-600">
                  We monitor weather conditions and will reschedule your service if heavy rain is expected. If light rain occurs, 
                  we may still perform the service if it won't damage your lawn or compromise our quality standards.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-700 mb-2">Do I need to be home during the service?</h3>
                <p className="text-gray-600">
                  No, you don't need to be home. Our crews are fully trained and equipped to provide service whether you're home or not. 
                  We'll notify you before arrival and send confirmation when the job is complete.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-700 mb-2">How do I change or upgrade my service?</h3>
                <p className="text-gray-600">
                  You can easily modify your service plan through your customer dashboard or by contacting our customer service team. 
                  Service changes typically take effect on your next scheduled service date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for a Healthier, More Beautiful Lawn?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who trust us with their lawn care needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/booking" 
              className="bg-white text-green-700 font-bold py-3 px-8 rounded-md hover:bg-green-100 transition duration-300"
            >
              Book a Service
            </Link>
            <Link 
              href="/booking?contact=true" 
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-md hover:bg-green-600 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
