from rest_framework import serializers
from .models import DigitalLot, LotImage, Offer
from crops.serializers import CropSerializer
from farmers.serializers import FarmerProfileSerializer
from buyers.serializers import BuyerSerializer

class LotImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LotImage
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    buyer_details = BuyerSerializer(source='buyer', read_only=True)
    buyer_name = serializers.CharField(source='buyer.business_name', read_only=True)
    buyer_rating = serializers.DecimalField(source='buyer.rating', max_digits=3, decimal_places=2, read_only=True)
    lot_number = serializers.CharField(source='lot.lot_number', read_only=True)
    total_offer_amount = serializers.SerializerMethodField()
    total_net_amount = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = '__all__'
        read_only_fields = ['id', 'lot', 'buyer', 'created_at']

    def get_total_offer_amount(self, obj):
        return round(float(obj.offered_price) * float(obj.quantity), 2)

    def get_total_net_amount(self, obj):
        net_rate = float(obj.estimated_net_realization_per_kg or (float(obj.offered_price) - float(obj.estimated_transport_per_kg)))
        return round(net_rate * float(obj.quantity), 2)


class DigitalLotSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)
    farmer_details = FarmerProfileSerializer(source='farmer', read_only=True)
    farmer_name = serializers.CharField(source='farmer.user.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    images = LotImageSerializer(many=True, read_only=True)
    offers = OfferSerializer(many=True, read_only=True)
    offers_count = serializers.IntegerField(source='offers.count', read_only=True)

    class Meta:
        model = DigitalLot
        fields = '__all__'
        read_only_fields = ['id', 'farmer', 'crop', 'lot_number', 'created_at', 'updated_at']
