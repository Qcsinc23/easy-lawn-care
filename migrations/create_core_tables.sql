-- Ensure the uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Table: profiles
-- Stores user profile information linked to Clerk users.
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    clerk_user_id text UNIQUE NOT NULL,
    phone_number text,
    notification_preference text CHECK (notification_preference IN ('sms', 'whatsapp', 'email', 'none')), -- Added email option
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policy for profiles: Users can manage their own profile.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow individual user access to their own profile" ON public.profiles;
CREATE POLICY "Allow individual user access to their own profile" ON public.profiles
    FOR ALL
    USING (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub'); -- Assumes JWT setup later, adjust if needed

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Table: services
-- Stores the different service tiers offered.
CREATE TABLE IF NOT EXISTS public.services (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    description text,
    price numeric(10, 2), -- Nullable for custom services
    features jsonb, -- Array of strings describing included features
    includes_media boolean DEFAULT false NOT NULL,
    is_custom boolean DEFAULT false NOT NULL,
    display_order smallint, -- Added for controlling order in UI
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policy for services: Allow public read access.
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to services" ON public.services;
CREATE POLICY "Allow public read access to services" ON public.services
    FOR SELECT
    USING (true);

-- Trigger for services updated_at
DROP TRIGGER IF EXISTS on_services_updated ON public.services;
CREATE TRIGGER on_services_updated
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Table: bookings
-- Stores booking information made by users.
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    clerk_user_id text NOT NULL, -- No FK constraint to profiles as Clerk is master
    service_id uuid NOT NULL REFERENCES public.services(id),
    address_id uuid NOT NULL REFERENCES public.addresses(id),
    booking_date date NOT NULL,
    booking_time time NOT NULL,
    status text NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')), -- Added Rescheduled
    price_at_booking numeric(10, 2) NOT NULL,
    customer_notes text,
    stripe_checkout_session_id text UNIQUE, -- Added unique constraint
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policy for bookings: Users can manage their own bookings. Admins can access all.
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow individual user access to their own bookings" ON public.bookings;
CREATE POLICY "Allow individual user access to their own bookings" ON public.bookings
    FOR ALL
    USING (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub'); -- Assumes JWT setup later

-- Add admin access policy later if needed, or use service_role key.

-- Trigger for bookings updated_at
DROP TRIGGER IF EXISTS on_bookings_updated ON public.bookings;
CREATE TRIGGER on_bookings_updated
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Table: booking_media
-- Stores paths to media files (before/after photos/videos) associated with bookings.
CREATE TABLE IF NOT EXISTS public.booking_media (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    storage_path text NOT NULL, -- Path in Supabase Storage
    file_type text, -- e.g., 'image/jpeg', 'video/mp4'
    media_type text NOT NULL CHECK (media_type IN ('before', 'after')),
    uploaded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policy for booking_media: Users can view media for their own bookings. Admins can manage all.
ALTER TABLE public.booking_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow user access to their booking media" ON public.booking_media;
CREATE POLICY "Allow user access to their booking media" ON public.booking_media
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.bookings b
            WHERE b.id = booking_media.booking_id
            AND b.clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub'
        )
    );

-- Add admin access policy later if needed, or use service_role key.

-- Populate the services table
-- Clear existing services first to avoid duplicates if script is run multiple times
DELETE FROM public.services;

INSERT INTO public.services (name, description, price, features, includes_media, is_custom, display_order) VALUES
(
    'Essential Tidy-Up',
    'Affordable basic upkeep.',
    25.00,
    '["Lawn Mowing", "Hard Surface Blow-Off (Driveways, Sidewalks)"]'::jsonb,
    false,
    false,
    10
),
(
    'Complete Look',
    'Full service for a pristine lawn.',
    50.00,
    '["Lawn Mowing", "Hard Surface Blow-Off (Driveways, Sidewalks)", "Precise Edging (Concrete/Paved Edges)", "Clipping Removal (Bagged & Hauled Away)"]'::jsonb,
    false,
    false,
    20
),
(
    'Premium Care & Assurance',
    'The best care + photo proof.',
    75.00,
    '["Lawn Mowing", "Hard Surface Blow-Off (Driveways, Sidewalks)", "Precise Edging (Concrete/Paved Edges)", "Clipping Removal (Bagged & Hauled Away)", "Spot Weed Treatment (Minor, Visible Weeds)¹", "Before/After Photos (Viewable in Dashboard)"]'::jsonb,
    true,
    false,
    30
),
(
    'Custom Services',
    'Tailored for unique needs.',
    NULL, -- Price is custom
    '["Free In-Person Assessment"]'::jsonb, -- Feature list indicates assessment
    false, -- Media inclusion depends on assessment
    true,
    40
);

-- Note: RLS policies using current_setting('request.jwt.claims', true)::jsonb ->> 'sub'
-- assume you will configure Supabase to trust your Clerk JWTs.
-- If not using JWT integration, you might need different RLS policies or handle authorization
-- primarily in your application backend using the service_role key for admin actions
-- and filtering user data based on clerk_user_id passed from authenticated sessions.
-- The existing RLS on the 'addresses' table might also need review based on the chosen auth strategy.
