from django.core.management.base import BaseCommand
from cars.models import Car

class Command(BaseCommand):
    help = 'Loads sample car data into the database'

    def handle(self, *args, **kwargs):
        sample_cars = [
            {
                'brand': 'Toyota',
                'model': 'Camry',
                'year': 2023,
                'seats': 5,
                'price_per_day': 50.00,
                'description': 'Comfortable and reliable sedan perfect for family trips.',
                'is_available': True
            },
            {
                'brand': 'Honda',
                'model': 'CR-V',
                'year': 2023,
                'seats': 5,
                'price_per_day': 55.00,
                'description': 'Spacious SUV with excellent fuel efficiency and modern features.',
                'is_available': True
            },
            {
                'brand': 'Tesla',
                'model': 'Model 3',
                'year': 2023,
                'seats': 5,
                'price_per_day': 75.00,
                'description': 'Electric sedan with impressive range and cutting-edge technology.',
                'is_available': True
            },
            {
                'brand': 'BMW',
                'model': 'X5',
                'year': 2023,
                'seats': 7,
                'price_per_day': 90.00,
                'description': 'Luxury SUV with powerful performance and premium features.',
                'is_available': True
            },
            {
                'brand': 'Mercedes-Benz',
                'model': 'C-Class',
                'year': 2023,
                'seats': 5,
                'price_per_day': 85.00,
                'description': 'Elegant luxury sedan with sophisticated design and comfort.',
                'is_available': True
            },
            {
                'brand': 'Audi',
                'model': 'Q5',
                'year': 2023,
                'seats': 5,
                'price_per_day': 80.00,
                'description': 'Premium SUV with quattro all-wheel drive and modern amenities.',
                'is_available': True
            },
            {
                'brand': 'Ford',
                'model': 'Mustang',
                'year': 2023,
                'seats': 4,
                'price_per_day': 70.00,
                'description': 'Iconic sports car with powerful performance and classic styling.',
                'is_available': True
            },
            {
                'brand': 'Hyundai',
                'model': 'Tucson',
                'year': 2023,
                'seats': 5,
                'price_per_day': 45.00,
                'description': 'Modern SUV with great value and comprehensive features.',
                'is_available': True
            }
        ]

        for car_data in sample_cars:
            Car.objects.get_or_create(
                brand=car_data['brand'],
                model=car_data['model'],
                year=car_data['year'],
                defaults=car_data
            )

        self.stdout.write(self.style.SUCCESS('Successfully loaded sample car data')) 