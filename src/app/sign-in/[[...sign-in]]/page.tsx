import { SignIn } from "@clerk/nextjs";

/**
 * @fileoverview Sign-in page component.
 * This page renders the Clerk Sign In component, handling the user authentication flow.
 * The route uses Next.js optional catch-all routes `[[...sign-in]]` to match `/sign-in` and `/sign-in/*`.
 */

/**
 * Renders the Clerk Sign In component.
 * This component provides the UI and logic for user sign-in.
 * @returns {JSX.Element} The Clerk SignIn component.
 */
export default function Page() {
  return <SignIn />;
}
