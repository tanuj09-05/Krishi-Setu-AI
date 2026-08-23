import datetime
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from farmers.models import FarmerProfile
from crops.models import Crop
from markets.models import Market, MarketPrice
from buyers.models import Buyer, BuyerDemand
from .services import RecommendationService

class RecommendationEngineTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer_user = User.objects.create_user(phone_number='9823456789', name='Rameshwar Patil')
        self.farmer = FarmerProfile.objects.create(user=self.farmer_user, farm_location='Dindori', district='Nashik')
        self.crop = Crop.objects.create(name='Tomato', crop_category=Crop.Category.VEGETABLES)

        # 1. Option A: Local Mandi (Price ₹21, Transport ₹0.50 => Net ₹20.50)
        self.local_mandi = Market.objects.create(
            name='Dindori Local Sub-Mandi',
            district='Nashik',
            distance_km_default=8.0,
            market_fee_percent=0.0,
            weighment_cost_per_kg=0.0,
            unloading_cost_per_kg=0.0,
        )
        MarketPrice.objects.create(
            market=self.local_mandi,
            crop=self.crop,
            date=datetime.date.today(),
            min_price=20.0,
            max_price=22.0,
            modal_price=21.0,
        )

        # 2. Option B: Buyer A (Price ₹24, Transport ₹1.50 => Net ₹22.50)
        self.buyer_user = User.objects.create_user(phone_number='9422211099', name='Buyer A Rep')
        self.buyer_a = Buyer.objects.create(
            user=self.buyer_user,
            business_name='Reliance Retail Sourcing Hub (Buyer A)',
            district='Nashik',
            distance_km_default=28.0,
            pickup_service_available=True,
            payment_reliability_score=99.2,
        )
        BuyerDemand.objects.create(
            buyer=self.buyer_a,
            crop=self.crop,
            required_quantity=5000.0,
            remaining_quantity=5000.0,
            offered_price=24.0,
        )

        # 3. Option C: Market C (Azadpur Delhi: Price ₹26, Transport ₹4.00 => Net ₹22.00)
        self.mandi_c = Market.objects.create(
            name='Azadpur APMC Delhi (Market C)',
            district='North Delhi',
            distance_km_default=1280.0,
            market_fee_percent=0.0,
            weighment_cost_per_kg=0.0,
            unloading_cost_per_kg=0.0,
        )
        MarketPrice.objects.create(
            market=self.mandi_c,
            crop=self.crop,
            date=datetime.date.today(),
            min_price=25.0,
            max_price=27.0,
            modal_price=26.0,
        )

    def test_recommendation_chooses_highest_net_realization_not_highest_price(self):
        """
        Verify that the engine chooses Option B (Net ₹22.50/kg) over Option C (Gross ₹26/kg but Net ₹22.00/kg)
        """
        rec = RecommendationService.generate_recommendation(
            farmer=self.farmer,
            crop=self.crop,
            quantity_kg=500.0,
        )

        self.assertIn('Buyer A', rec.recommended_destination_name)
        self.assertEqual(float(rec.expected_price), 24.0)
        self.assertEqual(float(rec.estimated_transport_per_kg), 1.5)
        self.assertEqual(float(rec.estimated_net_realization_per_kg), 22.5)
        self.assertEqual(float(rec.estimated_net_realization), 11250.0)

    def test_recommendation_api_endpoint(self):
        response = self.client.get(reverse('recommendation-generate') + '?crop=Tomato&quantity_kg=500')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['estimated_net_realization_per_kg']), 22.5)
