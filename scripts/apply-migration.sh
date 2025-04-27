#!/bin/bash

# Script to apply migrations to Supabase using the Supabase CLI
# This is a more direct approach than using the API

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Easy Lawn Care - Database Migration Script${NC}"
echo "========================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo -e "${RED}Supabase CLI is not installed.${NC}"
    echo "Installing Supabase CLI..."
    
    # Check system and install accordingly
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -s -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar xz
        sudo mv supabase /usr/local/bin/
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # Mac OS
        brew install supabase/tap/supabase
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        # Windows
        echo -e "${YELLOW}Please install Supabase CLI manually on Windows:${NC}"
        echo "1. Visit: https://github.com/supabase/cli/releases"
        echo "2. Download the Windows executable"
        echo "3. Add it to your PATH"
        exit 1
    else
        echo -e "${RED}Unsupported operating system.${NC}"
        echo "Please install Supabase CLI manually: https://github.com/supabase/cli/releases"
        exit 1
    fi
    
    # Verify installation
    if ! command -v supabase &> /dev/null
    then
        echo -e "${RED}Failed to install Supabase CLI.${NC}"
        echo "Please install it manually: https://github.com/supabase/cli/releases"
        exit 1
    else
        echo -e "${GREEN}Supabase CLI installed successfully!${NC}"
    fi
fi

echo "Supabase CLI is installed."
echo ""

# Get the project directory (one level up from scripts)
PROJECT_DIR="$(dirname "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)")"
echo "Project directory: $PROJECT_DIR"

# Source the environment variables
if [ -f "$PROJECT_DIR/.env.local" ]; then
    echo "Loading environment variables from .env.local..."
    export $(grep -v '^#' "$PROJECT_DIR/.env.local" | xargs)
else
    echo -e "${RED}Error: .env.local file not found!${NC}"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}Error: Required Supabase environment variables are not set!${NC}"
    exit 1
fi

echo "Environment variables loaded."
echo ""

# Extract Supabase project reference from URL
# Format: https://[project-ref].supabase.co
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed -E 's/https:\/\/([^.]+)\.supabase\.co.*/\1/')

if [ -z "$PROJECT_REF" ]; then
    echo -e "${RED}Error: Could not extract project reference from Supabase URL!${NC}"
    exit 1
fi

echo "Supabase Project Reference: $PROJECT_REF"
echo ""

# Login to Supabase using service role key
echo "Logging in to Supabase..."
supabase login --key $SUPABASE_SERVICE_ROLE_KEY --project-ref $PROJECT_REF

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to log in to Supabase!${NC}"
    exit 1
fi

echo -e "${GREEN}Successfully logged in to Supabase!${NC}"
echo ""

# Path to SQL migration
MIGRATION_FILE="$PROJECT_DIR/migrations/create_custom_assessments_table.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}Error: Migration file not found: $MIGRATION_FILE${NC}"
    exit 1
fi

echo "Applying migration from: $MIGRATION_FILE"
echo ""

# Apply the migration using supabase db execute
echo "Executing SQL migration..."
supabase db execute --project-ref $PROJECT_REF < "$MIGRATION_FILE"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to apply migration!${NC}"
    exit 1
fi

echo -e "${GREEN}Migration applied successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify in Supabase Studio that the custom_assessments table was created"
echo "2. Test the application by booking a Custom Service"
echo "3. Check that all 4 services appear in the dropdown menu"
echo ""

# Logout from Supabase
echo "Logging out from Supabase..."
supabase projects logout $PROJECT_REF

echo -e "${GREEN}Done!${NC}"
