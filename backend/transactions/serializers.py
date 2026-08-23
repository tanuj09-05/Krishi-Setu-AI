from rest_framework import serializers
from .models import Transaction
from lots.serializers import DigitalLotSerializer
from buyers.serializers import BuyerSerializer
from farmers.serializers import FarmerProfileSerializer

class TransactionSerializer(serializers.ModelSerializer):
    lot_details = DigitalLotSerializer(source='lot', read_only=True)
    buyer_name = serializers.CharField(source='buyer.business_name', read_only=True)
    farmer_name = serializers.CharField(source='farmer.user.name', read_only=True)
    crop_name = serializers.CharField(source='lot.crop.name', read_only=True)
    lot_number = serializers.CharField(source='lot.lot_number', read_only=True)
    net_realization_per_kg = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['id', 'gross_amount', 'net_realization', 'created_at']

    def get_net_realization_per_kg(self, obj):
        if obj.quantity and float(obj.quantity) > 0:
            return round(float(obj.net_realization) / float(obj.quantity), 2)
        return 0.0
