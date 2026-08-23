from django.urls import path
from .views import (
    MarketListView,
    MarketDetailView,
    MarketPriceListView,
    MarketPriceHistoryView,
    MarketPriceTrendView,
    MarketPriceForecastView,
    MarketCompareView,
)

urlpatterns = [
    path('', MarketListView.as_view(), name='market-list'),
    path('<int:pk>/', MarketDetailView.as_view(), name='market-detail'),
    path('prices/', MarketPriceListView.as_view(), name='market-price-list'),
    path('prices/history/', MarketPriceHistoryView.as_view(), name='market-price-history'),
    path('prices/trend/', MarketPriceTrendView.as_view(), name='market-price-trend'),
    path('prices/forecast/', MarketPriceForecastView.as_view(), name='market-price-forecast'),
    path('compare/', MarketCompareView.as_view(), name='market-compare'),
]
