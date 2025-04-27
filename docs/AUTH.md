# Authentication Documentation

This document outlines the Clerk authentication integration for Easy Lawn Care.

## Implementation Details

Authentication is handled by Clerk (https://clerk.com):

1. Users can sign up/sign in with email or social providers
2. Protected routes require authentication
3. User profiles store customer information

## Protected Routes

The following routes require authentication:
- `/dashboard/*` - Customer dashboard
- `/booking` - Service booking (to access payment)

## User Attributes

The application stores the following user metadata:
- Address information
- Lawn details
- Service history
- Payment records
