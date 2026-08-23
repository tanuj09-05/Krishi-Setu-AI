from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from crops.models import Crop
from .models import Buyer, BuyerDemand

class BuyerAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            phone_number='9422211099',
            name='Reliance Sourcing Lead',
            role=User.Role.BUYER
        )
        self.buyer = Buyer.objects.create(
            user=self.user,
            business_name='Reliance Retail Sourcing Hub (Buyer A)',
            buyer_type=Buyer.BuyerType.RETAILER,
            procurement_hub='Nashik Collection Centre, Ozar',
            location='Ozar, Nashik',
            district='Nashik',
            distance_km_default=28.0,
        )
        self.crop = Crop.objects.create(name='Tomato', crop_category=Crop.Category.VEGETABLES)
        self.demand = BuyerDemand.objects.create(
            buyer=self.buyer,
            crop=self.crop,
            required_quantity=5000.0,
            remaining_quantity=5000.0,
            offered_price=24.0,
            minimum_quality='Grade A (Export/Premium)',
            delivery_location='Ozar Hub',
        )

    def test_buyer_list(self):
        response = self.client.get(reverse('buyer-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_buyer_demand_list(self):
        response = self.client.get(reverse('buyer-demand') + '?crop=Tomato')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(float(results[0]['offered_price']), 24.0)
