from django.db import models
from django.utils.translation import gettext_lazy as _
from farmers.models import FarmerProfile
from crops.models import Crop

class MarketRecommendation(models.Model):
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='recommendations')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='recommendations')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=500.0) # in kg
    quality_grade = models.CharField(max_length=50, default='Grade A (Export/Premium)')
    recommended_destination_name = models.CharField(max_length=255)
    recommended_destination_type = models.CharField(max_length=50, default='BUYER') # 'BUYER' or 'MANDI'
    destination_location = models.CharField(max_length=255, default='Nashik Hub')
    distance_km = models.DecimalField(max_digits=6, decimal_places=1, default=28.0)

    # Core Net Realization Breakdown
    expected_price = models.DecimalField(max_digits=10, decimal_places=2) # per kg
    estimated_transport_cost = models.DecimalField(max_digits=10, decimal_places=2) # total
    estimated_transport_per_kg = models.DecimalField(max_digits=6, decimal_places=2) # per kg
    estimated_storage_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    estimated_net_realization = models.DecimalField(max_digits=10, decimal_places=2) # total
    estimated_net_realization_per_kg = models.DecimalField(max_digits=10, decimal_places=2) # per kg

    recommended_selling_window = models.CharField(max_length=150, default='Sell within the next 2–3 days (Peak realization window)')
    confidence_score = models.IntegerField(default=91) # e.g. 91%
    explanation = models.JSONField(default=dict) # reasons, breakdown, price_forecast
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Recommendation for {self.farmer.user.name} - {self.crop.name}: {self.recommended_destination_name} (Net ₹{self.estimated_net_realization_per_kg}/kg)"
