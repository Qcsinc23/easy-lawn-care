@echo off
REM Batch script to apply migrations to Supabase using the Supabase CLI
REM For users who prefer Command Prompt over PowerShell

echo Easy Lawn Care - Database Migration Script
echo ========================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [31mSupabase CLI is not installed.[0m
    echo Please install Supabase CLI:
    echo 1. Visit: https://github.com/supabase/cli/releases
    echo 2. Download the Windows executable
    echo 3. Add it to your PATH
    echo.
    echo Or install with winget:
    echo winget install Supabase.CLI
    exit /b 1
)

echo Supabase CLI is installed.
echo.

REM Get the project directory (one level up from scripts)
set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR:~0,-9%"

echo Project directory: %PROJECT_DIR%

REM Load environment variables from .env.local
set ENV_FILE=%PROJECT_DIR%.env.local
if not exist "%ENV_FILE%" (
    echo [31mError: .env.local file not found![0m
    exit /b 1
)

echo Loading environment variables from .env.local...
for /f "tokens=1,2 delims==" %%a in (%ENV_FILE%) do (
    set "line=%%a"
    if not "!line:~0,1!"=="#" (
        set "%%a=%%b"
    )
)

REM Check if required environment variables are set
if "%NEXT_PUBLIC_SUPABASE_URL%"=="" (
    echo [31mError: Required NEXT_PUBLIC_SUPABASE_URL environment variable is not set![0m
    exit /b 1
)

if "%SUPABASE_SERVICE_ROLE_KEY%"=="" (
    echo [31mError: Required SUPABASE_SERVICE_ROLE_KEY environment variable is not set![0m
    exit /b 1
)

echo Environment variables loaded.
echo.

REM Extract Supabase project reference from URL
REM Format: https://[project-ref].supabase.co
for /f "tokens=2 delims=:/." %%a in ("%NEXT_PUBLIC_SUPABASE_URL%") do set "PROJECT_REF=%%a"

if "%PROJECT_REF%"=="" (
    echo [31mError: Could not extract project reference from Supabase URL![0m
    exit /b 1
)

echo Supabase Project Reference: %PROJECT_REF%
echo.

REM Login to Supabase using service role key
echo Logging in to Supabase...
supabase login --key %SUPABASE_SERVICE_ROLE_KEY% --project-ref %PROJECT_REF%

if %ERRORLEVEL% NEQ 0 (
    echo [31mError: Failed to log in to Supabase![0m
    exit /b 1
)

echo [32mSuccessfully logged in to Supabase![0m
echo.

REM Path to SQL migration
set "MIGRATION_FILE=%PROJECT_DIR%migrations\create_custom_assessments_table.sql"

if not exist "%MIGRATION_FILE%" (
    echo [31mError: Migration file not found: %MIGRATION_FILE%[0m
    exit /b 1
)

echo Applying migration from: %MIGRATION_FILE%
echo.

REM Apply the migration using supabase db execute
echo Executing SQL migration...
type "%MIGRATION_FILE%" | supabase db execute --project-ref %PROJECT_REF%

if %ERRORLEVEL% NEQ 0 (
    echo [31mError: Failed to apply migration![0m
    exit /b 1
)

echo [32mMigration applied successfully![0m
echo.
echo Next steps:
echo 1. Verify in Supabase Studio that the custom_assessments table was created
echo 2. Test the application by booking a Custom Service
echo 3. Check that all 4 services appear in the dropdown menu
echo.

REM Logout from Supabase
echo Logging out from Supabase...
supabase projects logout %PROJECT_REF%

echo [32mDone![0m
pause
