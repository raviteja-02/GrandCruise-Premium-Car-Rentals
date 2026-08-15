from django.contrib import admin
from .models import Car, CarGallery

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ["brand", "model", "year", "price_per_day", "is_available"]
    list_filter = ["brand", "is_available", "category"]
    search_fields = ["brand", "model"]

@admin.register(CarGallery)
class CarGalleryAdmin(admin.ModelAdmin):
    list_display = ["car"]