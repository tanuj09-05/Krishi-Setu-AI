from django.urls import path
from .views import RecommendationGenerateView, RecommendationLatestView, RecommendationDetailView

urlpatterns = [
    path('', RecommendationGenerateView.as_view(), name='recommendation-generate'),
    path('latest/', RecommendationLatestView.as_view(), name='recommendation-latest'),
    path('<int:pk>/', RecommendationDetailView.as_view(), name='recommendation-detail'),
]
