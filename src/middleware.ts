import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';

/**
 * @fileoverview Next.js middleware using Clerk for authentication and route protection.
 * It ensures users are logged in to access specific parts of the application
 * and synchronizes their profile data with the database upon access.
 */

/**
 * Creates a matcher function to identify protected routes.
 * Routes matching these patterns require user authentication.
 * Uses Clerk's `createRouteMatcher` for pattern matching.
 */
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protects the user dashboard and all its sub-routes.
  '/booking(.*)',   // Protects the booking flow pages.
  '/services(.*)',  // Protects service-related pages (if they require login).
  '/pricing(.*)',   // Protects pricing pages (if they require login, e.g., custom plans).
]);

/**
 * Checks if the route is the success page with simulation mode.
 * This allows testing the success page without requiring authentication.
 * @param {NextRequest} req - The request object
 * @returns {boolean} - True if it's a simulation request that should bypass auth
 */
function isSimulationRequest(req: NextRequest): boolean {
  const url = new URL(req.url);
  return url.pathname === '/booking/success' && 
         (url.searchParams.has('simulate') || url.searchParams.has('test'));
}

/**
 * The main Clerk middleware function.
 * This function is executed for requests matching the `config.matcher` patterns.
 *
 * Workflow:
 * 1. Checks if the requested route is protected using `isProtectedRoute`.
 * 2. If protected:
 *    a. Calls `auth()` provided by `clerkMiddleware` to check the user's authentication status.
 *       Note: `auth()` itself handles session validation. We await its result.
 *    b. If the user is not authenticated (`!userId`), redirects them to the `/sign-in` page,
 *       preserving the original URL they tried to access (`redirect_url`).
 *    c. If the user is authenticated (`userId` exists), it attempts to synchronize their
 *       Clerk profile data with the Supabase `profiles` table using `syncUserProfileWithSupabase`.
 *       Errors during sync are logged but currently do not block access.
 * 3. If the route is not protected, or if the user is authenticated for a protected route,
 *    it allows the request to proceed using `NextResponse.next()`.
 *
 * @param {Function} auth - The `auth` function provided by `clerkMiddleware` to access authentication state.
 * @param {Function} auth - The `auth` function provided by `clerkMiddleware`. Calling `await auth()` retrieves the
 *   authentication state for the current request, returning an object containing `userId` if authenticated.
 * @param {NextRequest} req - The incoming Next.js request object, containing details about the request path, headers, etc.
 * @returns {Promise<NextResponse>} A promise resolving to a NextResponse object. This will typically be:
 *   - `NextResponse.redirect()`: If the user is unauthenticated and trying to access a protected route.
 *   - `NextResponse.next()`: If the route is public, or if the user is authenticated for a protected route
 *     (after attempting profile sync).
 */
export default clerkMiddleware(async (auth, req: NextRequest): Promise<NextResponse> => {
  // Check if this is a simulation request that should bypass auth
  if (isSimulationRequest(req)) {
    console.log(`Allowing simulation request: ${req.url}`);
    return NextResponse.next();
  }
  
  // Check if the current request path matches any of the defined protected routes.
  if (isProtectedRoute(req)) {
    // If it's a protected route, retrieve the authentication state.
    // `await auth()` resolves with the auth context, including `userId` if logged in.
    const { userId } = await auth();

    // If userId is null or undefined, the user is not authenticated for this request.
    if (!userId) {
      // Log the attempt and prepare a redirect response to the sign-in page.
      console.log(`Unauthenticated access attempt to protected route: ${req.url}`);
      const signInUrl = new URL('/sign-in', req.url);
      // Append the original path as 'redirect_url' so Clerk can redirect back after successful sign-in.
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }

    // If userId exists, the user is authenticated.
    // Note: We can't sync profiles in middleware due to Edge Runtime limitations with Prisma.
    // Profile sync will be handled by the individual API routes that need it.
    console.log(`Authenticated user ${userId} accessing protected route: ${req.url}.`);
  }

  // If the route is not protected, or if the user is authenticated (and profile sync attempted),
  // allow the request to proceed to the intended page or API route.
  return NextResponse.next();
});

/**
 * Configuration for the Next.js Edge Middleware.
 * The `matcher` array defines the request paths on which this middleware function will execute.
 * It's configured to run on most application routes while excluding static assets and API endpoints.
 *
 * Explanation of the primary matcher pattern: `/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)`
 * - `/`: Matches the start of the path.
 * - `(...)`: Capturing group for the entire path matched.
 * - `(?!...)`: Negative lookahead. Asserts that the following patterns *do not* match at the current position.
 *   - `_next/static`: Excludes Next.js internal static file routes.
 *   - `_next/image`: Excludes Next.js image optimization routes.
 *   - `favicon.ico`: Excludes the favicon file request.
 *   - `api/`: Excludes all API routes under `/api/`. Authentication for APIs might be handled differently (e.g., token-based).
 *   - `.*\\..*`: Excludes paths that contain a dot (`.`), typically indicating a file extension (e.g., `logo.png`, `styles.css`). This helps avoid running middleware on direct asset requests.
 * - `.*`: After the negative lookahead confirms none of the exclusions match, this matches any sequence of characters (the actual path).
 *
 * The second matcher `'/'` explicitly includes the root path.
 * We also explicitly add specific API routes like `/api/assessments` that require authentication.
 */
export const config = {
  matcher: [
    // Match non-API, non-static routes
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)',
    // Explicitly match the root
    '/',
    // Explicitly include API routes that need Clerk authentication
    '/api/assessments',
    '/api/stripe/create-checkout',
    '/api/bookings',
    '/api/addresses',
    '/api/services'
  ],
};
