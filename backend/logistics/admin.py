from django.contrib import admin
from .models import TransportVehicle, Logistics

@admin.register(TransportVehicle)
class TransportVehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_type', 'capacity_kg', 'base_rate_per_km', 'loading_unloading_cost', 'driver_rating', 'availability')
    search_fields = ('vehicle_type',)

@admin.register(Logistics)
class LogisticsAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'pickup_location', 'destination', 'distance_km', 'estimated_transport_cost', 'cost_per_kg', 'status')
    list_filter = ('status', 'vehicle_type')
    search_fields = ('tracking_number', 'pickup_location', 'destination', 'driver_name', 'vehicle_number')
