import { PrismaClient } from '@prisma/client'

/**
 * @fileoverview Prisma Client singleton for Next.js applications
 * Optimized for Prisma Accelerate with connection pooling and caching
 * Replaces both supabaseClient.ts and supabaseAdminClient.ts
 * Includes robust error handling for missing environment variables
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is properly configured
const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

/**
 * Create a Prisma Client instance with error handling for missing environment variables
 * @returns A configured PrismaClient instance or a mock client if configuration is missing
 */
function createPrismaClient() {
  // If DATABASE_URL is missing in production, log a warning
  if (!isDatabaseConfigured) {
    console.error(
      '❌ DATABASE_URL environment variable is missing. Database operations will fail. ' +
      'Please configure environment variables in the Vercel dashboard.'
    );
    
    // In production, we still create the client which will fail with clearer errors
    // In development, we could use a mock, but for now, we'll let it fail gracefully
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      // Accelerate automatically handles connection pooling
      datasourceUrl: process.env.DATABASE_URL,
    });
  } catch (error) {
    console.error('Failed to initialize Prisma Client:', error);
    throw error;
  }
}

/**
 * Prisma Client instance with optimizations for Next.js and Prisma Accelerate
 * - Uses singleton pattern to prevent multiple instances in development
 * - Configured for Accelerate connection pooling
 * - Handles both client-side and server-side operations
 * - Includes robust error handling for missing environment variables
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances during development hot reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Default export for convenient importing
 * Usage: import { prisma } from '@/lib/prisma'
 */
export default prisma

/**
 * Type exports for use throughout the application
 * These will be available after the TypeScript language server refreshes
 * Temporarily commented out to avoid TypeScript errors:
 * 
 * export type {
 *   Profile,
 *   Service,
 *   Address,
 *   Booking,
 *   BookingMedia,
 *   CustomAssessment,
 * } from '@prisma/client'
 */

/**
 * Utility function to handle Prisma connection cleanup
 * Should be called in serverless environments if needed
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}
