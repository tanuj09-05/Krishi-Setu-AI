from django.contrib import admin
from .models import DigitalLot, LotImage, Offer

class LotImageInline(admin.TabularInline):
    model = LotImage
    extra = 1

class OfferInline(admin.TabularInline):
    model = Offer
    extra = 0

@admin.register(DigitalLot)
class DigitalLotAdmin(admin.ModelAdmin):
    list_display = ('lot_number', 'farmer', 'crop', 'quantity', 'asking_price', 'quality_grade', 'status', 'created_at')
    list_filter = ('status', 'quality_grade', 'crop')
    search_fields = ('lot_number', 'farmer__user__name', 'crop__name', 'location')
    inlines = [LotImageInline, OfferInline]

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('lot', 'buyer', 'offered_price', 'quantity', 'estimated_net_realization_per_kg', 'status', 'created_at')
    list_filter = ('status', 'buyer')
    search_fields = ('lot__lot_number', 'buyer__business_name')
