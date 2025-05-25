import { PrismaClient } from '@prisma/client'

/**
 * @fileoverview Prisma Client singleton for Next.js applications
 * Optimized for Prisma Accelerate with connection pooling and caching
 * Replaces both supabaseClient.ts and supabaseAdminClient.ts
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client instance with optimizations for Next.js and Prisma Accelerate
 * - Uses singleton pattern to prevent multiple instances in development
 * - Configured for Accelerate connection pooling
 * - Handles both client-side and server-side operations
 * - Replaces the need for separate admin/client instances
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Accelerate automatically handles connection pooling
    datasourceUrl: process.env.DATABASE_URL,
  })

// Prevent multiple instances during development hot reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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
