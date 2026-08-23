"""
Production-ready Role-Based and Object-Level Permission Classes for KrishiSetu AI.
"""

from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser)
        )


class IsFarmer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.role == 'FARMER' or request.user.role == 'ADMIN' or request.user.is_superuser


class IsBuyer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.role == 'BUYER' or request.user.role == 'ADMIN' or request.user.is_superuser


class IsFPO(permissions.BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.role == 'FPO' or request.user.role == 'ADMIN' or request.user.is_superuser


class IsLotOwnerOrPublishedReadOnly(permissions.BasePermission):
    """
    Farmers can read/write their own lots.
    Buyers and FPOs can read lots if they are in 'PUBLISHED' or active deal status.
    """
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser:
            return True

        # Farmer owns the lot
        if hasattr(request.user, 'farmer_profile') and obj.farmer_id == request.user.farmer_profile.id:
            return True

        # Read-only access for Buyers/FPOs if lot is published
        if request.method in permissions.SAFE_METHODS:
            return obj.status in ['PUBLISHED', 'OFFER_RECEIVED', 'DEAL_LOCKED', 'DISPATCHED', 'COMPLETED']

        return False


class IsOfferParticipant(permissions.BasePermission):
    """
    Only the lot owner (Farmer) or the offer maker (Buyer) can view or interact with an offer.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser:
            return True

        # Buyer who submitted the offer
        if hasattr(request.user, 'buyer_profile') and obj.buyer_id == request.user.buyer_profile.id:
            return True

        # Farmer whose lot received the offer
        if hasattr(request.user, 'farmer_profile') and obj.lot.farmer_id == request.user.farmer_profile.id:
            return True

        return False


class IsBuyerDemandOwner(permissions.BasePermission):
    """
    Buyers can manage their own procurement demands. Others have read-only access to active demands.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser:
            return True

        if hasattr(request.user, 'buyer_profile') and obj.buyer_id == request.user.buyer_profile.id:
            return True

        return request.method in permissions.SAFE_METHODS


class IsTransactionParticipant(permissions.BasePermission):
    """
    Strict financial object isolation: Only the specific farmer or buyer involved in the trade (or admin) can view.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN' or request.user.is_staff or request.user.is_superuser:
            return True

        # Farmer participant
        if hasattr(request.user, 'farmer_profile') and obj.farmer_id == request.user.farmer_profile.id:
            return True

        # Buyer participant
        if hasattr(request.user, 'buyer_profile') and obj.buyer_id == request.user.buyer_profile.id:
            return True

        return False
