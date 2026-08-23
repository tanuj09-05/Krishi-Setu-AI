from django.urls import path
from .views import FarmerProfileView, FarmerCropListCreateView

urlpatterns = [
    path('profile/', FarmerProfileView.as_view(), name='farmer-profile'),
    path('crops/', FarmerCropListCreateView.as_view(), name='farmer-crops'),
]
