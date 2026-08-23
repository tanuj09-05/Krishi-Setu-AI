from rest_framework import serializers
from .models import FarmerProfile, FarmerCrop
from crops.serializers import CropSerializer
from accounts.serializers import UserSerializer

class FarmerCropSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)

    class Meta:
        model = FarmerCrop
        fields = '__all__'


class FarmerProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    harvests = FarmerCropSerializer(many=True, read_only=True)

    class Meta:
        model = FarmerProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'trust_score', 'rating', 'completed_transactions', 'created_at', 'updated_at']
