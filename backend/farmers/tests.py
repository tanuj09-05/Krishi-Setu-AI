from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from .models import FarmerProfile

class FarmerProfileTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone_number='9823456789',
            name='Rameshwar Patil',
            password='strongpassword123',
            role=User.Role.FARMER,
        )
        self.profile = FarmerProfile.objects.create(
            user=self.user,
            farm_location='Dindori, Nashik',
            district='Nashik',
            state='Maharashtra',
            farm_size_acres=4.5,
            organization_fpo='Sahyadri Farmers Producer Co. Ltd.',
        )
        self.url = reverse('farmer-profile')

    def test_get_farmer_profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['district'], 'Nashik')
        self.assertEqual(response.data['user_details']['name'], 'Rameshwar Patil')
