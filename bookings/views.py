from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Booking
from .serializers import BookingSerializer
from .permissions import IsAdminOrReadOnly, IsOwnerOrAdmin

# Create your views here.

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Booking.objects.all().select_related('car', 'user')
        return Booking.objects.filter(user=self.request.user).select_related('car', 'user')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        car = serializer.validated_data['car']
        if not car.is_available:
            return Response(
                {'error': 'Car is not available for the selected dates'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check for overlapping bookings
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        
        if start_date < timezone.now().date():
            return Response(
                {'error': 'Start date cannot be in the past'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if end_date < start_date:
            return Response(
                {'error': 'End date cannot be before start date'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        overlapping_bookings = Booking.objects.filter(
            car=car,
            status__in=['pending', 'confirmed'],
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        if overlapping_bookings.exists():
            return Response(
                {'error': 'Car is already booked for the selected dates'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create booking
        booking = serializer.save(
            user=self.request.user,
            status='pending'
        )
        
        # Update car availability
        car.is_available = False
        car.save()
        
        return booking

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can update booking status'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        booking = self.get_object()
        new_status = request.data.get('status')
        
        # Get valid status values from STATUS_CHOICES
        valid_statuses = [status[0] for status in Booking.STATUS_CHOICES]
        
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # For admins, only check status transition rules, not cancellation rules
        if new_status == 'completed' and booking.status not in ['confirmed']:
            return Response(
                {'error': 'Only confirmed bookings can be marked as completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status == 'confirmed' and booking.status != 'pending':
            return Response(
                {'error': 'Only pending bookings can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = new_status
        booking.save()
        
        return Response(self.get_serializer(booking).data)

    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        bookings = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Check if this is a status update
        if 'status' in request.data:
            new_status = request.data['status']
            
            # Get valid status values from STATUS_CHOICES
            valid_statuses = [status[0] for status in Booking.STATUS_CHOICES]
            
            if new_status not in valid_statuses:
                return Response(
                    {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check cancellation rules
            if new_status == 'cancelled':
                # If user is not admin, check can_be_cancelled
                if not request.user.is_staff and not instance.can_be_cancelled():
                    return Response(
                        {'error': 'This booking cannot be cancelled because it has either already started or is in a non-cancellable state'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # If user is admin, allow cancellation regardless of can_be_cancelled
            # For other status updates, check if the transition is valid
            elif new_status == 'completed' and instance.status not in ['confirmed']:
                return Response(
                    {'error': 'Only confirmed bookings can be marked as completed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif new_status == 'confirmed' and instance.status != 'pending':
                return Response(
                    {'error': 'Only pending bookings can be confirmed'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        self.perform_update(serializer)
        return Response(serializer.data)
