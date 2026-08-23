from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Crop

class CropAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.crop = Crop.objects.create(
            name='Tomato',
            local_name='टमाटर',
            crop_category=Crop.Category.VEGETABLES,
            unit='kg',
            icon='🍅'
        )

    def test_get_crops_list(self):
        response = self.client.get(reverse('crop-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check either paginated or direct list
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], 'Tomato')
