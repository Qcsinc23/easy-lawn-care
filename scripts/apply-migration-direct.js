// Direct SQL execution script to apply database migrations to Supabase
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
    // Using the SQL API endpoint to execute the SQL directly
    const response = await fetch(`${SUPABASE_URL}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        query: migrationSql
      })
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(`Supabase API responded with status ${response.status}: ${JSON.stringify(responseData)}`);
    }

    console.log('Migration applied successfully!');
    console.log('Response:', JSON.stringify(responseData, null, 2));
    
    console.log('\nNext steps:');
    console.log('1. Verify in Supabase Studio that the custom_assessments table was created');
    console.log('2. Test the application by booking a Custom Service');
    console.log('3. Check that all 4 services appear in the dropdown menu');

  } catch (error) {
    console.error('Error applying migration:', error);
    process.exit(1);
  }
}

// Execute the migration
applyMigration();
