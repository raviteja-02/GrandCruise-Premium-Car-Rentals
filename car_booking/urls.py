"""
URL configuration for car_booking project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from users.views import UserViewSet
from cars.views import CarViewSet
from bookings.views import BookingViewSet
from cars.views import CarGalleryViewSet
from cars.views import CarGalleryScrapeView
from . import views

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'cars', CarViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'car-gallery', CarGalleryViewSet, basename='car-gallery')

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=True)),  # Redirect root to admin
    path('admin/', admin.site.urls),
    path('api/', include([
        path('admin/', views.admin_overview, name='admin_overview'),  # Admin overview endpoint
        path('admin/settings/', views.system_settings, name='system_settings'),
        path('', include(router.urls)),
        path('auth/login/', obtain_auth_token, name='api_token_auth'),
        path('scrape-gallery/', CarGalleryScrapeView.as_view(), name='scrape_gallery'),
    ])),
    path('api-auth/', include('rest_framework.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
