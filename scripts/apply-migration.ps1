# PowerShell script to apply migrations to Supabase using the Supabase CLI
# This is a more direct approach than using the API

# Function to write colored output
function Write-ColorOutput {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Text,
        
        [Parameter(Mandatory = $false)]
        [string]$Color = "White"
    )
    
    Write-Host $Text -ForegroundColor $Color
}

Write-ColorOutput "Easy Lawn Care - Database Migration Script" -Color Yellow
Write-ColorOutput "========================================" -Color White
Write-Host ""

# Check if Supabase CLI is installed
$supabaseInstalled = $null
try {
    $supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if ($null -eq $supabaseInstalled) {
    Write-ColorOutput "Supabase CLI is not installed." -Color Red
    Write-Host "Please install Supabase CLI:"
    Write-Host "1. Visit: https://github.com/supabase/cli/releases"
    Write-Host "2. Download the Windows executable"
    Write-Host "3. Add it to your PATH"
    Write-Host ""
    Write-Host "Or install with winget:"
    Write-Host "winget install Supabase.CLI"
    exit 1
}

Write-Host "Supabase CLI is installed."
Write-Host ""

# Get the project directory (one level up from scripts)
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path -Parent $scriptPath
$projectDir = Split-Path -Parent $scriptDir

Write-Host "Project directory: $projectDir"

# Load environment variables from .env.local
$envFile = Join-Path -Path $projectDir -ChildPath ".env.local"
if (Test-Path $envFile) {
    Write-Host "Loading environment variables from .env.local..."
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") {
                $value = $matches[1]
            }
            Set-Item -Path "env:$name" -Value $value
        }
    }
} else {
    Write-ColorOutput "Error: .env.local file not found!" -Color Red
    exit 1
}

# Check if required environment variables are set
if ([string]::IsNullOrEmpty($env:NEXT_PUBLIC_SUPABASE_URL) -or [string]::IsNullOrEmpty($env:SUPABASE_SERVICE_ROLE_KEY)) {
    Write-ColorOutput "Error: Required Supabase environment variables are not set!" -Color Red
    exit 1
}

Write-Host "Environment variables loaded."
Write-Host ""

# Extract Supabase project reference from URL
# Format: https://[project-ref].supabase.co
$projectRef = $env:NEXT_PUBLIC_SUPABASE_URL -replace 'https://([^.]+)\.supabase\.co.*', '$1'

if ([string]::IsNullOrEmpty($projectRef)) {
    Write-ColorOutput "Error: Could not extract project reference from Supabase URL!" -Color Red
    exit 1
}

Write-Host "Supabase Project Reference: $projectRef"
Write-Host ""

# Login to Supabase using service role key
Write-Host "Logging in to Supabase..."
supabase login --key $env:SUPABASE_SERVICE_ROLE_KEY --project-ref $projectRef

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Error: Failed to log in to Supabase!" -Color Red
    exit 1
}

Write-ColorOutput "Successfully logged in to Supabase!" -Color Green
Write-Host ""

# Path to SQL migration
$migrationFile = Join-Path -Path $projectDir -ChildPath "migrations\create_custom_assessments_table.sql"

if (-not (Test-Path $migrationFile)) {
    Write-ColorOutput "Error: Migration file not found: $migrationFile" -Color Red
    exit 1
}

Write-Host "Applying migration from: $migrationFile"
Write-Host ""

# Apply the migration using supabase db execute
Write-Host "Executing SQL migration..."
Get-Content $migrationFile | supabase db execute --project-ref $projectRef

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Error: Failed to apply migration!" -Color Red
    exit 1
}

Write-ColorOutput "Migration applied successfully!" -Color Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Verify in Supabase Studio that the custom_assessments table was created"
Write-Host "2. Test the application by booking a Custom Service"
Write-Host "3. Check that all 4 services appear in the dropdown menu"
Write-Host ""

# Logout from Supabase
Write-Host "Logging out from Supabase..."
supabase projects logout $projectRef

Write-ColorOutput "Done!" -Color Green
