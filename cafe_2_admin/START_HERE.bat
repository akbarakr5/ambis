@echo off
cls
echo ========================================
echo   CAFE ADMIN - SUPABASE SETUP
echo ========================================
echo.

echo [STEP 1] Checking Supabase Database Setup...
echo.
echo Please ensure you have:
echo   1. Created tables in Supabase (run database_setup.sql)
echo   2. Set your phone number as admin in users table
echo   3. Your Supabase credentials are in .env file
echo.
pause

echo.
echo [STEP 2] Installing Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [STEP 3] Starting Application...
echo.
echo ========================================
echo   IMPORTANT INFORMATION
echo ========================================
echo.
echo   Login OTP: 123456
echo   Make sure your phone is admin in Supabase
echo.
echo   To set admin:
echo   UPDATE users SET is_admin = TRUE WHERE phone = 'YOUR_PHONE';
echo.
echo ========================================
echo.

start npx expo start

echo.
echo Application is starting...
echo Scan the QR code with Expo Go app
echo.
pause
