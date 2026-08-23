from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from .models import User

class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'phone_number',
            'name',
            'email',
            'role',
            'role_display',
            'preferred_language',
            'location',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'phone_number',
            'name',
            'email',
            'role',
            'preferred_language',
            'location',
            'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True)
    otp = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        phone_number = data.get('phone_number')
        email = data.get('email')
        password = data.get('password')
        otp = data.get('otp')

        user = None
        if email:
            user = User.objects.filter(email__iexact=email).first()
        elif phone_number:
            user = User.objects.filter(phone_number=phone_number).first()

        if not user:
            raise serializers.ValidationError("No active user account found with the provided credentials.")

        if password:
            authenticated_user = authenticate(username=user.phone_number, password=password)
            if not authenticated_user:
                # Also check direct check_password if phone is not username
                if user.check_password(password):
                    authenticated_user = user
                else:
                    raise serializers.ValidationError("Incorrect password.")
            user = authenticated_user
        elif otp:
            # Flexible OTP verification for demo/testing
            if len(otp) not in [4, 6]:
                raise serializers.ValidationError("Invalid OTP format.")
        else:
            # Demo direct signin
            pass

        data['user'] = user
        return data
