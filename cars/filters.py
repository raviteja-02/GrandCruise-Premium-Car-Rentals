from django_filters import rest_framework as filters
from .models import Car
from django.db import models

class CarFilter(filters.FilterSet):
    # Price range filter
    min_price = filters.NumberFilter(field_name="price_per_day", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price_per_day", lookup_expr='lte')
    
    # Year range filter
    min_year = filters.NumberFilter(field_name="year", lookup_expr='gte')
    max_year = filters.NumberFilter(field_name="year", lookup_expr='lte')
    
    # Seats filter
    min_seats = filters.NumberFilter(field_name="seats", lookup_expr='gte')
    max_seats = filters.NumberFilter(field_name="seats", lookup_expr='lte')
    
    # Rating filter
    min_rating = filters.NumberFilter(field_name="rating", lookup_expr='gte')
    
    # Category filter
    category = filters.CharFilter(field_name="category", lookup_expr='iexact')
    
    # Fuel type filter
    fuel_type = filters.CharFilter(field_name="fuelType", lookup_expr='iexact')
    
    # Transmission filter
    transmission = filters.CharFilter(field_name="transmission", lookup_expr='iexact')
    
    # Brand filter with case-insensitive search
    brand = filters.CharFilter(field_name="brand", lookup_expr='iexact')
    
    # Model filter with case-insensitive search
    model = filters.CharFilter(field_name="model", lookup_expr='iexact')
    
    # Color filter
    color = filters.CharFilter(field_name="color", lookup_expr='iexact')
    
    # Availability filter
    is_available = filters.BooleanFilter(field_name="is_available")
    
    # Search filter for brand, model, and description
    search = filters.CharFilter(method='search_filter')
    
    def search_filter(self, queryset, name, value):
        return queryset.filter(
            models.Q(brand__icontains=value) |
            models.Q(model__icontains=value) |
            models.Q(description__icontains=value)
        )
    
    class Meta:
        model = Car
        fields = [
            'brand', 'model', 'category', 'fuel_type', 'transmission',
            'color', 'is_available', 'min_price', 'max_price',
            'min_year', 'max_year', 'min_seats', 'max_seats',
            'min_rating', 'search'
        ] 