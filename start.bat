@echo off
echo Starting Car Booking Application...

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start Django server in a new window
start cmd /k "echo Starting Django Server... && python manage.py runserver"

REM Wait for Django server to start
echo Waiting for Django server to start...
timeout /t 5 /nobreak

@REM REM Check if Django server is running
@REM curl -s http://127.0.0.1:8000/admin/ >nul 2>&1
@REM if errorlevel 1 (
@REM     echo Django server failed to start. Please check the Django window for errors.
@REM     pause
@REM     exit /b 1
@REM )

REM Start React server in a new window
start cmd /k "echo Starting React Server... && cd frontend && npm run dev"

REM Wait for React server to start
echo Waiting for React server to start...
timeout /t 5 /nobreak

REM Open browsers
start http://127.0.0.1:8000/api/
start http://localhost:5173

echo.
echo Servers are running:
echo Django server: http://127.0.0.1:8000
echo React server: http://localhost:5173
echo.
echo If you see a white screen in React:
echo 1. Wait a few more seconds
echo 2. Check the React command window for any errors
echo 3. Try refreshing the page
echo.
echo Press any key to close this window...
pause > nul 