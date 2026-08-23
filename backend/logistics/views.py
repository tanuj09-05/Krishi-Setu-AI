from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import TransportVehicle, Logistics
from .serializers import TransportVehicleSerializer, LogisticsSerializer

class TransportVehicleListView(generics.ListAPIView):
    queryset = TransportVehicle.objects.all()
    serializer_class = TransportVehicleSerializer
    permission_classes = [AllowAny]


class LogisticsListCreateView(generics.ListCreateAPIView):
    queryset = Logistics.objects.select_related('lot').all()
    serializer_class = LogisticsSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        distance = float(self.request.data.get('distance_km', 28.0))
        quantity = float(self.request.data.get('quantity_kg', 500.0))
        vehicle_type = self.request.data.get('vehicle_type', 'Tata Ace (Chhota Hathi)')

        vehicle = TransportVehicle.objects.filter(vehicle_type__icontains=vehicle_type.split(' ')[0]).first()
        rate = float(vehicle.base_rate_per_km) if vehicle else 14.0
        loading = float(vehicle.loading_unloading_cost) if vehicle else 350.0

        total_cost = round((distance * rate) + loading, 2)
        cost_per_kg = round(total_cost / quantity, 2)

        serializer.save(
            estimated_transport_cost=total_cost,
            cost_per_kg=cost_per_kg
        )


class LogisticsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Logistics.objects.all()
    serializer_class = LogisticsSerializer
    permission_classes = [AllowAny]
