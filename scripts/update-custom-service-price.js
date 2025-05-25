const { PrismaClient } = require('@prisma/client');

async function updateCustomServicePrice() {
  const prisma = new PrismaClient();

  try {
    console.log('Updating custom service price to $5.00...');

    // Update the custom service price
    const result = await prisma.service.updateMany({
      where: {
        isCustom: true
      },
      data: {
        price: 5.00
      }
    });

    console.log(`Updated ${result.count} custom service(s) with new price of $5.00`);

    // Verify the update
    const customServices = await prisma.service.findMany({
      where: {
        isCustom: true
      },
      select: {
        id: true,
        name: true,
        price: true,
        isCustom: true
      }
    });

    console.log('Updated custom services:');
    customServices.forEach(service => {
      console.log(`- ${service.name}: $${service.price}`);
    });

  } catch (error) {
    console.error('Error updating custom service price:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCustomServicePrice();