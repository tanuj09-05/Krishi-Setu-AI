from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'lot',
        'buyer',
        'farmer',
        'agreed_price',
        'quantity',
        'gross_amount',
        'transport_cost',
        'net_realization',
        'payment_status',
        'transaction_status',
        'created_at',
    )
    list_filter = ('payment_status', 'transaction_status')
    search_fields = ('lot__lot_number', 'buyer__business_name', 'farmer__user__name', 'utr_number')
