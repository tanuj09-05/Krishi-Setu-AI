from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from crops.models import Crop

class Buyer(models.Model):
    class BuyerType(models.TextChoices):
        RETAILER = 'RETAILER', _('Corporate Retailer')
        PROCESSOR = 'PROCESSOR', _('Food Processor')
        EXPORTER = 'EXPORTER', _('Export House')
        FPO_AGGREGATOR = 'FPO_AGGREGATOR', _('FPO Aggregator')
        WHOLESALER = 'WHOLESALER', _('Direct Wholesaler')
        INSTITUTION = 'INSTITUTION', _('Institutional Buyer')

    class VerificationStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending Verification')
        VERIFIED = 'VERIFIED', _('Verified Buyer')
        SUSPENDED = 'SUSPENDED', _('Suspended')

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='buyer_profile')
    business_name = models.CharField(max_length=200, db_index=True)
    buyer_type = models.CharField(max_length=30, choices=BuyerType.choices, default=BuyerType.RETAILER, db_index=True)
    procurement_hub = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    district = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, default='Maharashtra', db_index=True)
    distance_km_default = models.DecimalField(max_digits=6, decimal_places=1, default=28.0)
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.VERIFIED
    )
    reliability_score = models.IntegerField(default=95)
    payment_reliability_score = models.DecimalField(max_digits=5, decimal_places=2, default=99.0) # e.g. 99.2%
    completed_transactions = models.IntegerField(default=120)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.9)
    reviews_count = models.IntegerField(default=50)
    payment_terms = models.CharField(max_length=100, default='Instant Digital (T+0)')
    pickup_service_available = models.BooleanField(default=True)
    contact_person = models.CharField(max_length=150, blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.business_name} ({self.get_buyer_type_display()})"


class BuyerDemand(models.Model):
    class DemandStatus(models.TextChoices):
        ACTIVE = 'ACTIVE', _('Active')
        PARTIALLY_FILLED = 'PARTIALLY_FILLED', _('Partially Filled')
        CLOSED = 'CLOSED', _('Closed')
        EXPIRED = 'EXPIRED', _('Expired')

    buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='demands')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='buyer_demands')
    required_quantity = models.DecimalField(max_digits=12, decimal_places=2) # in kg
    remaining_quantity = models.DecimalField(max_digits=12, decimal_places=2)
    offered_price = models.DecimalField(max_digits=10, decimal_places=2) # per kg
    minimum_quality = models.CharField(max_length=50, default='Grade A (Export/Premium)')
    delivery_location = models.CharField(max_length=255)
    required_by = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=DemandStatus.choices, default=DemandStatus.ACTIVE, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.buyer.business_name} needs {self.required_quantity}kg {self.crop.name} @ ₹{self.offered_price}/kg"
