from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('phone_number', 'name', 'role', 'preferred_language', 'location', 'is_staff', 'created_at')
    list_filter = ('role', 'preferred_language', 'is_staff', 'is_active')
    search_fields = ('phone_number', 'name', 'email', 'location')
    ordering = ('-created_at',)
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        ('Personal Info', {'fields': ('name', 'email', 'location', 'preferred_language', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'name', 'role', 'password', 'preferred_language', 'location'),
        }),
    )
