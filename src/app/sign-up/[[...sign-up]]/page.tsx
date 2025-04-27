import { SignUp } from "@clerk/nextjs";

/**
 * @fileoverview Sign-up page component.
 * This page renders the Clerk Sign Up component, handling the user registration flow.
 * The route uses Next.js optional catch-all routes `[[...sign-up]]` to match `/sign-up` and `/sign-up/*`.
 */

/**
 * Renders the Clerk Sign Up component.
 * This component provides the UI and logic for user registration.
 * @returns {JSX.Element} The Clerk SignUp component.
 */
export default function Page() {
  return <SignUp />;
}
