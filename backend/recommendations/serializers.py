from rest_framework import serializers
from .models import MarketRecommendation
from crops.serializers import CropSerializer
from farmers.serializers import FarmerProfileSerializer

class MarketRecommendationSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    crop_details = CropSerializer(source='crop', read_only=True)
    farmer_name = serializers.CharField(source='farmer.user.name', read_only=True)

    class Meta:
        model = MarketRecommendation
        fields = '__all__'


class GenerateRecommendationRequestSerializer(serializers.Serializer):
    crop_id = serializers.IntegerField(required=False)
    crop_name = serializers.CharField(required=False, default='Tomato')
    quantity_kg = serializers.DecimalField(max_digits=10, decimal_places=2, default=500.0)
    quality_grade = serializers.CharField(required=False, default='Grade A (Export/Premium)')
