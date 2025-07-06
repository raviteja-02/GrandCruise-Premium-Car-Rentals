@echo off
echo Checking MySQL installation...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo MySQL is not installed or not in PATH. Please install MySQL first.
    echo Visit https://dev.mysql.com/downloads/ for installation instructions.
    echo After installation, run the init_db.bat
    exit /b 1
)

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt

echo Checking for .env file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please update the .env file with your database credentials
    pause
)

echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo Creating superuser...
python manage.py createsuperuser

echo Installing frontend dependencies...
cd frontend
npm install

echo Setup complete! To start the development servers:
echo 1. Backend: python manage.py runserver
echo 2. Frontend: cd frontend ^&^& npm run dev 