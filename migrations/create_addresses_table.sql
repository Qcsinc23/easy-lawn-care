-- Create addresses table for Easy Lawn Care application
-- This table stores customer address information with Guyana-specific formatting

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

-- Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_addresses_clerk_user_id ON public.addresses(clerk_user_id);

-- Add comment to table
COMMENT ON TABLE public.addresses IS 'Customer addresses for lawn care service locations';

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Add row level security policies to restrict access to data
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- OPTION 1: Restrictive policies - only use if integrating Clerk JWT with Supabase Auth
-- Commented out by default since the application uses Clerk for authentication
-- 
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

-- OPTION 2: Permissive policy for Clerk integration
-- Allows all operations on the table
-- The application still filters by clerk_user_id in queries to ensure users only see their own data
CREATE POLICY "Allow all operations for authenticated users"
    ON public.addresses
    USING (true);
