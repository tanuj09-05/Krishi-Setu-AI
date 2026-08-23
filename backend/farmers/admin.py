from django.contrib import admin
from .models import FarmerProfile, FarmerCrop

@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'district', 'state', 'farm_size_acres', 'organization_fpo', 'trust_score', 'verification_status')
    list_filter = ('verification_status', 'state', 'district')
    search_fields = ('user__name', 'user__phone_number', 'district', 'organization_fpo')

@admin.register(FarmerCrop)
class FarmerCropAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'crop', 'quantity', 'available_quantity', 'expected_price', 'quality_grade', 'harvest_date')
    list_filter = ('quality_grade', 'crop')
    search_fields = ('farmer__user__name', 'crop__name')
