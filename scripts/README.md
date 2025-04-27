# EasyLawnCare Database Migration Scripts

This directory contains scripts to apply database migrations to your Supabase database using the Supabase CLI.

## Prerequisites

- Bash shell (Git Bash or WSL on Windows)
- Supabase CLI (the script will attempt to install it if not found)
- Supabase project URL and service role key (already configured in `.env.local`)

## Running the Migration

### For Linux/Mac/Git Bash Users

To apply the custom_assessments table migration to your Supabase database using Bash:

```bash
# Make the script executable (may be needed on Unix-based systems)
chmod +x apply-migration.sh

# Run the migration script
./apply-migration.sh
```

### For Windows Users

For Windows PowerShell users:

```powershell
# Run the PowerShell script
.\apply-migration.ps1
```

For Command Prompt users:

```cmd
# Run the batch script
apply-migration.bat
```

Both scripts will:

1. Check if Supabase CLI is installed and help you install it if needed
2. Extract the project reference from your Supabase URL
3. Log in to Supabase using your service role key
4. Execute the SQL migration file using the Supabase CLI
5. Log out from Supabase when done

## What This Migration Does

The migration creates a new `custom_assessments` table that stores assessment requests for the Custom Service option. This table is necessary for the booking flow when customers select the Custom Service option.

## Verifying Success

After running the migration:

1. Log into your Supabase dashboard at https://app.supabase.com
2. Navigate to your project (ID: kzucwrtsczksvoemzypd)
3. Go to the Table Editor
4. Verify that the `custom_assessments` table exists with the correct schema

## If Migration Fails

If you encounter any issues with the migration:

1. Check the error message in the console output
2. Verify your Supabase credentials in `.env.local`
3. Try running the migration SQL directly in the Supabase SQL Editor

SQL to run manually in Supabase SQL Editor if needed:

```sql
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
```

## Manual Verification Steps

After successfully applying the migration:

1. Start your application locally
2. Navigate to the booking page
3. Verify that all 4 services appear in the dropdown menu
4. Try selecting each service to ensure they all work correctly
5. Book a Custom Service and verify that the assessment is saved to the `custom_assessments` table
