from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import SystemSettings

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_overview(request):
    """Overview of available admin endpoints and their functionality."""
    endpoints = {
        'settings': {
            'url': '/api/admin/settings/',
            'methods': ['GET', 'POST'],
            'description': 'Manage system settings like maintenance mode, booking confirmation, etc.'
        },
        'users': {
            'url': '/api/users/',
            'methods': ['GET', 'POST'],
            'description': 'Manage user accounts and profiles'
        },
        'cars': {
            'url': '/api/cars/',
            'methods': ['GET', 'POST', 'PUT', 'DELETE'],
            'description': 'Manage car listings and inventory'
        },
        'bookings': {
            'url': '/api/bookings/',
            'methods': ['GET', 'PUT'],
            'description': 'View and manage booking requests'
        }
    }
    
    return Response({
        'message': 'Admin API Overview',
        'endpoints': endpoints,
        'documentation': 'Each endpoint requires admin authentication'
    })

@api_view(['GET', 'POST'])
def system_settings(request):
    settings = SystemSettings.get_settings()
    if request.method == 'GET':
        # Allow any user to GET settings
        return Response({
            'maintenanceMode': settings.maintenance_mode,
            'bookingConfirmationRequired': settings.booking_confirmation_required,
            'maxBookingsPerUser': settings.max_bookings_per_user,
            'defaultBookingDuration': settings.default_booking_duration
        })
    # POST request (admin only)
    if not request.user.is_staff:
        return Response({'detail': 'Admin only.'}, status=status.HTTP_403_FORBIDDEN)
    data = request.data
    settings.maintenance_mode = data.get('maintenanceMode', settings.maintenance_mode)
    settings.booking_confirmation_required = data.get('bookingConfirmationRequired', settings.booking_confirmation_required)
    settings.max_bookings_per_user = data.get('maxBookingsPerUser', settings.max_bookings_per_user)
    settings.default_booking_duration = data.get('defaultBookingDuration', settings.default_booking_duration)
    settings.save()
    return Response({'status': 'success'}) 