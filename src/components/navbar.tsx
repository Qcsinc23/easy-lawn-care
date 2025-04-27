'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const { user, isLoaded } = useUser();

  return (
    <nav className="bg-green-700 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Easy Lawn Care
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/services" className="hover:underline">
            Services
          </Link>
          <Link href="/booking" className="hover:underline">
            Book Now
          </Link>
          {isLoaded && user && (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
          {isLoaded && !user && (
            <>
              <SignInButton mode="modal">
                <button className="hover:underline">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="hover:underline">Sign Up</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
