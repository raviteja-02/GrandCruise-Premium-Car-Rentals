import os
import requests
from django.core.management.base import BaseCommand
from cars.models import Car
from django.conf import settings

class Command(BaseCommand):
    help = 'Downloads placeholder images for cars'

    def handle(self, *args, **kwargs):
        # Create media/cars directory if it doesn't exist
        cars_dir = os.path.join(settings.MEDIA_ROOT, 'cars')
        os.makedirs(cars_dir, exist_ok=True)

        # Sample car images from Unsplash
        car_images = {
            'Toyota Camry': 'https://images.unsplash.com/photo-1617469767053-3c4f2a7c84ea',
            'Honda CR-V': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
            'Tesla Model 3': 'https://images.unsplash.com/photo-1617704548623-340376564e68',
            'BMW X5': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
            'Mercedes-Benz C-Class': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
            'Audi Q5': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
            'Ford Mustang': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
            'Hyundai Tucson': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'
        }

        for car in Car.objects.all():
            car_name = f"{car.brand} {car.model}"
            if car_name in car_images:
                try:
                    # Download image
                    response = requests.get(car_images[car_name])
                    if response.status_code == 200:
                        # Save image
                        image_path = os.path.join(cars_dir, f"{car.id}.jpg")
                        with open(image_path, 'wb') as f:
                            f.write(response.content)
                        
                        # Update car model
                        car.image = f"cars/{car.id}.jpg"
                        car.save()
                        self.stdout.write(self.style.SUCCESS(f'Successfully downloaded image for {car_name}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Failed to download image for {car_name}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error downloading image for {car_name}: {str(e)}')) 