from rest_framework import serializers
from .models import TransportVehicle, Logistics

class TransportVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportVehicle
        fields = '__all__'


class LogisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logistics
        fields = '__all__'
        read_only_fields = ['id', 'tracking_number', 'estimated_transport_cost', 'cost_per_kg', 'created_at']
