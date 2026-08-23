from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError(_('The Phone Number must be set'))
        user = self.model(phone_number=phone_number, username=phone_number, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(phone_number, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        FARMER = 'FARMER', _('Farmer')
        FPO = 'FPO', _('FPO / Aggregator')
        BUYER = 'BUYER', _('Buyer / Procurement Agency')
        ADMIN = 'ADMIN', _('Administrator')

    class Language(models.TextChoices):
        ENGLISH = 'en', _('English')
        MARATHI = 'mr', _('मराठी (Marathi)')
        HINDI = 'hi', _('हिंदी (Hindi)')

    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=15, unique=True, db_index=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.FARMER, db_index=True)
    preferred_language = models.CharField(max_length=10, choices=Language.choices, default=Language.ENGLISH)
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name} ({self.phone_number}) - {self.get_role_display()}"
