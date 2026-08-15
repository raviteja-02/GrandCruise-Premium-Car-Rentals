from rest_framework import serializers
from .models import Booking
from cars.serializers import CarSerializer
from users.serializers import UserSerializer
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta

class BookingSerializer(serializers.ModelSerializer):
    car_details = CarSerializer(source='car', read_only=True)
    user_details = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_details', 'car', 'car_details',
            'start_date', 'end_date', 'total_price', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'total_price', 'created_at', 'updated_at']

    def get_user_details(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure the car image URL is absolute
        if 'car_details' in representation and 'image' in representation['car_details']:
            request = self.context.get('request')
            if request and representation['car_details']['image']:
                representation['car_details']['image'] = request.build_absolute_uri(representation['car_details']['image'])
                print(f"Image URL: {representation['car_details']['image']}")  # Debug log
        return representation

    def validate_start_date(self, value):
        try:
            if isinstance(value, str):
                value = datetime.strptime(value, '%Y-%m-%d').date()
            if value < (timezone.now().date() - timedelta(days=1)):
                raise serializers.ValidationError("Start date must be today or in the future")
            return value
        except (TypeError, ValueError) as e:
            raise serializers.ValidationError("Invalid start date format. Use YYYY-MM-DD")

    def validate_end_date(self, value):
        try:
            if isinstance(value, str):
                value = datetime.strptime(value, '%Y-%m-%d').date()
            start_date = self.initial_data.get('start_date')
            if isinstance(start_date, str):
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            if start_date and value < start_date:
                raise serializers.ValidationError("End date must be after start date")
            return value
        except (TypeError, ValueError) as e:
            raise serializers.ValidationError("Invalid end date format. Use YYYY-MM-DD")

    def validate(self, data):
        if 'start_date' in data and 'end_date' in data:
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError("End date must be after start date")
        return data

    def create(self, validated_data):
        try:
            # Set the user from the request context
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                validated_data['user'] = request.user
            else:
                raise serializers.ValidationError("User authentication required")

            # Calculate total price
            days = (validated_data['end_date'] - validated_data['start_date']).days + 1
            validated_data['total_price'] = days * validated_data['car'].price_per_day

            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError(f"Error creating booking: {str(e)}") 