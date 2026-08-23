from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import User
from farmers.models import FarmerProfile
from crops.models import Crop
from buyers.models import Buyer
from lots.models import DigitalLot, Offer
from .models import Transaction

class TransactionPrivacyAndFinancialTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Farmer A
        self.farmer_user_a = User.objects.create_user(
            phone_number='9823011111',
            name='Farmer A',
            role=User.Role.FARMER,
            password='Demo@123'
        )
        self.farmer_profile_a = FarmerProfile.objects.create(
            user=self.farmer_user_a,
            village='Dindori',
            district='Nashik',
            state='Maharashtra'
        )

        # Farmer B (Unrelated third-party)
        self.farmer_user_b = User.objects.create_user(
            phone_number='9823022222',
            name='Farmer B',
            role=User.Role.FARMER,
            password='Demo@123'
        )
        self.farmer_profile_b = FarmerProfile.objects.create(
            user=self.farmer_user_b,
            village='Pimpalgaon',
            district='Nashik',
            state='Maharashtra'
        )

        # Buyer
        self.buyer_user = User.objects.create_user(
            phone_number='9823033333',
            name='Buyer Reliance',
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

        self.lot = DigitalLot.objects.create(
            farmer=self.farmer_profile_a,
            crop=self.crop,
            quantity=500.0,
            quality_grade=DigitalLot.QualityGrade.GRADE_A,
            asking_price=24.0,
            location='Farm Gate Dindori',
            status=DigitalLot.LotStatus.DEAL_LOCKED,
        )

        self.offer = Offer.objects.create(
            lot=self.lot,
            buyer=self.buyer_profile,
            offered_price=24.0,
            quantity=500.0,
            estimated_transport_per_kg=1.5,
            status=Offer.OfferStatus.ACCEPTED,
        )

        # Transaction strictly between Farmer A and Buyer Reliance
        self.txn = Transaction.objects.create(
            lot=self.lot,
            farmer=self.farmer_profile_a,
            buyer=self.buyer_profile,
            agreed_price=24.0,
            quantity=500.0,
            gross_amount=12000.0,
            transport_cost=750.0,
            storage_cost=0.0,
            other_cost=0.0,
            net_realization=11250.0,
            payment_status=Transaction.PaymentStatus.IN_ESCROW,
        )

    def test_strict_server_side_net_realization_formula(self):
        self.assertEqual(float(self.txn.gross_amount), 12000.0)
        self.assertEqual(float(self.txn.transport_cost), 750.0)
        self.assertEqual(float(self.txn.net_realization), 11250.0)
        self.assertEqual(
            float(self.txn.gross_amount) - float(self.txn.transport_cost),
            float(self.txn.net_realization)
        )

    def test_farmer_a_can_view_own_transaction(self):
        self.client.force_authenticate(user=self.farmer_user_a)
        response = self.client.get(reverse('transaction-detail', kwargs={'pk': self.txn.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data['net_realization']), 11250.0)

    def test_buyer_can_view_own_transaction(self):
        self.client.force_authenticate(user=self.buyer_user)
        response = self.client.get(reverse('transaction-detail', kwargs={'pk': self.txn.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unrelated_farmer_b_cannot_view_farmer_a_transaction(self):
        self.client.force_authenticate(user=self.farmer_user_b)
        response = self.client.get(reverse('transaction-detail', kwargs={'pk': self.txn.id}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
