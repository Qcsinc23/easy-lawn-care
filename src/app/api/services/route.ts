import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @fileoverview API routes for service management
 * Handles fetching available services
 * Replaces direct Supabase client calls with secure server-side operations
 */

/**
 * GET /api/services
 * Fetch all available services
 * This endpoint is public as services are displayed to all users
 */
export async function GET() {
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
    
  } catch (error: unknown) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
