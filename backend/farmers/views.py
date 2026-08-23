from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import FarmerProfile, FarmerCrop
from .serializers import FarmerProfileSerializer, FarmerCropSerializer

class FarmerProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            try:
                profile = request.user.farmer_profile
            except FarmerProfile.DoesNotExist:
                profile = FarmerProfile.objects.create(
                    user=request.user,
                    farm_location=request.user.location or 'Nashik, Maharashtra',
                    district='Nashik',
                    state='Maharashtra',
                )
        else:
            # Fallback to first farmer profile for easy frontend demo
            profile = FarmerProfile.objects.first()
            if not profile:
                return Response(
                    {'error': 'No farmer profiles found in system.'},
                    status=status.HTTP_404_NOT_FOUND
                )

        serializer = FarmerProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if request.user.is_authenticated:
            profile, _ = FarmerProfile.objects.get_or_create(
                user=request.user,
                defaults={'farm_location': 'Nashik, Maharashtra', 'district': 'Nashik', 'state': 'Maharashtra'}
            )
        else:
            profile = FarmerProfile.objects.first()
            if not profile:
                return Response({'error': 'No profile available'}, status=status.HTTP_404_NOT_FOUND)

        serializer = FarmerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FarmerCropListCreateView(generics.ListCreateAPIView):
    serializer_class = FarmerCropSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'farmer_profile'):
            return FarmerCrop.objects.filter(farmer=self.request.user.farmer_profile)
        return FarmerCrop.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'farmer_profile'):
            serializer.save(farmer=self.request.user.farmer_profile)
        else:
            first_farmer = FarmerProfile.objects.first()
            serializer.save(farmer=first_farmer)
