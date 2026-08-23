from django.contrib import admin
from .models import Buyer, BuyerDemand

@admin.register(Buyer)
class BuyerAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'buyer_type', 'district', 'verification_status', 'reliability_score', 'rating')
    list_filter = ('buyer_type', 'verification_status', 'district')
    search_fields = ('business_name', 'procurement_hub', 'contact_person')

@admin.register(BuyerDemand)
class BuyerDemandAdmin(admin.ModelAdmin):
    list_display = ('buyer', 'crop', 'required_quantity', 'offered_price', 'minimum_quality', 'status', 'created_at')
    list_filter = ('status', 'crop')
    search_fields = ('buyer__business_name', 'crop__name')
