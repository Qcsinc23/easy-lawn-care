import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="/images/lawn-hero.jpg" 
          alt="Beautiful lawn" 
          fill 
          priority
          className="object-cover"
        />
        {/* Green-tinted overlay */}
        <div className="absolute inset-0 bg-green-900/30"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
          Pristine Lawns Made Easy in Guyana
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl drop-shadow-md">
          Select your service, book online in minutes, and enjoy a beautiful lawn. Starting at $25.
        </p>
        
        <Link 
          href="/services" 
          className="bg-white hover:bg-gray-100 text-green-700 font-bold py-3 px-8 rounded-lg shadow-md text-lg transition duration-300"
        >
          Book Your Service Now
        </Link>
      </div>
    </div>
  );
}
