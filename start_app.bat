@echo off
echo ========================================
echo Starting Cafe Admin Application
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Admin App...
cd cafe_2_admin
npm start
