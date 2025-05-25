import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

/**
 * @fileoverview API routes for service management
 * Handles fetching available services
 * Includes enhanced error handling for database connection issues
 */

/**
 * Check if required environment variables are configured
 * @returns Object containing environment status and error message if applicable
 */
function checkEnvironmentConfig() {
  const missingVars = [];
  
  if (!process.env.DATABASE_URL) missingVars.push('DATABASE_URL');
  
  const isConfigValid = missingVars.length === 0;
  
  return {
    isValid: isConfigValid,
    message: isConfigValid ? 'Environment configured properly' : 
      `Missing required environment variables: ${missingVars.join(', ')}. Please configure these in your Vercel deployment settings.`
  };
}

/**
 * GET /api/services
 * Fetch all available services
 * This endpoint is public as services are displayed to all users
 * Includes enhanced error handling for database connection issues
 */
export async function GET() {
  // Check environment configuration first
  const envConfig = checkEnvironmentConfig();
  if (!envConfig.isValid) {
    console.error(`Environment configuration error: ${envConfig.message}`);
    return NextResponse.json(
      { 
        error: 'Server configuration error', 
        message: 'The server is missing required configuration. Please contact the administrator.',
        details: process.env.NODE_ENV === 'development' ? envConfig.message : undefined
      },
      { status: 500 }
    );
  }
  
  try {
    try {
      // Fetch all services ordered by display order
      const services = await prisma.service.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          features: true,
          includesMedia: true,
          isCustom: true,
          displayOrder: true
        },
        orderBy: {
          displayOrder: 'asc'
        }
      });

      // Convert price from Decimal to number for frontend compatibility
      const servicesWithNumericPrice = services.map((service: {
        id: string;
        name: string;
        description: string | null;
        price: unknown;
        features: unknown;
        includesMedia: boolean | null;
        isCustom: boolean | null;
        displayOrder: number | null;
      }) => ({
        ...service,
        price: service.price ? parseFloat(service.price.toString()) : null
      }));

      return NextResponse.json({
        success: true,
        services: servicesWithNumericPrice
      });
    } catch (dbError) {
      // Handle database-specific errors
      console.error('Database operation error:', dbError);
      
      if (dbError instanceof PrismaClientInitializationError) {
        return NextResponse.json(
          { 
            error: 'Database connection error', 
            message: 'Unable to connect to the database. The server may be misconfigured.',
            details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
          },
          { status: 500 }
        );
      }
      
      throw dbError; // Re-throw for general error handling
    }
  } catch (error: unknown) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch services', 
        message: 'An error occurred while retrieving service information. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
