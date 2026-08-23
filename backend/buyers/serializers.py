from rest_framework import serializers
from .models import Buyer, BuyerDemand
from crops.serializers import CropSerializer
from accounts.serializers import UserSerializer

class BuyerDemandSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)
    buyer_name = serializers.CharField(source='buyer.business_name', read_only=True)
    buyer_rating = serializers.DecimalField(source='buyer.rating', max_digits=3, decimal_places=2, read_only=True)
    buyer_payment_terms = serializers.CharField(source='buyer.payment_terms', read_only=True)
    buyer_reliability = serializers.DecimalField(source='buyer.payment_reliability_score', max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = BuyerDemand
        fields = '__all__'


class BuyerSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    demands = BuyerDemandSerializer(many=True, read_only=True)

    class Meta:
        model = Buyer
        fields = '__all__'
