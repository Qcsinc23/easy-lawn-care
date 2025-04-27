-- Easy Lawn Care - Schema Fix Script
-- Run this SQL script in your Supabase SQL Editor to:
--   1. Verify the addresses table exists
--   2. If not, create it with all required columns
--   3. Add any missing columns
--   4. Set up proper permissions

-- 1. First, check if the addresses table exists
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses'
  ) INTO table_exists;
  
  IF table_exists THEN
    RAISE NOTICE 'The addresses table exists.';
  ELSE
    RAISE NOTICE 'The addresses table does not exist!';
  END IF;
END $$;

-- 2. Show current column structure for addresses table (if it exists)
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' 
  AND table_name = 'addresses'
ORDER BY 
  ordinal_position;

-- 3. Re-create or ensure addresses table structure
-- DROP TABLE IF EXISTS public.addresses; -- Uncomment this line to drop and recreate (WARNING: removes all data)

CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT NOT NULL,
    street_address TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    postal_code TEXT,
    country TEXT NOT NULL DEFAULT 'Guyana',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Check for missing columns and add them if necessary
DO $$
BEGIN
  -- Check for 'area' column, which was missing
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'area'
  ) THEN
    ALTER TABLE public.addresses ADD COLUMN area TEXT;
    ALTER TABLE public.addresses ALTER COLUMN area SET NOT NULL;
    RAISE NOTICE 'Added missing column: area';
  END IF;
  
  -- Check for other potentially missing columns
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'street_address'
  ) THEN
    ALTER TABLE public.addresses ADD COLUMN street_address TEXT NOT NULL;
    RAISE NOTICE 'Added missing column: street_address';
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'city'
  ) THEN
    ALTER TABLE public.addresses ADD COLUMN city TEXT NOT NULL;
    RAISE NOTICE 'Added missing column: city';
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'region'
  ) THEN
    ALTER TABLE public.addresses ADD COLUMN region TEXT NOT NULL;
    RAISE NOTICE 'Added missing column: region';
  END IF;
  
  -- Check for the country column which appears to be missing
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'country'
  ) THEN
    ALTER TABLE public.addresses ADD COLUMN country TEXT NOT NULL DEFAULT 'Guyana';
    RAISE NOTICE 'Added missing column: country';
  END IF;
  
  -- Check for created_at and updated_at columns
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.addresses ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added missing column: created_at';
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.addresses ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added missing column: updated_at';
  END IF;
END $$;

-- 5. Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_addresses_clerk_user_id ON public.addresses(clerk_user_id);

-- 6. Add comment to table
COMMENT ON TABLE public.addresses IS 'Customer addresses for lawn care service locations';

-- 7. Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON public.addresses;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 8. Ensure Row Level Security (RLS) is enabled
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 9. Drop foreign key constraint on clerk_user_id if it exists
DO $$
BEGIN
  -- Check if the constraint exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'addresses_clerk_user_id_fkey'
    AND table_name = 'addresses'
  ) THEN
    ALTER TABLE public.addresses DROP CONSTRAINT addresses_clerk_user_id_fkey;
    RAISE NOTICE 'Removed foreign key constraint on clerk_user_id column';
  ELSE
    RAISE NOTICE 'No foreign key constraint named addresses_clerk_user_id_fkey found';
  END IF;
END $$;

-- Check for any other foreign key constraints on the clerk_user_id column
SELECT 
  tc.constraint_name, 
  tc.constraint_type,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE 
  tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'addresses' 
  AND EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = tc.constraint_name
    AND table_name = 'addresses'
    AND column_name = 'clerk_user_id'
  );

-- 10. Remove any existing RLS policies (to avoid duplicates) and create new ones
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.addresses;

-- 10. Create either granular RLS policies or a blanket policy based on your security needs
-- OPTION 1: Granular policies using Clerk user IDs (requires Supabase JWT integration with Clerk)
-- CREATE POLICY "Users can view their own addresses"
--     ON public.addresses
--     FOR SELECT
--     USING (auth.uid()::text = clerk_user_id);
-- 
-- CREATE POLICY "Users can insert their own addresses"
--     ON public.addresses
--     FOR INSERT
--     WITH CHECK (auth.uid()::text = clerk_user_id);
-- 
-- CREATE POLICY "Users can update their own addresses"
--     ON public.addresses
--     FOR UPDATE
--     USING (auth.uid()::text = clerk_user_id);
-- 
-- CREATE POLICY "Users can delete their own addresses"
--     ON public.addresses
--     FOR DELETE
--     USING (auth.uid()::text = clerk_user_id);

-- OPTION 2: Allow all operations for any authenticated user
-- This is simpler but less secure - good for development/testing
-- The app itself still enforces user-specific address visibility
CREATE POLICY "Allow all operations for authenticated users"
    ON public.addresses
    USING (true); -- Anyone can access this table

-- NOTE: We're allowing all operations because Clerk handles the authentication,
-- and we filter by clerk_user_id in our queries to ensure users only see their own data.
-- For production, consider implementing JWT verification between Clerk and Supabase.

-- 11. Give permission to anon and authenticated users
GRANT ALL ON public.addresses TO anon;
GRANT ALL ON public.addresses TO authenticated;

-- 12. Force PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

-- 13. Verify the final result - check if all the necessary columns exist
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public' 
  AND table_name = 'addresses'
ORDER BY 
  ordinal_position;

-- 14. First check which columns actually exist to avoid errors in the final query
DO $$
DECLARE
  column_list TEXT := '';
  has_id BOOLEAN;
  has_clerk_user_id BOOLEAN;
  has_street_address BOOLEAN;
  has_area BOOLEAN;
  has_city BOOLEAN;
  has_region BOOLEAN;
  has_postal_code BOOLEAN;
  has_country BOOLEAN;
BEGIN
  -- Check each column individually
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'id'
  ) INTO has_id;
  
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'clerk_user_id'
  ) INTO has_clerk_user_id;
  
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'street_address'
  ) INTO has_street_address;
  
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'area'
  ) INTO has_area;
  
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'city'
  ) INTO has_city;
  
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'region'
  ) INTO has_region;
  
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'postal_code'
  ) INTO has_postal_code;
  
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addresses' 
    AND column_name = 'country'
  ) INTO has_country;
  
  -- Report which columns exist
  RAISE NOTICE 'Column exists - id: %, clerk_user_id: %, street_address: %, area: %, city: %, region: %, postal_code: %, country: %', 
    has_id, has_clerk_user_id, has_street_address, has_area, has_city, has_region, has_postal_code, has_country;
END $$;

-- 15. Show a sample query as a test (using only id which should always exist)
SELECT id FROM public.addresses LIMIT 5;

-- 16. Print a completion message
DO $$
BEGIN
  RAISE NOTICE 'Schema fix script completed. The addresses table should now have all required columns.';
  RAISE NOTICE 'If you still see errors, you may need to manually recreate the table or restart the PostgREST service.';
END $$;
