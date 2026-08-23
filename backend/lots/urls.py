from django.urls import path
from .views import LotListCreateView, LotDetailView, OfferListCreateView, OfferDetailView

urlpatterns = [
    path('', LotListCreateView.as_view(), name='lot-list'),
    path('offers/', OfferListCreateView.as_view(), name='offer-list'),
    path('offers/<int:pk>/', OfferDetailView.as_view(), name='offer-detail'),
    path('<int:pk>/', LotDetailView.as_view(), name='lot-detail'),
]
