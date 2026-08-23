from django.contrib import admin
from .models import Crop

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('name', 'local_name', 'crop_category', 'unit', 'default_shelf_life_days', 'created_at')
    list_filter = ('crop_category',)
    search_fields = ('name', 'local_name')
