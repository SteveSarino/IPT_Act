@echo off
echo Starting Student Management System...

:: Start Backend
start cmd /k "cd student_management && python manage.py migrate && python manage.py runserver"

:: Start Frontend
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both servers are starting in new windows...
echo Once they are ready:
echo 1. Backend will be at http://127.0.0.1:8000/api/
echo 2. Frontend will be at http://localhost:5173/
echo.
pause
