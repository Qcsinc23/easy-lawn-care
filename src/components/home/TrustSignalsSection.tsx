import React from 'react';

export default function TrustSignalsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Easy Lawn Care is committed to providing exceptional service and value
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Trust Signal 1 */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">Easy Online Booking</h3>
            <p className="text-gray-600">
              Schedule your lawn care service with just a few clicks, 24/7 at your convenience.
            </p>
          </div>

          {/* Trust Signal 2 */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">Reliable & Professional</h3>
            <p className="text-gray-600">
              Count on our experienced team to deliver quality service on time, every time.
            </p>
          </div>

          {/* Trust Signal 3 */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">Serving All of Guyana</h3>
            <p className="text-gray-600">
              We provide our premium lawn care services throughout Guyana with local expertise.
            </p>
          </div>

          {/* Trust Signal 4 */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Rest easy with our secure online payment system and transparent pricing.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-green-800 text-center mb-8">What Our Customers Say</h3>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-700 font-bold text-xl">JD</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">John Doe</h4>
                <p className="text-gray-500">Georgetown</p>
              </div>
              <div className="ml-auto flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 italic">
              &quot;Easy Lawn Care has transformed my yard! Their service is reliable, professional, and the online booking makes it so convenient. I&apos;m a customer for life.&quot;
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 h-12 w-12 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-700 font-bold text-xl">JS</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Jane Smith</h4>
                <p className="text-gray-500">New Amsterdam</p>
              </div>
              <div className="ml-auto flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 italic">
              &quot;I&apos;ve tried several lawn care services, but Easy Lawn Care stands out. Their premium service with before and after photos gives me peace of mind, and the results are outstanding!&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
