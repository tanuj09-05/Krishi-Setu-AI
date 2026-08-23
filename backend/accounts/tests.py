from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class AuthenticationAndRolesTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer_user = User.objects.create_user(
            phone_number='9823012345',
            name='Rameshwar Patil',
            email='farmer@demo.krishisetu',
            role=User.Role.FARMER,
            password='Demo@123'
        )
        self.buyer_user = User.objects.create_user(
            phone_number='9823098765',
            name='Aniket Deshmukh',
            email='buyer@demo.krishisetu',
            role=User.Role.BUYER,
            password='Demo@123'
        )

    def test_login_with_phone_number_returns_jwt_tokens(self):
        response = self.client.post(reverse('auth-login'), {
            'phone_number': '9823012345',
            'password': 'Demo@123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], 'FARMER')

    def test_login_with_email_returns_jwt_tokens(self):
        response = self.client.post(reverse('auth-login'), {
            'email': 'buyer@demo.krishisetu',
            'password': 'Demo@123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['role'], 'BUYER')

    def test_token_refresh_endpoint(self):
        login_resp = self.client.post(reverse('auth-login'), {
            'phone_number': '9823012345',
            'password': 'Demo@123',
        })
        refresh_token = login_resp.data['refresh']

        refresh_resp = self.client.post(reverse('auth-refresh'), {
            'refresh': refresh_token,
        })
        self.assertEqual(refresh_resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_resp.data)

    def test_auth_me_endpoint_authenticated(self):
        self.client.force_authenticate(user=self.farmer_user)
        response = self.client.get(reverse('auth-me'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Rameshwar Patil')
        self.assertEqual(response.data['role'], 'FARMER')

    def test_auth_me_endpoint_unauthenticated(self):
        response = self.client.get(reverse('auth-me'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
