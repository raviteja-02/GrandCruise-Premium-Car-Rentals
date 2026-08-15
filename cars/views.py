from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Car
from .serializers import CarSerializer
from .filters import CarFilter
from .models import CarGallery
from .serializers import CarGallerySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

# Create your views here.

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CarFilter
    search_fields = ['brand', 'model', 'description']
    ordering_fields = ['price_per_day', 'year', 'created_at', 'rating']
    ordering = ['-created_at']  # Default ordering

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'blocked_dates']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def blocked_dates(self, request, pk=None):
        car = self.get_object()
        from bookings.models import Booking
        active_bookings = Booking.objects.filter(
            car=car,
            status__in=['pending', 'confirmed']
        ).values('start_date', 'end_date')
        
        formatted_dates = []
        for b in active_bookings:
            formatted_dates.append({
                'start_date': b['start_date'].strftime('%Y-%m-%d'),
                'end_date': b['end_date'].strftime('%Y-%m-%d')
            })
            
        return Response(formatted_dates)

class CarGalleryViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing car gallery instances.
    It supports filtering by car ID via a query parameter.
    Example: `/api/car-gallery/?car=16`
    """
    # This remains the default queryset if no filtering is applied.
    queryset = CarGallery.objects.all()
    serializer_class = CarGallerySerializer

    def get_permissions(self):
        # Your permission logic is perfectly fine and requires no changes.
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    # --- THIS IS THE FIX ---
    def get_queryset(self):
        """
        This method is overridden to allow filtering the galleries
        based on the 'car' query parameter in the URL.
        """
        # Start with the base queryset defined for the class.
        queryset = super().get_queryset()

        # Get the 'car' ID from the URL's query parameters (e.g., /?car=16)
        car_id = self.request.query_params.get('car', None)

        # If a 'car_id' is provided in the URL, filter the queryset.
        if car_id is not None:
            # This filters the gallery objects where the 'car' foreign key's ID
            # matches the provided car_id.
            queryset = queryset.filter(car__id=car_id)
        
        # Return the final (potentially filtered) queryset.
        return queryset

class CarGalleryScrapeView(APIView):
    def get(self, request):
        gallery_url = request.query_params.get('url')
        if not gallery_url:
            return Response({'error': 'No URL provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        driver = None
        try:
            options = Options()
            options.headless = True
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-gpu')
            options.add_argument('--window-size=1920,1080')
            options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            
            driver = webdriver.Chrome(options=options)
            driver.get(gallery_url)
            
            # Wait longer for dynamic content to load
            time.sleep(20)
            
            # Try to scroll down to trigger lazy loading
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(5)
            
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
            images = []
            
            # Try multiple selectors for exterior images
            selectors = [
                'div#Exterior img',
                'div[data-section="Exterior"] img',
                '.exterior-images img',
                '.gallery-images img',
                'img[src*="carexteriorimages"]',
                'img[src*="cardekho"]'
            ]
            
            for selector in selectors:
                imgs = soup.select(selector)
                for img in imgs:
                    src = img.get('src', '')
                    if (src.startswith('http') and 
                        (src.endswith('.jpg') or src.endswith('.jpeg') or src.endswith('.png')) and
                        'spacer' not in src.lower() and
                        'placeholder' not in src.lower()):
                        images.append(src)
                
                if images:
                    break  # If we found images with this selector, stop trying others
            
            # If still no images, try a broader approach
            if not images:
                all_imgs = soup.find_all('img')
                for img in all_imgs:
                    src = img.get('src', '')
                    if (src.startswith('http') and 
                        'cardekho' in src and
                        (src.endswith('.jpg') or src.endswith('.jpeg') or src.endswith('.png')) and
                        'spacer' not in src.lower() and
                        'placeholder' not in src.lower()):
                        images.append(src)
            
            # Remove duplicates while preserving order
            seen = set()
            unique_images = []
            for img in images:
                if img not in seen:
                    seen.add(img)
                    unique_images.append(img)
            
            return Response({
                'images': unique_images,
                'total_found': len(unique_images),
                'page_title': soup.title.string if soup.title else 'No title'
            })
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            return Response({
                'error': str(e),
                'details': error_details,
                'images': []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            if driver:
                driver.quit()