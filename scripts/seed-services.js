// Seed services data into the database
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const seedServices = async () => {
  try {
    console.log('🌱 Seeding services data...\n');
    
    const services = [
      {
        name: 'Basic Lawn Care',
        description: 'Essential lawn maintenance including mowing, edging, and basic cleanup.',
        price: 25.00,
        features: ['Lawn mowing', 'Edge trimming', 'Basic cleanup'],
        includesMedia: false,
        isCustom: false,
        displayOrder: 1
      },
      {
        name: 'Premium Lawn Care',
        description: 'Comprehensive lawn care with fertilization and weed control.',
        price: 45.00,
        features: ['Everything in Basic', 'Fertilization', 'Weed control', 'Leaf removal'],
        includesMedia: true,
        isCustom: false,
        displayOrder: 2
      },
      {
        name: 'Deluxe Lawn Care',
        description: 'Premium service with landscaping and garden maintenance.',
        price: 65.00,
        features: ['Everything in Premium', 'Landscaping', 'Garden maintenance', 'Seasonal cleanup'],
        includesMedia: true,
        isCustom: false,
        displayOrder: 3
      },
      {
        name: 'Custom Service',
        description: 'Tailored lawn care solution based on your specific needs and property assessment.',
        price: null, // Price determined after assessment
        features: ['Personalized assessment', 'Custom treatment plan', 'Specialized equipment', 'Expert consultation'],
        includesMedia: true,
        isCustom: true,
        displayOrder: 4
      }
    ];
    
    // Create services
    for (const serviceData of services) {
      const service = await prisma.service.create({
        data: serviceData
      });
      console.log(`✅ Created service: ${service.name} (ID: ${service.id})`);
    }
    
    console.log(`\n🎉 Successfully seeded ${services.length} services!`);
    
  } catch (error) {
    console.error('❌ Error seeding services:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedServices();