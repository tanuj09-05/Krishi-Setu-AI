from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import MarketRecommendation
from .serializers import MarketRecommendationSerializer, GenerateRecommendationRequestSerializer
from .services import RecommendationService
from farmers.models import FarmerProfile
from crops.models import Crop

class RecommendationGenerateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        crop_id = request.data.get('crop_id')
        crop_name = request.data.get('crop_name', 'Tomato')
        try:
            quantity_kg = float(request.data.get('quantity_kg', 500.0))
            if quantity_kg <= 0:
                quantity_kg = 500.0
        except (ValueError, TypeError):
            quantity_kg = 500.0
        quality_grade = request.data.get('quality_grade', 'Grade A (Export/Premium)')

        if request.user.is_authenticated and hasattr(request.user, 'farmer_profile'):
            farmer = request.user.farmer_profile
        else:
            farmer = FarmerProfile.objects.first()

        if crop_id:
            crop = Crop.objects.filter(id=crop_id).first()
        else:
            crop = Crop.objects.filter(name__icontains=crop_name).first()

        if not crop:
            crop = Crop.objects.first()

        if not farmer or not crop:
            return Response(
                {'error': 'Farmer profile or crop data missing in system.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        recommendation = RecommendationService.generate_recommendation(
            farmer=farmer,
            crop=crop,
            quantity_kg=quantity_kg,
            quality_grade=quality_grade,
        )

        serializer = MarketRecommendationSerializer(recommendation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        # Support GET query params as well for fast demo testing
        crop_name = request.query_params.get('crop', 'Tomato')
        try:
            quantity_kg = float(request.query_params.get('quantity_kg', 500.0))
            if quantity_kg <= 0:
                quantity_kg = 500.0
        except (ValueError, TypeError):
            quantity_kg = 500.0

        farmer = FarmerProfile.objects.first()
        crop = Crop.objects.filter(name__icontains=crop_name).first() or Crop.objects.first()

        if not farmer or not crop:
            return Response({'error': 'Please seed demo data first.'}, status=status.HTTP_400_BAD_REQUEST)

        recommendation = RecommendationService.generate_recommendation(
            farmer=farmer,
            crop=crop,
            quantity_kg=quantity_kg,
        )
        serializer = MarketRecommendationSerializer(recommendation)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecommendationLatestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        crop_name = request.query_params.get('crop', 'Tomato')
        rec = MarketRecommendation.objects.filter(crop__name__icontains=crop_name).first()

        if not rec:
            farmer = FarmerProfile.objects.first()
            crop = Crop.objects.filter(name__icontains=crop_name).first() or Crop.objects.first()
            if farmer and crop:
                rec = RecommendationService.generate_recommendation(farmer=farmer, crop=crop, quantity_kg=500.0)

        if not rec:
            return Response({'error': 'No recommendation available'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MarketRecommendationSerializer(rec)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecommendationDetailView(generics.RetrieveAPIView):
    queryset = MarketRecommendation.objects.select_related('farmer__user', 'crop').all()
    serializer_class = MarketRecommendationSerializer
    permission_classes = [AllowAny]
