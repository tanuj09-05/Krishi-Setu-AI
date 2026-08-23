from django.contrib import admin
from .models import Market, MarketPrice

@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'district', 'state', 'distance_km_default', 'market_fee_percent', 'active')
    list_filter = ('type', 'state', 'district', 'active')
    search_fields = ('name', 'district', 'location')

@admin.register(MarketPrice)
class MarketPriceAdmin(admin.ModelAdmin):
    list_display = ('market', 'crop', 'date', 'modal_price', 'arrival_volume', 'arrival_trend', 'unit')
    list_filter = ('crop', 'date', 'arrival_trend')
    search_fields = ('market__name', 'crop__name')
