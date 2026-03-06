from django.test import TestCase
from cars.models import Car, CarGallery
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class CarTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username='admin', password='adminpassword')
        self.user = User.objects.create_user(username='testuser', password='testpassword123')

        self.car = Car.objects.create(
            brand='Toyota',
            model='Camry',
            year=2022,
            seats=5,
            price_per_day=50.00,
            image='http://example.com/image.jpg',
            description='A good car'
        )

    def test_get_cars_list_unauthenticated(self):
        response = self.client.get('/api/cars/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_car_unauthenticated(self):
        data = {
            'brand': 'Honda',
            'model': 'Civic',
            'year': 2021,
            'seats': 5,
            'price_per_day': 40.00,
            'image': 'http://example.com/honda.jpg',
            'description': 'Reliable car'
        }
        response = self.client.post('/api/cars/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_car_authenticated_user(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'brand': 'Honda',
            'model': 'Civic',
            'year': 2021,
            'seats': 5,
            'price_per_day': 40.00,
            'image': 'http://example.com/honda.jpg',
            'description': 'Reliable car'
        }
        response = self.client.post('/api/cars/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_car_admin(self):
        self.client.force_authenticate(user=self.admin)
        data = {
            'brand': 'Honda',
            'model': 'Civic',
            'year': 2021,
            'seats': 5,
            'price_per_day': 40.00,
            'image': 'http://example.com/honda.jpg',
            'description': 'Reliable car'
        }
        response = self.client.post('/api/cars/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Car.objects.count(), 2)

    def test_get_car_detail(self):
        response = self.client.get(f'/api/cars/{self.car.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['brand'], 'Toyota')

    def test_update_car_admin(self):
        self.client.force_authenticate(user=self.admin)
        data = {'brand': 'Toyota Updated'}
        response = self.client.patch(f'/api/cars/{self.car.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.car.refresh_from_db()
        self.assertEqual(self.car.brand, 'Toyota Updated')

    def test_delete_car_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f'/api/cars/{self.car.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Car.objects.count(), 0)

    def test_car_gallery_get(self):
        gallery = CarGallery.objects.create(car=self.car, gallery_url='http://example.com/gallery')
        response = self.client.get(f'/api/car-gallery/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_car_gallery_filter(self):
        gallery = CarGallery.objects.create(car=self.car, gallery_url='http://example.com/gallery')
        response = self.client.get(f'/api/car-gallery/?car={self.car.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
