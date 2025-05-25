# Prisma Integration Guide for Easy Lawn Care

This document provides information about the Prisma integration in the Easy Lawn Care application, including setup instructions, database structure, and usage guidance.

## Database Setup

The application uses Prisma ORM to interact with a PostgreSQL database. The database schema is defined in `prisma/schema.prisma`.

### Initial Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Create or update `.env.local` with the following variables:
     ```
     DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your_prisma_accelerate_api_key"
     ```

3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

### Database Migrations

For new database changes, use Prisma migrations:

1. Make changes to the `prisma/schema.prisma` file
2. Generate and apply the migration:
   ```bash
   npm run prisma:migrate
   ```

### Prisma Studio

To explore the database using Prisma Studio:

```bash
npm run prisma:studio
```

## Database Structure

The database includes the following main models:

### Profile Model

Stores user profile information linked to Clerk authentication:

```prisma
model Profile {
  id                      String   @id @default(uuid())
  clerkUserId            String   @unique @map("clerk_user_id")
  phoneNumber            String?  @map("phone_number")
  notificationPreference String?  @map("notification_preference")
  createdAt              DateTime @default(now()) @map("created_at")
  updatedAt              DateTime @updatedAt @map("updated_at")

  // Relations
  bookings               Booking[]
  addresses              Address[]
  customAssessments      CustomAssessment[]

  @@map("profiles")
}
```

### Address Model

Stores customer address information with Guyana-specific formatting:

```prisma
model Address {
  id            String   @id @default(uuid())
  clerkUserId   String   @map("clerk_user_id")
  streetAddress String   @map("street_address")
  area          String
  city          String
  region        String
  postalCode    String?  @map("postal_code")
  country       String   @default("Guyana")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  profile           Profile            @relation(fields: [clerkUserId], references: [clerkUserId])
  bookings          Booking[]
  customAssessments CustomAssessment[]

  @@map("addresses")
}
```

### Service Model

Represents service tiers offered by the company:

```prisma
model Service {
  id            String   @id @default(uuid())
  name          String
  description   String?
  price         Decimal? @db.Decimal(10, 2)
  features      Json?    @db.JsonB
  includesMedia Boolean  @default(false) @map("includes_media")
  isCustom      Boolean  @default(false) @map("is_custom")
  displayOrder  Int?     @map("display_order") @db.SmallInt
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  bookings          Booking[]
  customAssessments CustomAssessment[]

  @@map("services")
}
```

### Booking Model

Records for scheduled services:

```prisma
model Booking {
  id                       String   @id @default(uuid())
  clerkUserId             String   @map("clerk_user_id")
  serviceId               String   @map("service_id")
  addressId               String   @map("address_id")
  bookingDate             DateTime @map("booking_date") @db.Date
  bookingTime             DateTime @map("booking_time") @db.Time
  status                  String   @default("Scheduled")
  priceAtBooking          Decimal  @map("price_at_booking") @db.Decimal(10, 2)
  customerNotes           String?  @map("customer_notes")
  stripeCheckoutSessionId String?  @unique @map("stripe_checkout_session_id")
  createdAt               DateTime @default(now()) @map("created_at")
  updatedAt               DateTime @updatedAt @map("updated_at")

  // Relations
  profile      Profile       @relation(fields: [clerkUserId], references: [clerkUserId])
  service      Service       @relation(fields: [serviceId], references: [id])
  address      Address       @relation(fields: [addressId], references: [id])
  bookingMedia BookingMedia[]

  @@map("bookings")
}
```

For the complete schema, refer to `prisma/schema.prisma`.

## Usage in the Application

### Initializing the Prisma Client

The application uses a singleton pattern for the Prisma client to prevent connection issues in development:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

### Using the Prisma Client in API Routes

Example of using Prisma in API routes:

```typescript
// src/app/api/addresses/route.ts
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        clerkUserId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ addresses });
  } catch (error: any) {
    // Handle errors
  }
}
```

### Common Query Patterns

#### Finding a Single Record

```typescript
const user = await prisma.profile.findUnique({
  where: {
    clerkUserId: 'user_123'
  }
});
```

#### Finding Multiple Records with Filtering

```typescript
const bookings = await prisma.booking.findMany({
  where: {
    clerkUserId: user.id,
    status: 'Scheduled'
  },
  orderBy: {
    bookingDate: 'asc'
  }
});
```

#### Creating a Record

```typescript
const newAddress = await prisma.address.create({
  data: {
    clerkUserId: user.id,
    streetAddress: '123 Main St',
    area: 'Georgetown',
    city: 'Georgetown',
    region: 'Region 4',
    country: 'Guyana'
  }
});
```

#### Updating a Record

```typescript
const updatedBooking = await prisma.booking.update({
  where: {
    id: bookingId
  },
  data: {
    status: 'Completed'
  }
});
```

#### Deleting a Record

```typescript
const deletedAddress = await prisma.address.delete({
  where: {
    id: addressId
  }
});
```

#### Relations and Includes

```typescript
const bookingsWithDetails = await prisma.booking.findMany({
  where: {
    clerkUserId: user.id
  },
  include: {
    service: true,
    address: true
  }
});
```

## Utility Scripts

The application includes several utility scripts in the `scripts/` directory that use Prisma:

- `check-bookings.js` - Directly queries bookings using the Prisma client
- `check-bookings-client.js` - Alternative script for checking bookings
- `simulate-webhook-event.js` - Creates test bookings for webhook testing

## Troubleshooting

### Connection Issues

If you encounter database connection issues:

1. Verify your environment variables in `.env.local` contain the correct DATABASE_URL
2. Check the Prisma Accelerate dashboard for connection issues
3. Try restarting the application

### Schema Generation

If you encounter issues with the Prisma client:

1. Run `npm run prisma:generate` to regenerate the client
2. Check for syntax errors in the schema file

### Prisma Studio Connection

If Prisma Studio fails to connect:

1. Ensure you have the correct DATABASE_URL in your environment variables
2. If using Prisma Accelerate, make sure your API key is valid
3. Check if your firewall is blocking connections

## Best Practices

1. **Use the singleton pattern**: Import the Prisma client from `src/lib/prisma.ts` instead of creating new instances
2. **Handle disconnection**: Use `prisma.$disconnect()` in serverless functions after completing database operations
3. **Transactions**: Use `prisma.$transaction` for operations that need to be atomic
4. **Error handling**: Always wrap Prisma operations in try/catch blocks
5. **Data validation**: Validate data before sending it to Prisma to avoid constraint errors