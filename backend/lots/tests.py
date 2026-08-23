from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from farmers.models import FarmerProfile
from crops.models import Crop
from buyers.models import Buyer
from lots.models import DigitalLot, Offer

class LotPermissionsAndIsolationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Farmer 1
        self.farmer_user1 = User.objects.create_user(
            phone_number='9823011111',
            name='Farmer One',
            role=User.Role.FARMER,
            password='Demo@123'
        )
        self.farmer_profile1 = FarmerProfile.objects.create(
            user=self.farmer_user1,
            village='Dindori',
            district='Nashik',
            state='Maharashtra'
        )

        # Farmer 2
        self.farmer_user2 = User.objects.create_user(
            phone_number='9823022222',
            name='Farmer Two',
            role=User.Role.FARMER,
            password='Demo@123'
        )
        self.farmer_profile2 = FarmerProfile.objects.create(
            user=self.farmer_user2,
            village='Pimpalgaon',
            district='Nashik',
            state='Maharashtra'
        )

        # Buyer
        self.buyer_user = User.objects.create_user(
            phone_number='9823033333',
            name='Buyer One',
            role=User.Role.BUYER,
            password='Demo@123'
        )
        self.buyer_profile = Buyer.objects.create(
            user=self.buyer_user,
            business_name='Reliance Hub',
            buyer_type=Buyer.BuyerType.RETAILER,
            district='Nashik'
        )

        self.crop = Crop.objects.create(name='Tomato', crop_category=Crop.Category.VEGETABLES)

        # Farmer 1's lot
        self.lot1 = DigitalLot.objects.create(
            farmer=self.farmer_profile1,
            crop=self.crop,
            quantity=500.0,
            quality_grade=DigitalLot.QualityGrade.GRADE_A,
            asking_price=24.0,
            location='Farm Gate Dindori',
            status=DigitalLot.LotStatus.PUBLISHED,
        )

    def test_farmer_can_create_own_lot(self):
        self.client.force_authenticate(user=self.farmer_user1)
        response = self.client.post(reverse('lot-list'), {
            'crop_name': 'Tomato',
            'quantity': 600.0,
            'asking_price': 23.5,
            'quality_grade': 'GRADE_A',
            'location': 'Farm Gate Dindori',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['farmer'], self.farmer_profile1.id)

    def test_farmer2_cannot_modify_farmer1_lot(self):
        self.client.force_authenticate(user=self.farmer_user2)
        response = self.client.patch(reverse('lot-detail', kwargs={'pk': self.lot1.id}), {
            'asking_price': 30.0,
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_farmer_scope_mine_isolates_data(self):
        # Farmer 1 queries own lots
        self.client.force_authenticate(user=self.farmer_user1)
        res1 = self.client.get(f"{reverse('lot-list')}?scope=mine")
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res1.data.get('results', res1.data)), 1)

        # Farmer 2 queries own lots -> gets 0
        self.client.force_authenticate(user=self.farmer_user2)
        res2 = self.client.get(f"{reverse('lot-list')}?scope=mine")
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res2.data.get('results', res2.data)), 0)

    def test_buyer_can_view_published_lot(self):
        self.client.force_authenticate(user=self.buyer_user)
        response = self.client.get(reverse('lot-detail', kwargs={'pk': self.lot1.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['asking_price']), 24.0)

    def test_buyer_can_submit_offer_on_lot(self):
        self.client.force_authenticate(user=self.buyer_user)
        response = self.client.post(reverse('offer-list'), {
            'lot': self.lot1.id,
            'offered_price': 24.0,
            'quantity': 500.0,
            'pickup_service_offered': True,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['buyer'], self.buyer_profile.id)

    def test_farmer1_can_accept_offer_and_lock_deal(self):
        offer = Offer.objects.create(
            lot=self.lot1,
            buyer=self.buyer_profile,
            offered_price=24.0,
            quantity=500.0,
            estimated_transport_per_kg=1.5,
            status=Offer.OfferStatus.PENDING,
        )

        self.client.force_authenticate(user=self.farmer_user1)
        response = self.client.patch(reverse('offer-detail', kwargs={'pk': offer.id}), {
            'action': 'accept',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ACCEPTED')

        # Check lot status updated to DEAL_LOCKED
        self.lot1.refresh_from_db()
        self.assertEqual(self.lot1.status, DigitalLot.LotStatus.DEAL_LOCKED)
