from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from crops.models import Crop

class FarmerProfile(models.Model):
    class VerificationStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending Verification')
        VERIFIED = 'VERIFIED', _('KYC Verified')
        REJECTED = 'REJECTED', _('Rejected')

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='farmer_profile')
    farm_location = models.CharField(max_length=255)
    village = models.CharField(max_length=100, blank=True, null=True)
    taluka = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, default='Maharashtra', db_index=True)
    farm_size_acres = models.DecimalField(max_digits=6, decimal_places=2, default=2.0)
    organization_fpo = models.CharField(max_length=200, blank=True, null=True)
    fpo_member_id = models.CharField(max_length=100, blank=True, null=True)
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.VERIFIED
    )
    trust_score = models.IntegerField(default=90)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.8)
    completed_transactions = models.IntegerField(default=0)
    bank_account_linked = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.name} ({self.district}, {self.state})"


class FarmerCrop(models.Model):
    class QualityGrade(models.TextChoices):
        GRADE_A = 'GRADE_A', _('Grade A (Export / Premium)')
        GRADE_B = 'GRADE_B', _('Grade B (Supermarket / Standard)')
        GRADE_C = 'GRADE_C', _('Grade C (Processing / Bulk)')

    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='harvests')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='farmer_harvests')
    variety = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2) # in kg
    available_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    harvest_date = models.DateField()
    expected_price = models.DecimalField(max_digits=10, decimal_places=2) # per kg
    quality_grade = models.CharField(max_length=20, choices=QualityGrade.choices, default=QualityGrade.GRADE_A)
    location = models.CharField(max_length=255, blank=True, null=True)
    moisture_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.farmer.user.name} - {self.crop.name} ({self.quantity}kg)"
