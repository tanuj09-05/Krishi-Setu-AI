from django.urls import path
from .views import BuyerListView, BuyerDetailView, BuyerDemandListView, BuyerDemandDetailView

urlpatterns = [
    path('', BuyerListView.as_view(), name='buyer-list'),
    path('demand/', BuyerDemandListView.as_view(), name='buyer-demand'),
    path('demand/<int:pk>/', BuyerDemandDetailView.as_view(), name='buyer-demand-detail'),
    path('<int:pk>/', BuyerDetailView.as_view(), name='buyer-detail'),
]
