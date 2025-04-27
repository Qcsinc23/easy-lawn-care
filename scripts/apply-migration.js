// Script to apply the custom_assessments table migration to Supabase database
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Get Supabase environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function applyMigration() {
  try {
    console.log('Reading migration file...');
    const migrationSql = fs.readFileSync(
      path.resolve(__dirname, '../migrations/create_custom_assessments_table.sql'),
      'utf8'
    );

    console.log('Applying migration to Supabase...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: migrationSql
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase API responded with status ${response.status}: ${errorText}`);
    }

    console.log('Migration applied successfully!');
    console.log('Next steps:');
    console.log('1. Verify in Supabase Studio that the custom_assessments table was created');
    console.log('2. Test the application by booking a Custom Service');
    console.log('3. Check that all 4 services appear in the dropdown menu');

    // Try to refresh the PostgREST schema cache
    console.log('Attempting to refresh schema cache...');
    const refreshResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/postgrest_schema_cache_refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      }
    });

    if (refreshResponse.ok) {
      console.log('Schema cache refresh successful!');
    } else {
      console.warn('Schema cache refresh may not have succeeded. This is not critical, but you may need to restart the Supabase service if you encounter schema-related errors.');
    }

  } catch (error) {
    console.error('Error applying migration:', error);
    process.exit(1);
  }
}

// Execute the migration
applyMigration();
