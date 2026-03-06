from django.test import TestCase
from cars.models import Car
from bookings.models import Booking
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

class BookingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.admin = User.objects.create_superuser(username='admin', password='adminpassword')

        self.car = Car.objects.create(
            brand='Toyota',
            model='Camry',
            year=2022,
            seats=5,
            price_per_day=50.00,
            image='http://example.com/image.jpg',
            description='A good car'
        )

    def test_create_booking_authenticated(self):
        self.client.force_authenticate(user=self.user)
        start_date = timezone.now().date() + timedelta(days=1)
        end_date = timezone.now().date() + timedelta(days=5)

        data = {
            'car': self.car.id,
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d')
        }
        response = self.client.post('/api/bookings/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertEqual(Booking.objects.first().user, self.user)
        self.assertFalse(Car.objects.get(id=self.car.id).is_available)

    def test_create_booking_unauthenticated(self):
        start_date = timezone.now().date() + timedelta(days=1)
        end_date = timezone.now().date() + timedelta(days=5)

        data = {
            'car': self.car.id,
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d')
        }
        response = self.client.post('/api/bookings/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_bookings_authenticated(self):
        self.client.force_authenticate(user=self.user)

        start_date = timezone.now().date() + timedelta(days=1)
        end_date = timezone.now().date() + timedelta(days=5)
        booking = Booking.objects.create(
            user=self.user,
            car=self.car,
            start_date=start_date,
            end_date=end_date,
            total_price=250.00,
            status='pending'
        )

        response = self.client.get('/api/bookings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_bookings_unauthenticated(self):
        response = self.client.get('/api/bookings/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_booking_status_user(self):
        self.client.force_authenticate(user=self.user)
        start_date = timezone.now().date() + timedelta(days=1)
        end_date = timezone.now().date() + timedelta(days=5)

        booking = Booking.objects.create(
            user=self.user,
            car=self.car,
            start_date=start_date,
            end_date=end_date,
            total_price=250.00,
            status='pending'
        )

        data = {'status': 'confirmed'}
        response = self.client.patch(f'/api/bookings/{booking.id}/update_status/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_booking_status_admin(self):
        self.client.force_authenticate(user=self.admin)
        start_date = timezone.now().date() + timedelta(days=1)
        end_date = timezone.now().date() + timedelta(days=5)

        booking = Booking.objects.create(
            user=self.user,
            car=self.car,
            start_date=start_date,
            end_date=end_date,
            total_price=250.00,
            status='pending'
        )

        data = {'status': 'confirmed'}
        response = self.client.patch(f'/api/bookings/{booking.id}/update_status/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, 'confirmed')

    def test_cancel_booking(self):
        self.client.force_authenticate(user=self.user)
        start_date = timezone.now().date() + timedelta(days=1)
        end_date = timezone.now().date() + timedelta(days=5)

        booking = Booking.objects.create(
            user=self.user,
            car=self.car,
            start_date=start_date,
            end_date=end_date,
            total_price=250.00,
            status='pending'
        )

        data = {'status': 'cancelled'}
        response = self.client.patch(f'/api/bookings/{booking.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, 'cancelled')
        self.car.refresh_from_db()
        self.assertTrue(self.car.is_available)
