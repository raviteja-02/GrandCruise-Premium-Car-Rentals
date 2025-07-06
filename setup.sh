#!/bin/bash

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Install frontend dependencies
cd frontend
npm install

echo "Setup complete! To start the development servers:"
echo "1. Backend: python manage.py runserver"
echo "2. Frontend: cd frontend && npm run dev" 