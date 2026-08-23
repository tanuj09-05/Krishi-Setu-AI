from django.db import models
from django.utils.translation import gettext_lazy as _

class Crop(models.Model):
    class Category(models.TextChoices):
        VEGETABLES = 'VEGETABLES', _('Vegetables')
        GRAINS = 'GRAINS', _('Grains & Cereals')
        PULSES = 'PULSES', _('Pulses')
        OILSEEDS = 'OILSEEDS', _('Oilseeds')
        FRUITS = 'FRUITS', _('Fruits')
        CASH_CROPS = 'CASH_CROPS', _('Cash Crops')

    name = models.CharField(max_length=100, unique=True, db_index=True)
    local_name = models.CharField(max_length=150, blank=True, null=True)
    crop_category = models.CharField(max_length=30, choices=Category.choices, default=Category.VEGETABLES, db_index=True)
    unit = models.CharField(max_length=20, default='kg')
    icon = models.CharField(max_length=10, default='🌱')
    default_shelf_life_days = models.IntegerField(default=7)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.crop_category})"
