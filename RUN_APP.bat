@echo off
cls
echo ==========================================
echo   CAFE ADMIN APP - STARTING
echo ==========================================
echo.
echo Login OTP: 123456
echo.
echo Make sure you have set admin user in Supabase:
echo UPDATE users SET is_admin = TRUE WHERE phone = 'YOUR_PHONE';
echo.
echo ==========================================
echo.

cd cafe_2_admin
npx expo start --clear

pause
