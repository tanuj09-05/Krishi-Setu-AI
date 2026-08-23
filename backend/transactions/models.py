import random
from django.db import models
from django.utils.translation import gettext_lazy as _
from lots.models import DigitalLot
from buyers.models import Buyer
from farmers.models import FarmerProfile

class Transaction(models.Model):
    class PaymentStatus(models.TextChoices):
        IN_ESCROW = 'IN_ESCROW', _('Secured in Safe Escrow')
        RELEASED_TO_BANK = 'RELEASED_TO_BANK', _('Released to Bank')
        COMPLETED = 'COMPLETED', _('Settlement Completed')
        DISPUTED = 'DISPUTED', _('Under Dispute Review')

    class TransactionStatus(models.TextChoices):
        DEAL_LOCKED = 'DEAL_LOCKED', _('Deal Locked')
        PICKUP_SCHEDULED = 'PICKUP_SCHEDULED', _('Pickup Scheduled')
        IN_TRANSIT = 'IN_TRANSIT', _('In Transit')
        INSPECTED = 'INSPECTED', _('Quality & Weighment Verified')
        SETTLED = 'SETTLED', _('Settled & Paid')

    lot = models.ForeignKey(DigitalLot, on_delete=models.CASCADE, related_name='transactions')
    buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='buyer_transactions')
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='farmer_transactions')

    # Deal metrics
    agreed_price = models.DecimalField(max_digits=10, decimal_places=2) # per kg
    quantity = models.DecimalField(max_digits=10, decimal_places=2) # in kg

    # Financial Breakdown (Strict Backend Formula)
    gross_amount = models.DecimalField(max_digits=12, decimal_places=2)
    transport_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    storage_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    other_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    net_realization = models.DecimalField(max_digits=12, decimal_places=2)

    payment_status = models.CharField(
        max_length=30,
        choices=PaymentStatus.choices,
        default=PaymentStatus.IN_ESCROW,
        db_index=True
    )
    transaction_status = models.CharField(
        max_length=30,
        choices=TransactionStatus.choices,
        default=TransactionStatus.DEAL_LOCKED,
        db_index=True
    )
    utr_number = models.CharField(max_length=100, blank=True, null=True)
    timeline = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # Strict backend calculation
        self.gross_amount = round(float(self.agreed_price) * float(self.quantity), 2)
        self.net_realization = round(
            float(self.gross_amount) - float(self.transport_cost) - float(self.storage_cost) - float(self.other_cost),
            2
        )
        if not self.utr_number and self.payment_status == self.PaymentStatus.COMPLETED:
            self.utr_number = f"SBIN{random.randint(1000000000, 9999999999)}"

        if not self.timeline:
            self.timeline = [
                {'step': 'Deal Locked', 'date': 'Today', 'completed': True, 'description': f"Locked at ₹{self.agreed_price}/kg with {self.buyer.business_name}"},
                {'step': 'Escrow Funded', 'date': 'Today', 'completed': True, 'description': f"₹{self.gross_amount:,.2f} secured in Agri-Escrow"},
                {'step': 'Weighment & Quality Check', 'date': 'Tomorrow', 'completed': False, 'description': 'Verification at hub arrival'},
                {'step': 'Direct DBT Settlement', 'date': 'Pending Inspection', 'completed': False, 'description': f"₹{self.net_realization:,.2f} net credit to linked bank account"},
            ]

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Txn #{self.id} on {self.lot.lot_number}: Net ₹{self.net_realization} ({self.payment_status})"
