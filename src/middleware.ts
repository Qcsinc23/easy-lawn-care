import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { syncUserProfileWithSupabase } from '@/lib/user-profile'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/booking(.*)',
  '/services(.*)',
  '/pricing(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth(); // Await auth() and destructure userId

    if (!userId) {
      // If user is not authenticated, redirect to sign-in
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Sync user profile if authenticated
    await syncUserProfileWithSupabase();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Exclude static files and _next
    '/', // Include the root path
  ],
}
