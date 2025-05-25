# [DEPRECATED] Supabase Integration Guide for Easy Lawn Care

> **IMPORTANT: This document is deprecated**  
> The application has been migrated from Supabase to Prisma ORM.  
> Please refer to [PRISMA.md](./PRISMA.md) for current database documentation.

This document is kept for historical reference only. It provides information about the previous Supabase integration in the Easy Lawn Care application, including setup instructions, database structure, and troubleshooting guidance that are no longer applicable.

## Database Setup

### Creating the Addresses Table

The application requires an `addresses` table to store customer address information. You need to execute the SQL script located at `migrations/create_addresses_table.sql` in your Supabase database.

#### Option 1: Using the Supabase Dashboard (Recommended)

1. Log in to your [Supabase Dashboard](https://app.supabase.io)
2. Select your project
3. Go to the "SQL Editor" section
4. Create a new query
5. Copy and paste the contents of `migrations/create_addresses_table.sql`
6. Run the query

### Fixing Schema Issues (If Needed)

If you encounter schema-related errors (e.g., PGRST204 errors, missing columns):

1. Log in to your [Supabase Dashboard](https://app.supabase.io)
2. Select your project
3. Go to the "SQL Editor" section
4. Create a new query
5. Copy and paste the contents of `migrations/fix_addresses_schema.sql`
6. Run the query
7. Refresh your application

#### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to the project directory
cd easy-lawn-care

# Apply the migration
supabase db diff -f create_addresses_table --use-migra
```

## Database Structure

### Addresses Table

The `addresses` table stores customer address information with Guyana-specific formatting:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| clerk_user_id | TEXT | User ID from Clerk authentication |
| street_address | TEXT | Lot/House number and street name |
| area | TEXT | Area/Village/Community |
| city | TEXT | City or town |
| region | TEXT | One of Guyana's 10 administrative regions |
| postal_code | TEXT | Optional postal code |
| country | TEXT | Country (defaults to 'Guyana') |
| created_at | TIMESTAMP | Auto-generated creation timestamp |
| updated_at | TIMESTAMP | Auto-updated modification timestamp |

## Row-Level Security

The `addresses` table has Row-Level Security (RLS) policies enabled, ensuring users can only access their own address data:

- Users can view only their own addresses
- Users can insert only their own addresses
- Users can update only their own addresses
- Users can delete only their own addresses

## Auth Integration with Clerk

Since the application uses Clerk for authentication rather than Supabase Auth, we use the `clerk_user_id` field to associate addresses with users instead of the Supabase `auth.uid()`. 

For the Row-Level Security policies to work correctly with Clerk authentication in client-side requests:
1. The Clerk user ID must be passed to Supabase in the `clerk_user_id` field when inserting/updating records
2. The RLS policies check if the `clerk_user_id` matches the user's ID

## Troubleshooting

### Schema Cache Errors (PGRST204)

If you see errors like `Database error (PGRST204): Could not find the 'area' column of 'addresses' in the schema cache`, this indicates a PostgREST schema cache issue:

1. **What's happening**: PostgREST (which powers Supabase's API) caches the database schema for performance. Sometimes this cache becomes stale and doesn't recognize newly added tables or columns.

2. **Quick Solution**: 
   - Run the fix script: Execute `migrations/fix_addresses_schema.sql` in the SQL Editor
   - Restart API: In your Supabase dashboard, go to Settings > API > Restart PostgREST

3. **Manual Verification**:
   - Check if the table exists: `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'addresses');`
   - Check columns: `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'addresses';`

4. **Application Support**:
   - The application includes a schema refresh utility in `src/lib/refresh-schema.ts` that attempts to refresh the schema cache automatically

### Row-Level Security (RLS) Issues

If you see errors like `Database error (42501): new row violates row-level security policy for table "addresses"`, this is a Row-Level Security policy issue:

1. **What's happening**: Supabase uses Row-Level Security to control which rows users can access. Since we're using Clerk for authentication (not Supabase Auth), the default RLS policies that check against `auth.uid()` won't work correctly.

2. **Quick Solution**:
   - Run the fix script: Execute `migrations/fix_addresses_schema.sql` in the SQL Editor
   - This script creates a more permissive RLS policy suitable for use with Clerk authentication

3. **Security Considerations**:
   - The fix script implements an "allow all" RLS policy that permits all operations on the table
   - This is suitable for development but less secure for production
   - The application still filters by `clerk_user_id` in queries to ensure users only see their own data
   - For production, consider implementing JWT integration between Clerk and Supabase

4. **Alternative Solutions**:
   - **Option 1 (Easy)**: Use service role key for database operations (bypasses RLS)
   - **Option 2 (Secure)**: Set up JWT verification between Clerk and Supabase
   - **Option 3 (Compromise)**: Keep permissive RLS and ensure proper filtering in application code

### Foreign Key Constraint Issues

If you see errors like `Database error (23503): insert or update on table "addresses" violates foreign key constraint "addresses_clerk_user_id_fkey"`:

1. **What's happening**: The database has a foreign key constraint on the `clerk_user_id` column, attempting to reference another table (likely `auth.users`). Since we're using Clerk for authentication and not Supabase Auth, this foreign key relationship is invalid.

2. **Quick Solution**:
   - Run the fix script: Execute `migrations/fix_addresses_schema.sql` in the SQL Editor
   - The script will detect and remove the problematic foreign key constraint

3. **How to Verify the Fix**:
   - Check if the constraint exists by running:
   ```sql
   SELECT constraint_name
   FROM information_schema.table_constraints 
   WHERE constraint_name = 'addresses_clerk_user_id_fkey'
   AND table_name = 'addresses';
   ```
   - After running the fix script, this query should return zero rows

4. **Why This Happens**:
   - This occurs when trying to integrate Clerk user IDs with Supabase's default auth system
   - Clerk user IDs won't exist in Supabase auth tables, causing inserts/updates to fail

### Other Connection Issues

If you encounter other connection issues:

1. Verify your environment variables in `.env.local` contain the correct Supabase URL and API keys
2. Check the browser console for specific error messages
3. Ensure your Supabase service is active and the database is available
4. Verify the `addresses` table exists and has the correct schema
5. Test connection with a simple query in the SQL Editor: `SELECT NOW();`
