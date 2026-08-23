from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db import transaction
from .models import DigitalLot, LotImage, Offer
from .serializers import DigitalLotSerializer, OfferSerializer
from core.permissions import IsLotOwnerOrPublishedReadOnly, IsOfferParticipant, IsFarmer, IsBuyer
from farmers.models import FarmerProfile
from crops.models import Crop
from buyers.models import Buyer
from transactions.models import Transaction
from logistics.models import Logistics, TransportVehicle

class LotListCreateView(generics.ListCreateAPIView):
    serializer_class = DigitalLotSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = DigitalLot.objects.select_related('farmer__user', 'crop').prefetch_related('offers__buyer', 'images').all()
        status_param = self.request.query_params.get('status')
        crop_name = self.request.query_params.get('crop')
        scope = self.request.query_params.get('scope')

        # Role-based queryset scoping:
        user = self.request.user
        if user.is_authenticated:
            if hasattr(user, 'farmer_profile') and scope == 'mine':
                queryset = queryset.filter(farmer=user.farmer_profile)
            elif hasattr(user, 'buyer_profile'):
                # Buyers see available published lots
                queryset = queryset.filter(status__in=[
                    DigitalLot.LotStatus.PUBLISHED,
                    DigitalLot.LotStatus.OFFER_RECEIVED,
                    DigitalLot.LotStatus.DEAL_LOCKED,
                ])
        else:
            # Unauthenticated public demo browse sees published lots
            if not status_param:
                queryset = queryset.filter(status__in=[
                    DigitalLot.LotStatus.PUBLISHED,
                    DigitalLot.LotStatus.OFFER_RECEIVED,
                    DigitalLot.LotStatus.DEAL_LOCKED,
                    DigitalLot.LotStatus.DISPATCHED,
                    DigitalLot.LotStatus.COMPLETED,
                ])

        if status_param:
            queryset = queryset.filter(status__iexact=status_param)
        if crop_name:
            queryset = queryset.filter(crop__name__icontains=crop_name)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'farmer_profile'):
            farmer = user.farmer_profile
        else:
            farmer = FarmerProfile.objects.first()

        crop_id = self.request.data.get('crop')
        crop_name = self.request.data.get('crop_name')
        if not crop_id and crop_name:
            crop = Crop.objects.filter(name__icontains=crop_name).first()
            if crop:
                serializer.save(farmer=farmer, crop=crop)
                return

        serializer.save(farmer=farmer)


class LotDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DigitalLot.objects.select_related('farmer__user', 'crop').prefetch_related('offers__buyer', 'images').all()
    serializer_class = DigitalLotSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsLotOwnerOrPublishedReadOnly]


class OfferListCreateView(generics.ListCreateAPIView):
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Offer.objects.select_related('buyer', 'lot__crop', 'lot__farmer__user').all()
        lot_id = self.request.query_params.get('lot_id')
        user = self.request.user

        if user.is_authenticated:
            if hasattr(user, 'farmer_profile'):
                queryset = queryset.filter(lot__farmer=user.farmer_profile)
            elif hasattr(user, 'buyer_profile'):
                queryset = queryset.filter(buyer=user.buyer_profile)

        if lot_id:
            queryset = queryset.filter(lot_id=lot_id)
        return queryset

    def perform_create(self, serializer):
        lot_id = self.request.data.get('lot')
        lot = DigitalLot.objects.get(id=lot_id)

        user = self.request.user
        if user.is_authenticated and hasattr(user, 'buyer_profile'):
            buyer = user.buyer_profile
        else:
            buyer_id = self.request.data.get('buyer')
            if buyer_id:
                buyer = Buyer.objects.get(id=buyer_id)
            else:
                buyer = Buyer.objects.first()

        offer = serializer.save(lot=lot, buyer=buyer)
        if lot.status == DigitalLot.LotStatus.PUBLISHED:
            lot.status = DigitalLot.LotStatus.OFFER_RECEIVED
            lot.save()


class OfferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Offer.objects.select_related('buyer', 'lot__crop', 'lot__farmer__user').all()
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOfferParticipant]

    @transaction.atomic
    def patch(self, request, *args, **kwargs):
        offer = self.get_object()
        action = request.data.get('action')

        if action == 'accept':
            offer.status = Offer.OfferStatus.ACCEPTED
            offer.save()

            lot = offer.lot
            lot.status = DigitalLot.LotStatus.DEAL_LOCKED
            lot.save()

            # Reject other pending offers on this lot
            Offer.objects.filter(lot=lot, status=Offer.OfferStatus.PENDING).exclude(id=offer.id).update(
                status=Offer.OfferStatus.REJECTED
            )

            # Auto-generate Verified Transaction & Escrow Entry
            agreed_price = float(offer.offered_price)
            quantity = float(offer.quantity)
            gross_amount = round(agreed_price * quantity, 2)
            transport_cost = round(float(offer.estimated_transport_per_kg or 1.50) * quantity, 2)
            net_realization = round(gross_amount - transport_cost, 2)

            txn, _ = Transaction.objects.get_or_create(
                lot=lot,
                defaults={
                    'farmer': lot.farmer,
                    'buyer': offer.buyer,
                    'agreed_price': agreed_price,
                    'quantity': quantity,
                    'gross_amount': gross_amount,
                    'transport_cost': transport_cost,
                    'storage_cost': 0.0,
                    'other_cost': 0.0,
                    'net_realization': net_realization,
                    'payment_status': Transaction.PaymentStatus.IN_ESCROW,
                    'transaction_status': Transaction.TransactionStatus.DEAL_LOCKED,
                }
            )

            # Auto-generate or link Logistics booking
            vehicle = TransportVehicle.objects.first()
            Logistics.objects.get_or_create(
                lot=lot,
                defaults={
                    'pickup_location': f"Farm Gate, {lot.farmer.village} ({lot.farmer.district})",
                    'destination': f"{offer.buyer.business_name} Collection Hub, {offer.buyer.district}",
                    'vehicle_type': vehicle.vehicle_type if vehicle else 'Tata Ace (Chhota Hathi)',
                    'driver_name': 'Kishor Gaikwad',
                    'driver_phone': '+91 97654 32109',
                    'vehicle_number': 'MH-15-EG-4412',
                    'distance_km': float(offer.buyer.distance_km_default or 28.0),
                    'quantity_kg': quantity,
                    'estimated_transport_cost': transport_cost,
                    'cost_per_kg': float(offer.estimated_transport_per_kg or 1.50),
                    'status': Logistics.Status.DRIVER_ASSIGNED,
                }
            )

            return Response(OfferSerializer(offer).data, status=status.HTTP_200_OK)

        elif action == 'reject':
            offer.status = Offer.OfferStatus.REJECTED
            offer.save()
            return Response(OfferSerializer(offer).data, status=status.HTTP_200_OK)

        elif action == 'counter':
            counter_price = request.data.get('counter_price')
            if counter_price:
                offer.status = Offer.OfferStatus.COUNTERED
                offer.counter_price = counter_price
                offer.save()
                return Response(OfferSerializer(offer).data, status=status.HTTP_200_OK)

        return super().patch(request, *args, **kwargs)
