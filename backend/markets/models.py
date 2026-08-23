from django.db import models
from django.utils.translation import gettext_lazy as _
from crops.models import Crop

class Market(models.Model):
    class MarketType(models.TextChoices):
        MANDI = 'MANDI', _('APMC Regulated Mandi')
        PROCESSOR = 'PROCESSOR', _('Food Processing Unit')
        INSTITUTIONAL_BUYER = 'INSTITUTIONAL_BUYER', _('Corporate / Retail Procurement Hub')
        DIGITAL_MARKET = 'DIGITAL_MARKET', _('Digital Spot / E-Market')

    name = models.CharField(max_length=200, db_index=True)
    type = models.CharField(max_length=30, choices=MarketType.choices, default=MarketType.MANDI, db_index=True)
    location = models.CharField(max_length=255)
    district = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, default='Maharashtra', db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    active = models.BooleanField(default=True, db_index=True)
    distance_km_default = models.DecimalField(max_digits=6, decimal_places=1, default=25.0)

    # Operational parameters for true net realization deduction
    market_fee_percent = models.DecimalField(max_digits=4, decimal_places=2, default=1.0) # e.g. 1.05%
    weighment_cost_per_kg = models.DecimalField(max_digits=4, decimal_places=2, default=0.10)
    unloading_cost_per_kg = models.DecimalField(max_digits=4, decimal_places=2, default=0.15)
    payment_cycle_days = models.IntegerField(default=2)
    reliability_score = models.IntegerField(default=85)
    operating_hours = models.CharField(max_length=100, default='5:00 AM - 2:00 PM')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()} - {self.district})"


class MarketPrice(models.Model):
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='prices')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='market_prices')
    date = models.DateField(db_index=True)
    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)
    modal_price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    arrival_volume = models.DecimalField(max_digits=12, decimal_places=2, default=0.0) # in quintals
    arrival_trend = models.CharField(max_length=20, default='steady') # 'rising', 'steady', 'dropping'
    unit = models.CharField(max_length=20, default='kg')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', 'crop']
        indexes = [
            models.Index(fields=['crop', 'market', 'date']),
            models.Index(fields=['market', 'date']),
            models.Index(fields=['crop', 'date']),
        ]

    def __str__(self):
        return f"{self.market.name} - {self.crop.name} ({self.date}): ₹{self.modal_price}/{self.unit}"
