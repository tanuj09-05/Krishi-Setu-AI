from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import TransportVehicle, Logistics

class LogisticsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.vehicle = TransportVehicle.objects.create(
            vehicle_type='Tata Ace (Chhota Hathi)',
            capacity_kg=750,
            base_rate_per_km=14.0,
            loading_unloading_cost=350.0,
        )

    def test_vehicle_list(self):
        response = self.client.get(reverse('logistics-vehicles'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_logistics_booking(self):
        payload = {
            'pickup_location': 'Farm Gate, Dindori',
            'destination': 'Reliance Hub, Ozar',
            'distance_km': 28.0,
            'quantity_kg': 500.0,
            'vehicle_type': 'Tata Ace (Chhota Hathi)',
        }
        response = self.client.post(reverse('logistics-list'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tracking_number', response.data)
        # Verify calculated freight: (28 * 14) + 350 = 392 + 350 = 742
        self.assertEqual(float(response.data['estimated_transport_cost']), 742.0)
        self.assertEqual(float(response.data['cost_per_kg']), 1.48)
