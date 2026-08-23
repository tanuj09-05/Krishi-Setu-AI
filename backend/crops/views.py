from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Crop
from .serializers import CropSerializer

class CropListView(generics.ListCreateAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['crop_category']
    search_fields = ['name', 'local_name']


class CropDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [AllowAny]
