# Legacy SQL Migrations

The SQL files in this directory are legacy migration files from the previous Supabase integration. They are kept for reference purposes but are no longer used for database migrations.

## Migration to Prisma

The application has been migrated from Supabase to Prisma ORM. For all new database changes, please use Prisma migrations instead of these SQL files.

## Using Prisma Migrations

1. Make changes to the `prisma/schema.prisma` file
2. Generate and apply a migration:
   ```bash
   npm run prisma:migrate
   ```

For a comprehensive guide on working with Prisma in this application, please refer to the `docs/PRISMA.md` file.

## Legacy SQL Files

These files are kept for historical reference:

- `create_addresses_table.sql` - Creates the addresses table schema
- `create_core_tables.sql` - Creates core application tables
- `create_custom_assessments_table.sql` - Creates the custom assessments table
- `fix_addresses_schema.sql` - Fixes for the addresses table schema

## Initializing Prisma Migrations

If you're setting up a new environment and need to initialize Prisma migrations:

1. Make sure your database is correctly configured in `.env.local` with the `DATABASE_URL`
2. Run the following command to initialize Prisma migrations based on your current schema:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Apply the migration:
   ```bash
   npx prisma migrate deploy
   ```

This will create a `prisma/migrations` directory with proper Prisma migration files.