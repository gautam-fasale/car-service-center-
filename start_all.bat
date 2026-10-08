@echo off
echo =======================================================
echo Starting CarServ - Vehicle Service Center System
echo =======================================================

cd /d "%~dp0"

:: Check Backend Dependencies
if not exist "backend\node_modules" (
    echo [Setup] Installing Backend dependencies for first-time run...
    cd backend
    call npm install
    cd ..
)

:: Check Frontend Dependencies
if not exist "frontend\node_modules" (
    echo [Setup] Installing Frontend dependencies for first-time run...
    cd frontend
    call npm install
    cd ..
)

echo Starting Backend Server on port 5000...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Web App on port 3000...
start cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo =======================================================
