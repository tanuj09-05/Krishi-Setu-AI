import datetime
import random
from django.db import models
from django.utils.translation import gettext_lazy as _
from farmers.models import FarmerProfile
from crops.models import Crop
from buyers.models import Buyer

class DigitalLot(models.Model):
    class QualityGrade(models.TextChoices):
        GRADE_A = 'GRADE_A', _('Grade A (Export/Premium)')
        GRADE_B = 'GRADE_B', _('Grade B (Supermarket/Standard)')
        GRADE_C = 'GRADE_C', _('Grade C (Processing/Bulk)')

    class LotStatus(models.TextChoices):
        DRAFT = 'DRAFT', _('Draft')
        PUBLISHED = 'PUBLISHED', _('Published / Active')
        OFFER_RECEIVED = 'OFFER_RECEIVED', _('Offer Received')
        NEGOTIATING = 'NEGOTIATING', _('Negotiating')
        DEAL_LOCKED = 'DEAL_LOCKED', _('Deal Locked')
        IN_TRANSIT = 'IN_TRANSIT', _('In Transit')
        SOLD = 'SOLD', _('Settled & Sold')
        CANCELLED = 'CANCELLED', _('Cancelled')

    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='digital_lots')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='lots')
    lot_number = models.CharField(max_length=50, unique=True, db_index=True)
    variety = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2) # in kg
    quality_grade = models.CharField(max_length=20, choices=QualityGrade.choices, default=QualityGrade.GRADE_A)
    harvest_date = models.DateField(default=datetime.date.today, null=True, blank=True)
    asking_price = models.DecimalField(max_digits=10, decimal_places=2) # per kg
    location = models.CharField(max_length=255, default='Farm Gate, Nashik')
    farm_pincode = models.CharField(max_length=10, default='422202')
    moisture_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=LotStatus.choices, default=LotStatus.PUBLISHED, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.lot_number:
            crop_code = (self.crop.name[:3] if self.crop else 'CRP').upper()
            self.lot_number = f"LOT-{crop_code}-{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.lot_number} - {self.crop.name} ({self.quantity}kg, {self.status})"


class LotImage(models.Model):
    lot = models.ForeignKey(DigitalLot, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=500)
    caption = models.CharField(max_length=150, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.lot.lot_number}"


class Offer(models.Model):
    class OfferStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending Review')
        ACCEPTED = 'ACCEPTED', _('Accepted & Deal Locked')
        REJECTED = 'REJECTED', _('Rejected')
        COUNTERED = 'COUNTERED', _('Counter Proposed')
        EXPIRED = 'EXPIRED', _('Expired')

    lot = models.ForeignKey(DigitalLot, on_delete=models.CASCADE, related_name='offers')
    buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='offers_made')
    offered_price = models.DecimalField(max_digits=10, decimal_places=2) # per kg
    quantity = models.DecimalField(max_digits=10, decimal_places=2) # in kg
    estimated_transport_per_kg = models.DecimalField(max_digits=6, decimal_places=2, default=1.50)
    estimated_net_realization_per_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    message = models.TextField(blank=True, null=True)
    payment_terms = models.CharField(max_length=100, default='Instant Digital (T+0)')
    pickup_offered = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=OfferStatus.choices, default=OfferStatus.PENDING, db_index=True)
    counter_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.estimated_net_realization_per_kg:
            self.estimated_net_realization_per_kg = max(
                0, float(self.offered_price) - float(self.estimated_transport_per_kg)
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Offer from {self.buyer.business_name} on {self.lot.lot_number}: ₹{self.offered_price}/kg ({self.status})"
