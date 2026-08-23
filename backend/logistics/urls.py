from django.urls import path
from .views import TransportVehicleListView, LogisticsListCreateView, LogisticsDetailView

urlpatterns = [
    path('', LogisticsListCreateView.as_view(), name='logistics-list'),
    path('vehicles/', TransportVehicleListView.as_view(), name='logistics-vehicles'),
    path('<int:pk>/', LogisticsDetailView.as_view(), name='logistics-detail'),
]
