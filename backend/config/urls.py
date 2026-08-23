"""
URL configuration for KrishiSetu AI backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/farmer/', include('farmers.urls')),
    path('api/v1/crops/', include('crops.urls')),
    path('api/v1/markets/', include('markets.urls')),
    path('api/v1/buyers/', include('buyers.urls')),
    path('api/v1/lots/', include('lots.urls')),
    path('api/v1/recommendations/', include('recommendations.urls')),
    path('api/v1/logistics/', include('logistics.urls')),
    path('api/v1/transactions/', include('transactions.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
