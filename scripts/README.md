# EasyLawnCare Database Utility Scripts

This directory contains utility scripts for working with the Prisma database and other development tasks.

## Prerequisites

- Node.js and npm installed
- Prisma CLI (installed as a dev dependency)
- PostgreSQL database (configured via `DATABASE_URL` in `.env.local`)

## Available Scripts

### Database Verification Scripts

#### `check-bookings-comprehensive.js`
**Primary booking verification script** - A comprehensive tool for examining booking data.

```bash
# Run the comprehensive booking check
node scripts/check-bookings-comprehensive.js
```

Features:
- Displays detailed booking information with relationships (service, address, profile, media)
- Shows formatted output with emojis for easy reading
- Includes summary statistics (status counts, total revenue)
- Handles error reporting with stack traces
- Displays up to 10 most recent bookings

#### `check-bookings.js`
**Alternative booking check** - A simpler booking verification script.

```bash
# Run the basic booking check
node scripts/check-bookings.js
```

Features:
- Basic booking information display
- Uses selective field querying for performance
- Shows up to 10 most recent bookings

### Migration Scripts

#### `apply-migration.js` & `apply-migration-direct.js`
Legacy migration scripts from the Supabase era. These are kept for reference but are no longer actively used since migrating to Prisma.

#### `apply-migration.ps1`
PowerShell migration script for Windows users during the Supabase era.

### Development Scripts

#### `simulate-webhook-event.js`
Simulates Stripe webhook events for testing payment processing.

```bash
# Simulate a webhook event
node scripts/simulate-webhook-event.js
```

## Prisma Database Management

### Running Migrations

The application now uses Prisma for database management. The migrations are stored in `prisma/migrations/` and managed through Prisma CLI:

```bash
# Apply pending migrations
npx prisma migrate deploy

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (development only)
npx prisma migrate reset
```

### Database Introspection

```bash
# Generate Prisma client
npx prisma generate

# View current database schema
npx prisma db pull

# Open Prisma Studio for GUI database management
npx prisma studio
```

## Database Schema

The application uses the following main tables:
- `profiles` - User profiles linked to Clerk authentication
- `services` - Available lawn care services
- `addresses` - Customer service locations
- `bookings` - Scheduled service appointments
- `booking_media` - Before/after photos
- `custom_assessments` - Custom service assessment requests

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Verify `DATABASE_URL` in `.env.local` is correct
   - Ensure database is accessible
   - Check Prisma client is generated: `npx prisma generate`

2. **Migration Issues**
   - Check migration history: `npx prisma migrate status`
   - Resolve drift: `npx prisma migrate resolve`
   - For development: `npx prisma migrate reset`

3. **Script Execution Issues**
   - Ensure you're running from the project root
   - Verify Node.js dependencies are installed: `npm install`
   - Check that `.env.local` exists and contains required variables

### Verifying Database State

After making changes or debugging issues:

1. **Check Bookings**: Run `node scripts/check-bookings-comprehensive.js`
2. **Prisma Studio**: Run `npx prisma studio` for GUI access
3. **Direct Query**: Use your database client or Prisma Studio

## Environment Configuration

Required environment variables in `.env.local`:
```
DATABASE_URL="your_postgresql_connection_string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
CLERK_SECRET_KEY="your_clerk_secret"
```

## Migration from Supabase

This project was successfully migrated from Supabase to Prisma. The following changes were made:

1. **Database Client**: Switched from `@supabase/supabase-js` to `@prisma/client`
2. **Schema Management**: Converted SQL migrations to Prisma schema
3. **Query Interface**: Updated all database queries to use Prisma syntax
4. **Authentication**: Maintained Clerk integration with updated database queries
5. **Script Consolidation**: Removed duplicate scripts and created comprehensive alternatives

For development, use the Prisma workflow instead of direct SQL migrations.
