# Car Booking Platform

A full-stack car booking platform built with Django and React.

## Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with the following variables:
```
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DB_NAME=car_booking
DB_USER=root
DB_PASSWORD=your-password-here
DB_HOST=localhost
DB_PORT=3306
```

4. Create the MySQL database:
```sql
CREATE DATABASE car_booking;
```

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `/api/users/` - User management
- `/api/cars/` - Car catalog and management
- `/api/bookings/` - Booking management
- `/api/auth/` - Authentication endpoints
- `/api/car-gallery/` - Car gallery management
- `/admin/` - Django admin interface

## Features

- User registration and authentication
- Car catalog with search and filtering
- Booking management with date selection
- Admin panel for car and user management
- Responsive design with Tailwind CSS
- Real-time availability checking

## Development

- Backend: Django 5.0.2 with Django REST Framework
- Database: MySQL
- Frontend: React with TypeScript and Tailwind CSS
- Authentication: Django's built-in auth system
- API Documentation: DRF's browsable API

## Deployment

1. Set `DJANGO_DEBUG=False` in production
2. Configure proper `ALLOWED_HOSTS` in settings.py
3. Set up a production database
4. Configure static and media file serving
5. Set up proper CORS settings for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Troubleshooting
If you encounter issues during setup or development, consider the following:
- Ensure your Python and Node.js versions are compatible with the project.
- Check the console for any error messages.
- Verify that your database credentials in the `.env` file are correct.
- Make sure all migrations have been applied successfully.
- For frontend issues, check the browser console for errors and ensure the API endpoints are reachable.
- If you have issues with CORS, ensure your Django settings allow requests from your frontend domain.
- If you encounter issues with the React app, try clearing the cache or reinstalling node modules.
- If you have issues with the Django admin interface, ensure your superuser credentials are correct.
- If you have issues with the booking system, check the date and time formats in your requests.
- If you have issues with the car gallery, ensure images are properly uploaded and accessible.
- For any other issues, consider checking the project's GitHub issues page or opening a new issue for assistance.

## Additional Notes
- Make sure to keep your dependencies updated.
- Regularly check for security updates for Django and React.

Happy coding! 