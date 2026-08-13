from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.admin = User.objects.create_superuser(username='admin', password='adminpassword')
        self.client.force_authenticate(user=self.user)

    def test_create_user(self):
        client = APIClient()
        data = {
            'username': 'newuser',
            'password': 'newpassword123',
            'email': 'newuser@example.com'
        }
        response = client.post('/api/users/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(User.objects.get(username='newuser').email, 'newuser@example.com')

    def test_get_users_list_authenticated(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_users_list_unauthenticated(self):
        client = APIClient()
        response = client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_me(self):
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_update_me(self):
        data = {'first_name': 'Test', 'last_name': 'User'}
        response = self.client.patch('/api/users/me/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Test')

    def test_update_profile(self):
        data = {'phone_number': '1234567890', 'address': '123 Test St'}
        response = self.client.put('/api/users/update_profile/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.phone_number, '1234567890')
        self.assertEqual(self.user.profile.address, '123 Test St')
