from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import CarGallery

@admin.register(CarGallery)
class CarGalleryAdmin(admin.ModelAdmin):
    list_display = ["car"]