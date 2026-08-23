from rest_framework import serializers
from .models import Market, MarketPrice
from crops.serializers import CropSerializer

class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = '__all__'


class MarketPriceSerializer(serializers.ModelSerializer):
    market_details = MarketSerializer(source='market', read_only=True)
    crop_details = CropSerializer(source='crop', read_only=True)

    class Meta:
        model = MarketPrice
        fields = '__all__'


class MarketCompareRequestSerializer(serializers.Serializer):
    crop_id = serializers.IntegerField(required=False)
    crop_name = serializers.CharField(required=False)
    quantity_kg = serializers.DecimalField(max_digits=10, decimal_places=2, default=500.0)
    origin_district = serializers.CharField(required=False, default='Nashik')
