@echo off
title LearnHub - Full-Stack Online Learning Platform
color 0b

echo ========================================================
echo        Starting LearnHub Online Learning Platform
echo ========================================================
echo.

:: Start Spring Boot Backend in a new window
echo [1/2] Launching Spring Boot Backend on http://localhost:8080...
start "LearnHub Backend" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

:: Wait 5 seconds for backend initialization
timeout /t 5 /nobreak >nul

:: Start React Vite Frontend in a new window
echo [2/2] Launching React Vite Frontend on http://localhost:5173...
start "LearnHub Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait 3 seconds and open the web browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo  LearnHub is now running!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:8080
echo  - Database: H2 Console at http://localhost:8080/h2-console
echo ========================================================
echo.
pause
