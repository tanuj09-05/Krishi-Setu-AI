from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User
from farmers.models import FarmerProfile


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone_number='9823012345',
            name='Test Farmer',
            email='testfarmer@example.com',
            password='TestPassword@123',
            role=User.Role.FARMER,
            location='Nashik, Maharashtra',
        )
        self.profile = FarmerProfile.objects.create(
            user=self.user,
            farm_location='Nashik, Maharashtra',
            district='Nashik',
            state='Maharashtra',
            farm_size_acres=5.0,
        )

    def test_signup_successful(self):
        payload = {
            'name': 'New Farmer',
            'email': 'newfarmer@example.com',
            'phone_number': '9899911111',
            'password': 'SecurePassword@123',
            'confirm_password': 'SecurePassword@123',
            'location': 'Gajraula, Uttar Pradesh',
            'farm_size_acres': 3.5,
            'role': 'FARMER',
        }
        response = self.client.post('/api/v1/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['name'], 'New Farmer')
        self.assertEqual(response.data['user']['email'], 'newfarmer@example.com')

        # Verify FarmerProfile was automatically created
        new_user = User.objects.get(email='newfarmer@example.com')
        self.assertTrue(hasattr(new_user, 'farmer_profile'))
        self.assertEqual(float(new_user.farmer_profile.farm_size_acres), 3.5)

    def test_signup_duplicate_email_rejected(self):
        payload = {
            'name': 'Duplicate User',
            'email': 'testfarmer@example.com',
            'phone_number': '9899922222',
            'password': 'SecurePassword@123',
        }
        response = self.client.post('/api/v1/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_signup_password_mismatch_rejected(self):
        payload = {
            'name': 'Mismatch User',
            'email': 'mismatch@example.com',
            'phone_number': '9899933333',
            'password': 'SecurePassword@123',
            'confirm_password': 'DifferentPassword@123',
        }
        response = self.client.post('/api/v1/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_email_successful(self):
        payload = {
            'email': 'testfarmer@example.com',
            'password': 'TestPassword@123',
        }
        response = self.client.post('/api/v1/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['name'], 'Test Farmer')

    def test_login_with_phone_successful(self):
        payload = {
            'phone_number': '9823012345',
            'password': 'TestPassword@123',
        }
        response = self.client.post('/api/v1/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_wrong_password_rejected(self):
        payload = {
            'email': 'testfarmer@example.com',
            'password': 'WrongPassword@999',
        }
        response = self.client.post('/api/v1/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_current_user_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Farmer')
        self.assertIsNotNone(response.data['farmer_profile'])

    def test_update_profile(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'name': 'Updated Farmer Name',
            'location': 'Amroha, Uttar Pradesh',
            'village': 'Gajraula',
            'district': 'Amroha',
            'state': 'Uttar Pradesh',
            'farm_size_acres': 7.5,
        }
        response = self.client.patch('/api/v1/auth/me/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Farmer Name')
        self.assertEqual(response.data['location'], 'Amroha, Uttar Pradesh')
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, 'Updated Farmer Name')
        self.assertEqual(float(self.user.farmer_profile.farm_size_acres), 7.5)

    def test_change_password_flow(self):
        self.client.force_authenticate(user=self.user)
        
        # Wrong old password
        res_fail = self.client.post('/api/v1/auth/change-password/', {
            'old_password': 'WrongOldPassword',
            'new_password': 'BrandNewPassword@123',
        })
        self.assertEqual(res_fail.status_code, status.HTTP_400_BAD_REQUEST)

        # Correct old password
        res_ok = self.client.post('/api/v1/auth/change-password/', {
            'old_password': 'TestPassword@123',
            'new_password': 'BrandNewPassword@123',
        })
        self.assertEqual(res_ok.status_code, status.HTTP_200_OK)

        # Verify login with new password
        self.client.force_authenticate(user=None)
        login_res = self.client.post('/api/v1/auth/login/', {
            'email': 'testfarmer@example.com',
            'password': 'BrandNewPassword@123',
        })
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

    def test_password_reset_flow(self):
        # 1. Request reset
        req_res = self.client.post('/api/v1/auth/password-reset/', {
            'email': 'testfarmer@example.com',
        })
        self.assertEqual(req_res.status_code, status.HTTP_200_OK)
        uidb64 = req_res.data['uidb64']
        token = req_res.data['token']

        # 2. Confirm reset
        confirm_res = self.client.post('/api/v1/auth/password-reset-confirm/', {
            'uidb64': uidb64,
            'token': token,
            'new_password': 'ResetSuccessPassword@123',
            'confirm_new_password': 'ResetSuccessPassword@123',
        })
        self.assertEqual(confirm_res.status_code, status.HTTP_200_OK)

        # 3. Log in with reset password
        login_res = self.client.post('/api/v1/auth/login/', {
            'email': 'testfarmer@example.com',
            'password': 'ResetSuccessPassword@123',
        })
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
