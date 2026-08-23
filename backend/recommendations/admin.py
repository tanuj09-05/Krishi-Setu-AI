from django.contrib import admin
from .models import MarketRecommendation

@admin.register(MarketRecommendation)
class MarketRecommendationAdmin(admin.ModelAdmin):
    list_display = (
        'farmer',
        'crop',
        'quantity',
        'recommended_destination_name',
        'expected_price',
        'estimated_transport_per_kg',
        'estimated_net_realization_per_kg',
        'confidence_score',
        'created_at',
    )
    list_filter = ('crop', 'confidence_score', 'recommended_destination_type')
    search_fields = ('farmer__user__name', 'crop__name', 'recommended_destination_name')
