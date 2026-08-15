import json
from django.apps import apps
from django.core.management.base import BaseCommand

Car = apps.get_model('cars', 'Car')

class Command(BaseCommand):
    help = 'Updates car details with accurate information'

    def handle(self, *args, **kwargs):
        # Put your full car_details dict here (JSON, Python literal, or load from file)
        car_details = {
            'toyota camry': {
                'brand': 'Toyota',
                'model': 'Camry',
                'year': 2024,
                'description': 'The Toyota Camry is a mid-size sedan known for its reliability, comfort, and fuel efficiency. The 2024 model features a refined interior, advanced safety features, and smooth performance.',
                'seats': 5,
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'price_per_day': 85,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Camry/11344/1733916451269/front-left-side-47.jpg?tr=w-664',
                'features': [
                    'Toyota Safety Sense 2.5+',
                    '9-inch Touchscreen',
                    'Apple CarPlay & Android Auto',
                    'Wireless Charging',
                    'JBL Premium Audio',
                    'Heated & Ventilated Seats',
                    'Panoramic Roof',
                    'Smart Key System'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.5L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '208 hp'},
                    {'label': 'Fuel Economy', 'value': '51 mpg city / 53 mpg highway'},
                    {'label': 'Cargo Space', 'value': '15.1 cu ft'},
                    {'label': 'Wheelbase', 'value': '111.2 inches'},
                    {'label': 'Length', 'value': '192.1 inches'}
                ],
                'mileage': 0,
                'engine': '2.5L 4-Cylinder Hybrid',
                'color': 'Celestial Blue Metallic',
                'category': 'Sedan',
                'rating': 4.8,
                'reviews': 124
            },
            'honda cr-v': {
                'brand': 'Honda',
                'model': 'CR-V',
                'year': 2024,
                'description': 'The Honda CR-V is a compact SUV that combines practicality with comfort. The 2024 model offers a spacious interior, excellent fuel economy, and Honda\'s latest safety technology.',
                'seats': 5,
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'price_per_day': 95,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/CR-V/7739/1585800250804/front-left-side-47.jpg?tr=w-664',
                'features': [
                    'Honda Sensing Suite',
                    '7-inch Touchscreen',
                    'Apple CarPlay & Android Auto',
                    'Wireless Charging',
                    'Power Tailgate',
                    'Dual-Zone Climate Control',
                    'Heated Front Seats',
                    'HondaLink Remote'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.0L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '204 hp'},
                    {'label': 'Fuel Economy', 'value': '40 mpg city / 35 mpg highway'},
                    {'label': 'Cargo Space', 'value': '39.2 cu ft'},
                    {'label': 'Wheelbase', 'value': '106.3 inches'},
                    {'label': 'Length', 'value': '184.8 inches'}
                ],
                'mileage': 0,
                'engine': '2.0L 4-Cylinder Hybrid',
                'color': 'Canyon River Blue Metallic',
                'category': 'SUV',
                'rating': 4.7,
                'reviews': 98
            },
            'tesla model 3': {
                'brand': 'Tesla',
                'model': 'Model 3',
                'year': 2024,
                'description': 'The Tesla Model 3 is an all-electric sedan that offers impressive range, quick acceleration, and cutting-edge technology. The 2024 model features Tesla\'s latest software updates and hardware improvements.',
                'seats': 5,
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'price_per_day': 120,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tesla/Model-3/5251/1693556345148/front-left-side-47.jpg?tr=w-664',
                'features': [
                    'Autopilot',
                    '15-inch Touchscreen',
                    'Premium Audio',
                    'Glass Roof',
                    'Wireless Charging',
                    'Sentry Mode',
                    'Dog Mode',
                    'Netflix & YouTube'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '82 kWh'},
                    {'label': 'Range', 'value': '358 miles'},
                    {'label': '0-60 mph', 'value': '3.1 seconds'},
                    {'label': 'Cargo Space', 'value': '15 cu ft'},
                    {'label': 'Wheelbase', 'value': '113.2 inches'},
                    {'label': 'Length', 'value': '184.8 inches'}
                ],
                'mileage': 0,
                'engine': 'Dual Motor AWD',
                'color': 'Midnight Silver Metallic',
                'category': 'Electric',
                'rating': 4.9,
                'reviews': 156
            },
            'bmw x5': {
                'brand': 'BMW',
                'model': 'X5',
                'year': 2024,
                'description': 'The BMW X5 is a luxury SUV that combines performance with comfort. The 2024 model features BMW\'s latest technology, premium materials, and powerful engine options.',
                'seats': 5,
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'price_per_day': 150,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X5-2023/10452/1688992642182/front-left-side-47.jpg?tr=w-230',
                'features': [
                    'iDrive 8.0',
                    '14.9-inch Touchscreen',
                    'Harman Kardon Audio',
                    'Panoramic Roof',
                    'Gesture Control',
                    'Parking Assistant',
                    'Heated & Ventilated Seats',
                    'Ambient Lighting'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '3.0L 6-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '389 hp'},
                    {'label': 'Fuel Economy', 'value': '21 mpg city / 25 mpg highway'},
                    {'label': 'Cargo Space', 'value': '33.9 cu ft'},
                    {'label': 'Wheelbase', 'value': '117.1 inches'},
                    {'label': 'Length', 'value': '194.3 inches'}
                ],
                'mileage': 0,
                'engine': '3.0L 6-Cylinder Hybrid',
                'color': 'Phytonic Blue Metallic',
                'category': 'Luxury SUV',
                'rating': 4.8,
                'reviews': 87
            },
            'mercedes-benz c-class': {
                'brand': 'Mercedes-Benz',
                'model': 'C-Class',
                'year': 2024,
                'description': 'The Mercedes-Benz C-Class is a luxury sedan that offers sophisticated styling and advanced technology. The 2024 model features the latest MBUX infotainment system and premium amenities.',
                'seats': 5,
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'price_per_day': 130,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/C-Class/10858/Mercedes-Benz-C-Class-C-200/1720160050225/front-left-side-47.jpg',
                'features': [
                    'MBUX Infotainment',
                    '11.9-inch Touchscreen',
                    'Burmester Audio',
                    'Panoramic Roof',
                    'Ambient Lighting',
                    'Parking Assistant',
                    'Heated & Ventilated Seats',
                    'Wireless Charging'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.0L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '255 hp'},
                    {'label': 'Fuel Economy', 'value': '28 mpg city / 36 mpg highway'},
                    {'label': 'Cargo Space', 'value': '12.6 cu ft'},
                    {'label': 'Wheelbase', 'value': '112.8 inches'},
                    {'label': 'Length', 'value': '187.0 inches'}
                ],
                'mileage': 0,
                'engine': '2.0L 4-Cylinder Hybrid',
                'color': 'Obsidian Black Metallic',
                'category': 'Luxury Sedan',
                'rating': 4.7,
                'reviews': 92
            },
            'audi q5': {
                'brand': 'Audi',
                'model': 'Q5',
                'year': 2024,
                'description': 'The Audi Q5 is a luxury compact SUV that combines performance with sophistication. The 2024 model features Audi\'s latest technology, quattro all-wheel drive, and premium interior.',
                'seats': 5,
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'price_per_day': 140,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Audi/Q5/10556/1689594416925/front-left-side-47.jpg?tr=w-664',
                'features': [
                    'MMI Navigation Plus',
                    '10.1-inch Touchscreen',
                    'Bang & Olufsen Audio',
                    'Panoramic Sunroof',
                    'Virtual Cockpit',
                    'Parking System Plus',
                    'Heated & Ventilated Seats',
                    'Wireless Charging'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.0L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '261 hp'},
                    {'label': 'Fuel Economy', 'value': '24 mpg city / 30 mpg highway'},
                    {'label': 'Cargo Space', 'value': '25.1 cu ft'},
                    {'label': 'Wheelbase', 'value': '111.0 inches'},
                    {'label': 'Length', 'value': '184.3 inches'}
                ],
                'mileage': 0,
                'engine': '2.0L 4-Cylinder Hybrid',
                'color': 'Daytona Gray Pearl',
                'category': 'Luxury SUV',
                'rating': 4.8,
                'reviews': 78
            },
            'ford mustang': {
                'brand': 'Ford',
                'model': 'Mustang',
                'year': 2024,
                'description': 'The Ford Mustang is an iconic sports car that offers powerful performance and classic styling. The 2024 model features the latest technology while maintaining its legendary driving experience.',
                'seats': 4,
                'fuelType': 'Gasoline',
                'transmission': 'Automatic',
                'price_per_day': 110,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Ford/Mustang-2024/7939/1663750110692/front-left-side-47.jpg',
                'features': [
                    'SYNC 4',
                    '12-inch Digital Cluster',
                    'B&O Premium Audio',
                    'Track Apps',
                    'Line Lock',
                    'Launch Control',
                    'Recaro Seats',
                    'Track Package'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '5.0L V8'},
                    {'label': 'Horsepower', 'value': '460 hp'},
                    {'label': 'Fuel Economy', 'value': '16 mpg city / 25 mpg highway'},
                    {'label': 'Cargo Space', 'value': '13.5 cu ft'},
                    {'label': 'Wheelbase', 'value': '107.1 inches'},
                    {'label': 'Length', 'value': '188.5 inches'}
                ],
                'mileage': 0,
                'engine': '5.0L V8',
                'color': 'Grabber Blue',
                'category': 'Sports Car',
                'rating': 4.9,
                'reviews': 112
            },
            'hyundai tucson': {
                'brand': 'Hyundai',
                'model': 'Tucson',
                'year': 2024,
                'description': 'The Hyundai Tucson is a compact SUV that offers modern styling, advanced technology, and excellent value. The 2024 model features Hyundai\'s latest safety systems and a spacious interior.',
                'seats': 5,
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'price_per_day': 90,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Tucson/10134/1694668706095/front-left-side-47.jpg',
                'features': [
                    'SmartSense',
                    '10.25-inch Touchscreen',
                    'Bose Premium Audio',
                    'Panoramic Sunroof',
                    'Wireless Charging',
                    'Smart Power Tailgate',
                    'Heated & Ventilated Seats',
                    'Bluelink Connected Car'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '1.6L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '226 hp'},
                    {'label': 'Fuel Economy', 'value': '38 mpg city / 38 mpg highway'},
                    {'label': 'Cargo Space', 'value': '38.7 cu ft'},
                    {'label': 'Wheelbase', 'value': '108.5 inches'},
                    {'label': 'Length', 'value': '182.3 inches'}
                ],
                'mileage': 0,
                'engine': '1.6L 4-Cylinder Hybrid',
                'color': 'Amazon Gray',
                'category': 'SUV',
                'rating': 4.6,
                'reviews': 85
            },
            'kia ev9': {
                'brand': 'Kia',
                'model': 'EV9',
                'year': 2024,
                'description': 'The Kia EV9 is a groundbreaking all-electric SUV that combines luxury, technology, and sustainability. As Kia\'s flagship electric vehicle, it offers three-row seating and cutting-edge features.',
                'seats': 7,
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'price_per_day': 160,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Kia/EV9/9560/1727949076624/front-left-side-47.jpg?tr=w-664',
                'features': [
                    'Digital Cockpit',
                    '14.5-inch Touchscreen',
                    'Meridian Premium Audio',
                    'Panoramic Sunroof',
                    'Vehicle-to-Load (V2L)',
                    'Remote Smart Parking',
                    'Heated & Ventilated Seats',
                    'Augmented Reality HUD'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '99.8 kWh'},
                    {'label': 'Range', 'value': '304 miles'},
                    {'label': '0-60 mph', 'value': '4.5 seconds'},
                    {'label': 'Cargo Space', 'value': '81.9 cu ft'},
                    {'label': 'Wheelbase', 'value': '122.0 inches'},
                    {'label': 'Length', 'value': '197.2 inches'}
                ],
                'mileage': 0,
                'engine': 'Dual Motor AWD',
                'color': 'Aurora Black Pearl',
                'category': 'Electric SUV',
                'rating': 4.9,
                'reviews': 45
            },
            'volkswagen id.7': {
                'brand': 'Volkswagen',
                'model': 'ID.7',
                'year': 2024,
                'description': 'The Volkswagen ID.7 is a premium electric sedan that combines elegant design with advanced technology. It features VW\'s latest electric platform and innovative interior features.',
                'seats': 5,
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'price_per_day': 145,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Volkswagen/ID.7/9899/1681818658935/front-left-side-47.jpg?imwidth=420&impolicy=resize',
                'features': [
                    '15-inch Touchscreen',
                    'AR Head-up Display',
                    'Harman Kardon Audio',
                    'Panoramic Roof',
                    'Travel Assist',
                    'Park Assist Plus',
                    'Massage Seats',
                    'Smart Glass Roof'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '86 kWh'},
                    {'label': 'Range', 'value': '435 miles'},
                    {'label': '0-60 mph', 'value': '5.2 seconds'},
                    {'label': 'Cargo Space', 'value': '18.7 cu ft'},
                    {'label': 'Wheelbase', 'value': '116.9 inches'},
                    {'label': 'Length', 'value': '195.3 inches'}
                ],
                'mileage': 0,
                'engine': 'Dual Motor AWD',
                'color': 'Moonstone Gray',
                'category': 'Electric Sedan',
                'rating': 4.8,
                'reviews': 38
            },
            'toyota crown': {
                'brand': 'Toyota',
                'model': 'Crown',
                'year': 2024,
                'description': 'The Toyota Crown is a premium hybrid sedan that combines luxury with efficiency. It features Toyota\'s latest hybrid technology and sophisticated styling.',
                'seats': 5,
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'price_per_day': 135,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Toyota-Crown/1655/1563268708994/front-left-side-47.jpg?tr=w-664',
                'features': [
                    '12.3-inch Touchscreen',
                    'JBL Premium Audio',
                    'Panoramic Roof',
                    'Toyota Safety Sense 3.0',
                    'Advanced Park',
                    'Heated & Ventilated Seats',
                    'Digital Key',
                    'Ambient Lighting'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.5L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '236 hp'},
                    {'label': 'Fuel Economy', 'value': '41 mpg city / 38 mpg highway'},
                    {'label': 'Cargo Space', 'value': '15.2 cu ft'},
                    {'label': 'Wheelbase', 'value': '112.2 inches'},
                    {'label': 'Length', 'value': '196.1 inches'}
                ],
                'mileage': 0,
                'engine': '2.5L 4-Cylinder Hybrid',
                'color': 'Bronze Age',
                'category': 'Hybrid Sedan',
                'rating': 4.7,
                'reviews': 52
            },
            'mercedes-benz eqe': {
                'brand': 'Mercedes-Benz',
                'model': 'EQE',
                'year': 2024,
                'description': 'The Mercedes-Benz EQE is a luxury electric sedan that combines the brand\'s premium features with cutting-edge electric technology. It offers a spacious interior and advanced driver assistance systems.',
                'seats': 5,
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'price_per_day': 180,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Mercedes-Benz/EQE-SUV/9404/1694768428968/front-left-side-47.jpg?tr=w-664',
                'features': [
                    'MBUX Hyperscreen',
                    'Burmester 3D Audio',
                    'Panoramic Sunroof',
                    'Drive Pilot',
                    'Park Pilot',
                    'Heated & Ventilated Seats',
                    'Ambient Lighting',
                    'Augmented Reality Navigation'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '90.6 kWh'},
                    {'label': 'Range', 'value': '305 miles'},
                    {'label': '0-60 mph', 'value': '4.3 seconds'},
                    {'label': 'Cargo Space', 'value': '15.0 cu ft'},
                    {'label': 'Wheelbase', 'value': '122.4 inches'},
                    {'label': 'Length', 'value': '196.6 inches'}
                ],
                'mileage': 0,
                'engine': 'Dual Motor AWD',
                'color': 'Digital White Metallic',
                'category': 'Electric Luxury',
                'rating': 4.9,
                'reviews': 67
            },
            'land rover defender': {
                'brand': 'Land Rover',
                'model': 'Defender',
                'year': 2024,
                'description': 'The Land Rover Defender is a rugged luxury SUV that combines off-road capability with premium features. The 2024 model features advanced technology while maintaining its iconic design.',
                'seats': 7,
                'fuelType': 'Diesel',
                'transmission': 'Automatic',
                'price_per_day': 200,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Land-Rover/Defender/12031/Land-Rover-Defender-2.0-l-Petrol-110-X-Dynamic-HSE/1745991566052/front-left-side-47.jpg?tr=w-664',
                'features': [
                    'Pivi Pro Infotainment',
                    'Meridian Audio',
                    'Panoramic Roof',
                    'Terrain Response 2',
                    'ClearSight Ground View',
                    'Wade Sensing',
                    'Heated & Ventilated Seats',
                    'Activity Key'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '3.0L 6-Cylinder Diesel'},
                    {'label': 'Horsepower', 'value': '296 hp'},
                    {'label': 'Fuel Economy', 'value': '22 mpg city / 28 mpg highway'},
                    {'label': 'Cargo Space', 'value': '34.0 cu ft'},
                    {'label': 'Wheelbase', 'value': '119.0 inches'},
                    {'label': 'Length', 'value': '200.7 inches'}
                ],
                'mileage': 0,
                'engine': '3.0L 6-Cylinder Diesel',
                'color': 'Pangea Green',
                'category': 'Luxury SUV',
                'rating': 4.8,
                'reviews': 89
            },
            'porsche taycan': {
                'brand': 'Porsche',
                'model': 'Taycan',
                'year': 2024,
                'description': 'The Porsche Taycan is a high-performance electric sports car that delivers Porsche\'s legendary driving dynamics with zero emissions. The 2024 model features improved range and faster charging.',
                'seats': 4,
                'fuelType': 'Electric',
                'transmission': '2-Speed',
                'price_per_day': 250,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Porsche/Taycan-2024/11515/1707404051019/front-left-side-47.jpg?tr=w-664',
                'features': [
                    'Porsche Communication Management',
                    'Burmester 3D Audio',
                    'Glass Roof',
                    'Porsche Active Suspension',
                    'Sport Chrono Package',
                    'Performance Battery Plus',
                    'Sport Seats Plus',
                    'Porsche Torque Vectoring'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '93.4 kWh'},
                    {'label': 'Range', 'value': '282 miles'},
                    {'label': '0-60 mph', 'value': '2.6 seconds'},
                    {'label': 'Cargo Space', 'value': '14.3 cu ft'},
                    {'label': 'Wheelbase', 'value': '114.2 inches'},
                    {'label': 'Length', 'value': '195.4 inches'}
                ],
                'mileage': 0,
                'engine': 'Dual Motor AWD',
                'color': 'Miami Blue',
                'category': 'Electric Sports',
                'rating': 4.9,
                'reviews': 112
            },
            'lexus rz': {
                'brand': 'Lexus',
                'model': 'RZ',
                'year': 2025,
                'description': 'The Lexus RZ is a premium electric SUV that combines Lexus\' luxury with advanced electric technology. It features a spacious interior and innovative driver assistance systems.',
                'seats': 5,
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'price_per_day': 170,
                'image': 'https://scene7.toyota.eu/is/image/toyotaeurope/2024-lexus-rz-hero-1920x1080-inperpetuity?qlt=80&wid=1600&fit=fit,1&ts=1732629595263&resMode=sharp2&op_usm=1.75,0.3,2,0&fmt=png-alpha',
                'features': [
                    '14-inch Touchscreen',
                    'Mark Levinson Audio',
                    'Panoramic Roof',
                    'Lexus Safety System+ 3.0',
                    'Advanced Park',
                    'Heated & Ventilated Seats',
                    'Digital Key',
                    'Ambient Lighting'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '71.4 kWh'},
                    {'label': 'Range', 'value': '220 miles'},
                    {'label': '0-60 mph', 'value': '5.0 seconds'},
                    {'label': 'Cargo Space', 'value': '32.0 cu ft'},
                    {'label': 'Wheelbase', 'value': '112.2 inches'},
                    {'label': 'Length', 'value': '189.0 inches'}
                ],
                'mileage': 0,
                'engine': 'Dual Motor AWD',
                'color': 'Sonic Chrome',
                'category': 'Electric Luxury',
                'rating': 4.7,
                'reviews': 58
            }
        }

        # Determine which fields Car actually has
        model_fields = {f.name for f in Car._meta.get_fields()}

        updated_count = 0
        created_count = 0

        for _, details in car_details.items():
            # Filter out any keys not in the model
            clean_details = {k: v for k, v in details.items() if k in model_fields}

            # Lookup by brand+model
            try:
                car = Car.objects.get(
                    brand__iexact=clean_details['brand'],
                    model__iexact=clean_details['model']
                )
                # Update existing
                for key, val in clean_details.items():
                    setattr(car, key, val)
                car.save()
                updated_count += 1
                self.stdout.write(f"✅ Updated details for {car.full_name}")

            except Car.DoesNotExist:
                # Create new
                new_car = Car(**clean_details)
                new_car.save()
                created_count += 1
                self.stdout.write(f"✨ Created new car: {new_car.full_name}")

        self.stdout.write(self.style.SUCCESS(
            f'\n🎉 Successfully updated {updated_count} car(s) and created {created_count} new car(s).'
        ))