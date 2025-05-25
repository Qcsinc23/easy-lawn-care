#!/usr/bin/env node

/**
 * @fileoverview Cleanup script to remove duplicate services from the database
 * This script identifies and removes duplicate services, keeping only one of each type
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDuplicateServices() {
  try {
    console.log('🧹 Starting cleanup of duplicate services...');

    // Fetch all services grouped by name and price
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'asc' // Keep the oldest entry for each service type
      }
    });

    console.log(`📋 Found ${services.length} total services`);

    // Group services by name and key characteristics
    const serviceGroups = {};
    
    for (const service of services) {
      const key = `${service.name}_${service.price}_${service.isCustom}`;
      
      if (!serviceGroups[key]) {
        serviceGroups[key] = [];
      }
      serviceGroups[key].push(service);
    }

    let duplicatesRemoved = 0;

    // Remove duplicates, keeping only the first (oldest) entry
    for (const [key, group] of Object.entries(serviceGroups)) {
      if (group.length > 1) {
        console.log(`🔍 Found ${group.length} duplicates for: ${group[0].name}`);
        
        // Keep the first service, delete the rest
        const toDelete = group.slice(1);
        
        for (const service of toDelete) {
          console.log(`   🗑️  Deleting duplicate: ${service.name} (ID: ${service.id})`);
          await prisma.service.delete({
            where: { id: service.id }
          });
          duplicatesRemoved++;
        }
      }
    }

    console.log(`\n✅ Cleanup completed!`);
    console.log(`   📊 Total services before: ${services.length}`);
    console.log(`   🗑️  Duplicates removed: ${duplicatesRemoved}`);
    console.log(`   📊 Services remaining: ${services.length - duplicatesRemoved}`);

    // Show remaining services
    const remainingServices = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' }
    });

    console.log('\n📋 Remaining services:');
    remainingServices.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} - $${service.price} ${service.isCustom ? '(Custom)' : ''}`);
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupDuplicateServices()
  .then(() => {
    console.log('\n🎉 Database cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error);
    process.exit(1);
  });
