from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
from django.db import transaction
import random
from .models import User
from farmers.models import FarmerProfile


class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    farmer_profile = serializers.SerializerMethodField()

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
            'farmer_profile',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_farmer_profile(self, obj):
        if hasattr(obj, 'farmer_profile'):
            fp = obj.farmer_profile
            return {
                'id': fp.id,
                'farm_location': fp.farm_location,
                'village': fp.village,
                'district': fp.district,
                'state': fp.state,
                'farm_size_acres': float(fp.farm_size_acres),
                'organization_fpo': fp.organization_fpo,
                'fpo_member_id': fp.fpo_member_id,
                'trust_score': fp.trust_score,
                'kyc_verified': fp.verification_status == 'VERIFIED',
                'bank_account_linked': fp.bank_account_linked,
            }
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    farm_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    farm_size_acres = serializers.DecimalField(write_only=True, required=False, max_digits=6, decimal_places=2, default=2.0)
    village = serializers.CharField(write_only=True, required=False, allow_blank=True)
    district = serializers.CharField(write_only=True, required=False, allow_blank=True)
    state = serializers.CharField(write_only=True, required=False, allow_blank=True, default='Maharashtra')

    class Meta:
        model = User
        fields = [
            'name',
            'email',
            'phone_number',
            'password',
            'confirm_password',
            'role',
            'preferred_language',
            'location',
            'farm_name',
            'farm_size_acres',
            'village',
            'district',
            'state',
        ]
        extra_kwargs = {
            'phone_number': {'required': False, 'allow_blank': True},
            'email': {'required': False, 'allow_blank': True},
        }

    def validate(self, data):
        email = data.get('email')
        phone_number = data.get('phone_number')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if not email and not phone_number:
            raise serializers.ValidationError("Please provide either an Email address or Phone number.")

        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "An account with this email already exists."})

        if phone_number and User.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError({"phone_number": "An account with this phone number already exists."})

        if confirm_password and password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('confirm_password', None)
        farm_name = validated_data.pop('farm_name', '')
        farm_size_acres = validated_data.pop('farm_size_acres', 2.0)
        village = validated_data.pop('village', '')
        district = validated_data.pop('district', '')
        state = validated_data.pop('state', 'Maharashtra')

        phone_number = validated_data.get('phone_number')
        if not phone_number:
            # Auto-generate a unique 10-digit number if user signed up with email only
            while True:
                candidate = f"98{random.randint(10000000, 99999999)}"
                if not User.objects.filter(phone_number=candidate).exists():
                    phone_number = candidate
                    break
            validated_data['phone_number'] = phone_number

        with transaction.atomic():
            user = User.objects.create_user(
                password=password,
                **validated_data
            )

            # Auto-create FarmerProfile if role is FARMER
            if user.role == User.Role.FARMER:
                loc = user.location or f"{village}, {district}" if (village or district) else "Nashik, Maharashtra"
                dist = district or (user.location.split(',')[1].strip() if user.location and ',' in user.location else "Nashik")
                vil = village or (user.location.split(',')[0].strip() if user.location else "Dindori")

                FarmerProfile.objects.create(
                    user=user,
                    farm_location=loc,
                    village=vil,
                    district=dist,
                    state=state or 'Maharashtra',
                    farm_size_acres=farm_size_acres or 2.0,
                    organization_fpo=farm_name or None,
                    trust_score=90,
                    verification_status=FarmerProfile.VerificationStatus.VERIFIED,
                )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True, write_only=True)
    otp = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        identifier = data.get('email') or data.get('phone_number')
        password = data.get('password')
        otp = data.get('otp')

        if not identifier:
            raise serializers.ValidationError("Please enter your email or phone number.")

        user = None
        # Check email
        if '@' in identifier:
            user = User.objects.filter(email__iexact=identifier.strip()).first()
        else:
            user = User.objects.filter(phone_number=identifier.strip()).first()
            if not user:
                user = User.objects.filter(email__iexact=identifier.strip()).first()

        if not user:
            raise serializers.ValidationError("No account found with the provided credentials. Please sign up.")

        if password:
            authenticated_user = authenticate(username=user.phone_number, password=password)
            if not authenticated_user:
                if user.check_password(password):
                    authenticated_user = user
                else:
                    raise serializers.ValidationError("Incorrect password. Please try again.")
            user = authenticated_user
        elif otp:
            # Demo/flexible OTP login support
            if len(otp) not in [4, 6]:
                raise serializers.ValidationError("Invalid OTP code.")
        else:
            raise serializers.ValidationError("Please enter your password.")

        data['user'] = user
        return data


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    village = serializers.CharField(required=False, allow_blank=True, write_only=True)
    district = serializers.CharField(required=False, allow_blank=True, write_only=True)
    state = serializers.CharField(required=False, allow_blank=True, write_only=True)
    farm_size_acres = serializers.DecimalField(required=False, max_digits=6, decimal_places=2, write_only=True)
    organization_fpo = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = [
            'name',
            'email',
            'phone_number',
            'location',
            'preferred_language',
            'village',
            'district',
            'state',
            'farm_size_acres',
            'organization_fpo',
        ]

    def update(self, instance, validated_data):
        village = validated_data.pop('village', None)
        district = validated_data.pop('district', None)
        state = validated_data.pop('state', None)
        farm_size_acres = validated_data.pop('farm_size_acres', None)
        organization_fpo = validated_data.pop('organization_fpo', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update farmer profile if exists
        if hasattr(instance, 'farmer_profile'):
            fp = instance.farmer_profile
            if village is not None:
                fp.village = village
            if district is not None:
                fp.district = district
            if state is not None:
                fp.state = state
            if farm_size_acres is not None:
                fp.farm_size_acres = farm_size_acres
            if organization_fpo is not None:
                fp.organization_fpo = organization_fpo
            if instance.location:
                fp.farm_location = instance.location
            fp.save()

        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, min_length=6, write_only=True)
    confirm_new_password = serializers.CharField(required=False, write_only=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data.get('old_password')):
            raise serializers.ValidationError({"old_password": "Current password is incorrect."})
        
        confirm = data.get('confirm_new_password')
        if confirm and data.get('new_password') != confirm:
            raise serializers.ValidationError({"confirm_new_password": "New passwords do not match."})
        
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)

    def validate_email(self, value):
        identifier = value.strip()
        user = None
        if '@' in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
        else:
            user = User.objects.filter(phone_number=identifier).first()

        if not user:
            raise serializers.ValidationError("No account found with this email address or phone number.")
        return identifier


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6, write_only=True)
    confirm_new_password = serializers.CharField(required=False, write_only=True)

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"token": "Invalid or expired password reset link."})

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError({"token": "Invalid or expired password reset token."})

        confirm = data.get('confirm_new_password')
        if confirm and data['new_password'] != confirm:
            raise serializers.ValidationError({"confirm_new_password": "Passwords do not match."})

        data['user'] = user
        return data

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
