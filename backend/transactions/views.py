from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Transaction
from .serializers import TransactionSerializer
from core.permissions import IsTransactionParticipant

class TransactionListView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['payment_status', 'transaction_status']

    def get_queryset(self):
        queryset = Transaction.objects.select_related('lot__crop', 'buyer', 'farmer__user').all()
        user = self.request.user

        if user.is_authenticated:
            if hasattr(user, 'farmer_profile'):
                queryset = queryset.filter(farmer=user.farmer_profile)
            elif hasattr(user, 'buyer_profile'):
                queryset = queryset.filter(buyer=user.buyer_profile)
            elif user.role == 'ADMIN' or user.is_staff or user.is_superuser:
                pass  # Admin sees all
        return queryset


class TransactionDetailView(generics.RetrieveUpdateAPIView):
    queryset = Transaction.objects.select_related('lot__crop', 'buyer', 'farmer__user').all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsTransactionParticipant]
