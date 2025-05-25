// Check services in database using Prisma
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const checkServices = async () => {
  try {
    console.log('🔍 Checking services in database...\n');
    
    // Fetch all services
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    
    if (!services || services.length === 0) {
      console.log('❌ No services found in the database.');
      console.log('This is why the service dropdown is empty.\n');
      return;
    }
    
    console.log(`✅ Found ${services.length} service(s):\n`);
    
    services.forEach((service, index) => {
      console.log(`--- Service ${index + 1} ---`);
      console.log(`📌 ID: ${service.id}`);
      console.log(`📝 Name: ${service.name}`);
      console.log(`📄 Description: ${service.description || 'None'}`);
      console.log(`💰 Price: $${service.price || 'N/A'}`);
      console.log(`🎯 Custom: ${service.isCustom ? 'Yes' : 'No'}`);
      console.log(`📊 Display Order: ${service.displayOrder || 'N/A'}`);
      console.log(`🎬 Includes Media: ${service.includesMedia ? 'Yes' : 'No'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error querying services:', error);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};

checkServices();