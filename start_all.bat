@echo off
echo =======================================================
echo Starting CarServ - Vehicle Service Center System
echo =======================================================

echo Starting Backend Server on port 5000...
start cmd /k "cd backend && npm start"

timeout /t 2 /nobreak >nul

echo Starting Frontend Web App on port 3000...
start cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo =======================================================
