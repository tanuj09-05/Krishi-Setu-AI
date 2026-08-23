import random
from django.db import models
from django.utils.translation import gettext_lazy as _
from lots.models import DigitalLot

class TransportVehicle(models.Model):
    vehicle_type = models.CharField(max_length=150, unique=True)
    capacity_kg = models.IntegerField(default=750)
    base_rate_per_km = models.DecimalField(max_digits=6, decimal_places=2, default=14.00)
    loading_unloading_cost = models.DecimalField(max_digits=6, decimal_places=2, default=350.00)
    estimated_speed_kmph = models.IntegerField(default=40)
    driver_rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.85)
    availability = models.CharField(max_length=50, default='Available Immediately')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.vehicle_type} (Capacity: {self.capacity_kg}kg, ₹{self.base_rate_per_km}/km)"


class Logistics(models.Model):
    class Status(models.TextChoices):
        REQUESTED = 'REQUESTED', _('Requested')
        DRIVER_ASSIGNED = 'DRIVER_ASSIGNED', _('Driver Assigned')
        LOADED = 'LOADED', _('Loaded at Farm Gate')
        IN_TRANSIT = 'IN_TRANSIT', _('In Transit')
        DELIVERED = 'DELIVERED', _('Delivered at Hub / Market')
        CANCELLED = 'CANCELLED', _('Cancelled')

    lot = models.ForeignKey(DigitalLot, on_delete=models.SET_NULL, null=True, blank=True, related_name='logistics_bookings')
    pickup_location = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    distance_km = models.DecimalField(max_digits=6, decimal_places=1)
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2, default=500.0)
    vehicle_type = models.CharField(max_length=150, default='Tata Ace (Chhota Hathi)')
    driver_name = models.CharField(max_length=100, default='Kishor Gaikwad')
    driver_phone = models.CharField(max_length=20, default='+91 97654 32109')
    vehicle_number = models.CharField(max_length=50, default='MH-15-EG-4412')
    estimated_transport_cost = models.DecimalField(max_digits=10, decimal_places=2)
    cost_per_kg = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRIVER_ASSIGNED)
    tracking_number = models.CharField(max_length=50, unique=True, db_index=True)
    estimated_delivery_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = f"KS-LOG-{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tracking_number}: {self.pickup_location} → {self.destination} ({self.status})"
