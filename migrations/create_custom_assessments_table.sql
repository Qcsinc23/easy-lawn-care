-- Create custom_assessments table to store assessment requests for custom services

CREATE TABLE IF NOT EXISTS public.custom_assessments (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    clerk_user_id text NOT NULL,
    service_id uuid NOT NULL REFERENCES public.services(id),
    address_id uuid NOT NULL REFERENCES public.addresses(id),
    preferred_date date NOT NULL,
    preferred_time text NOT NULL CHECK (preferred_time IN ('morning', 'afternoon')),
    assessment_data jsonb NOT NULL,
    status text NOT NULL CHECK (status IN ('Pending', 'Scheduled', 'Completed', 'Cancelled')),
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS on_custom_assessments_updated ON public.custom_assessments;
CREATE TRIGGER on_custom_assessments_updated
  BEFORE UPDATE ON public.custom_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policy: Users can access only their own assessment requests
ALTER TABLE public.custom_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow individual user access to their own assessment requests" ON public.custom_assessments;
CREATE POLICY "Allow individual user access to their own assessment requests" ON public.custom_assessments
    FOR ALL
    USING (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb ->> 'sub');

-- Create index for faster querying by user
CREATE INDEX IF NOT EXISTS idx_custom_assessments_clerk_user_id ON public.custom_assessments(clerk_user_id);
