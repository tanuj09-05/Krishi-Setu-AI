from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .models import User

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    'message': 'Registration successful.',
                    'token': str(refresh.access_token),
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'drf_token': token.key,
                    'user': UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    'message': 'Login successful.',
                    'token': str(refresh.access_token),
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'drf_token': token.key,
                    'user': UserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data

        # Attach associated profile metadata based on role
        if request.user.role == User.Role.FARMER and hasattr(request.user, 'farmer_profile'):
            fp = request.user.farmer_profile
            data['farmer_profile'] = {
                'id': fp.id,
                'village': fp.village,
                'district': fp.district,
                'trust_score': fp.trust_score,
                'kyc_verified': fp.verification_status == 'VERIFIED',
                'bank_account_linked': fp.bank_account_linked,
            }
        elif request.user.role == User.Role.BUYER and hasattr(request.user, 'buyer_profile'):
            bp = request.user.buyer_profile
            data['buyer_profile'] = {
                'id': bp.id,
                'business_name': bp.business_name,
                'buyer_type': bp.buyer_type,
                'verified': bp.verified,
                'rating': float(bp.rating),
            }

        return Response(data, status=status.HTTP_200_OK)
