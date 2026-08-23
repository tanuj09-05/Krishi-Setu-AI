from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Buyer, BuyerDemand
from .serializers import BuyerSerializer, BuyerDemandSerializer
from core.permissions import IsBuyerDemandOwner, IsBuyer

class BuyerListView(generics.ListCreateAPIView):
    queryset = Buyer.objects.prefetch_related('demands').all()
    serializer_class = BuyerSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['buyer_type', 'district', 'verification_status']
    search_fields = ['business_name', 'procurement_hub', 'location']


class BuyerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Buyer.objects.prefetch_related('demands').all()
    serializer_class = BuyerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class BuyerDemandListView(generics.ListCreateAPIView):
    serializer_class = BuyerDemandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = BuyerDemand.objects.select_related('buyer', 'crop').all()
        crop_name = self.request.query_params.get('crop')
        crop_id = self.request.query_params.get('crop_id')
        status_param = self.request.query_params.get('status')

        if status_param:
            queryset = queryset.filter(status__iexact=status_param)
        else:
            queryset = queryset.filter(status=BuyerDemand.DemandStatus.ACTIVE)

        if crop_id:
            queryset = queryset.filter(crop_id=crop_id)
        elif crop_name:
            queryset = queryset.filter(crop__name__icontains=crop_name)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'buyer_profile'):
            buyer = user.buyer_profile
        else:
            buyer = Buyer.objects.first()
        serializer.save(buyer=buyer)


class BuyerDemandDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BuyerDemand.objects.select_related('buyer', 'crop').all()
    serializer_class = BuyerDemandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsBuyerDemandOwner]
