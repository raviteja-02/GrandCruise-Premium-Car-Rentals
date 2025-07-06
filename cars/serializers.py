from rest_framework import serializers
from .models import Car
from .models import CarGallery

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'  # This will include all fields from the model
        read_only_fields = ['created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # No need to modify the image field since it's already a URL
        return representation 
    
class CarGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = CarGallery
        fields = ['car', 'gallery_url', 'images']