from django.core.management.base import BaseCommand
from cars.models import Car, CarGallery
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Loads sample car data and gallery images into the database'

    def handle(self, *args, **kwargs):
        # Premium general interior/exterior images that are verified working (200 OK)
        unsplash_sedan_ext = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'
        unsplash_sedan_int1 = 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80'
        unsplash_sedan_int2 = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'

        unsplash_suv_ext = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
        unsplash_suv_int1 = 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
        unsplash_suv_int2 = 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=1200&q=80'

        unsplash_sports_ext = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'

        sample_cars = [
            {
                'brand': 'Toyota',
                'model': 'Camry',
                'year': 2025,
                'seats': 5,
                'price_per_day': 85.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Camry/11344/1733916451269/front-left-side-47.jpg',
                'description': 'The Toyota Camry is a mid-size sedan known for its reliability, comfort, and fuel efficiency. The 2025 model features an all-hybrid powertrain, refined interior, advanced safety features, and smooth performance.',
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'features': [
                    'Toyota Safety Sense 3.0',
                    '12.3-inch Multimedia Touchscreen',
                    'Apple CarPlay & Android Auto',
                    'Wireless Smart Charger',
                    '9-Speaker JBL Premium Audio',
                    'Heated & Ventilated Front Seats',
                    'Panoramic Glass Roof',
                    'Digital Key Access'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.5L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '225 hp'},
                    {'label': 'Fuel Economy', 'value': '51 mpg city / 50 mpg highway'},
                    {'label': 'Cargo Volume', 'value': '15.1 cu ft'},
                    {'label': 'Wheelbase', 'value': '111.2 inches'},
                    {'label': 'Safety Rating', 'value': '5-Star IIHS Top Safety Pick'}
                ],
                'mileage': 51,
                'engine': '2.5L 4-Cylinder Hybrid',
                'color': 'Ocean Gem Metallic',
                'category': 'Sedan',
                'rating': 4.8,
                'reviews': 124,
                'is_available': True
            },
            {
                'brand': 'Honda',
                'model': 'CR-V',
                'year': 2025,
                'seats': 5,
                'price_per_day': 95.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/CR-V/7739/1585800250804/front-left-side-47.jpg',
                'description': 'The Honda CR-V is a compact SUV that combines practicality with comfort. The 2025 model offers a spacious interior, excellent fuel economy, and Honda\'s latest safety technology.',
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'features': [
                    'Honda Sensing Suite',
                    '9-inch HD Touchscreen',
                    'Wireless Apple CarPlay',
                    'Wireless Phone Charger',
                    'Hands-Free Access Power Tailgate',
                    'Dual-Zone Auto Climate Control',
                    'Leather-Trimmed Heated Seats',
                    'Bose Premium Sound System'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.0L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '204 hp'},
                    {'label': 'Fuel Economy', 'value': '40 mpg city / 34 mpg highway'},
                    {'label': 'Cargo Volume', 'value': '39.3 cu ft'},
                    {'label': 'Wheelbase', 'value': '106.3 inches'},
                    {'label': 'Safety Rating', 'value': '5-Star NHTSA'}
                ],
                'mileage': 40,
                'engine': '2.0L 4-Cylinder Hybrid',
                'color': 'Canyon River Blue',
                'category': 'SUV',
                'rating': 4.7,
                'reviews': 98,
                'is_available': True
            },
            {
                'brand': 'Tesla',
                'model': 'Model 3',
                'year': 2025,
                'seats': 5,
                'price_per_day': 120.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tesla/Model-3/5251/1693556345148/front-left-side-47.jpg',
                'description': 'The Tesla Model 3 is an all-electric sedan that offers impressive range, quick acceleration, and cutting-edge technology. The 2025 Highland refresh features ultra-quiet cabin acoustics, refined suspension, and exceptional range.',
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'features': [
                    'Autopilot',
                    '15.4-inch Center Touchscreen',
                    '8-inch Rear Row Screen',
                    'Dual Wireless Chargers',
                    'Custom 17-Speaker Sound System',
                    'Panoramic Glass Roof',
                    'Acoustic Glass Windows',
                    'Sentry Mode Security'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '75 kWh'},
                    {'label': 'Range', 'value': '341 miles'},
                    {'label': '0-60 mph', 'value': '4.2 seconds'},
                    {'label': 'Drive Type', 'value': 'Dual Motor AWD'},
                    {'label': 'Wheelbase', 'value': '113.2 inches'},
                    {'label': 'Cargo Space', 'value': '21.0 cu ft'}
                ],
                'mileage': 341,
                'engine': 'Dual Motor AWD',
                'color': 'Ultra Red',
                'category': 'Electric',
                'rating': 4.9,
                'reviews': 156,
                'is_available': True
            },
            {
                'brand': 'BMW',
                'model': 'X5',
                'year': 2025,
                'seats': 5,
                'price_per_day': 150.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X5-2023/10452/1688992642182/front-left-side-47.jpg',
                'description': 'The BMW X5 is a luxury SUV that combines performance with comfort. The 2025 model features the BMW Curved Display, standard plug-in hybrid options, and premium interior elements.',
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'features': [
                    'BMW Curved Display',
                    '14.9-inch Control Display',
                    'Harman Kardon Surround Sound',
                    'Panoramic Glass Roof',
                    'Parking Assistant Professional',
                    'Heated Multi-contour Seats',
                    'Active Blind Spot Detection',
                    'BMW Intelligent Personal Assistant'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '3.0L TwinPower Turbo I6 Hybrid'},
                    {'label': 'Horsepower', 'value': '483 hp'},
                    {'label': 'Electric Range', 'value': '40 miles'},
                    {'label': '0-60 mph', 'value': '4.6 seconds'},
                    {'label': 'Wheelbase', 'value': '117.1 inches'},
                    {'label': 'Cargo Space', 'value': '33.9 cu ft'}
                ],
                'mileage': 40,
                'engine': '3.0L TwinPower Turbo I6 Hybrid',
                'color': 'Brooklyn Grey Metallic',
                'category': 'Luxury SUV',
                'rating': 4.8,
                'reviews': 87,
                'is_available': True
            },
            {
                'brand': 'Mercedes-Benz',
                'model': 'C-Class',
                'year': 2025,
                'seats': 5,
                'price_per_day': 130.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/C-Class/10858/Mercedes-Benz-C-Class-C-200/1720160050225/front-left-side-47.jpg',
                'description': 'The Mercedes-Benz C-Class is a luxury sedan that offers sophisticated styling and advanced technology. The 2025 model features standard mild-hybrid drive, a digital cockpit, and class-leading comforts.',
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'features': [
                    '11.9-inch Center Touchscreen',
                    '12.3-inch Digital Instrument Cluster',
                    'Burmester 3D Surround Sound',
                    'MBUX Navigation with Augmented Reality',
                    '64-Color LED Ambient Lighting',
                    'Active Distance Assist DISTRONIC',
                    'Heated & Ventilated Front Seats',
                    'Panorama Sunroof'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.0L Inline-4 Turbo with Mild Hybrid'},
                    {'label': 'Horsepower', 'value': '255 hp'},
                    {'label': 'Fuel Economy', 'value': '26 mpg city / 36 mpg highway'},
                    {'label': 'Cargo Volume', 'value': '12.6 cu ft'},
                    {'label': 'Wheelbase', 'value': '112.8 inches'},
                    {'label': 'Transmission', 'value': '9G-TRONIC 9-Speed Automatic'}
                ],
                'mileage': 36,
                'engine': '2.0L Inline-4 Turbo Mild Hybrid',
                'color': 'Alpine Grey',
                'category': 'Luxury Sedan',
                'rating': 4.7,
                'reviews': 92,
                'is_available': True
            },
            {
                'brand': 'Audi',
                'model': 'Q5',
                'year': 2025,
                'seats': 5,
                'price_per_day': 140.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Audi/Q5/10556/1689594416925/front-left-side-47.jpg',
                'description': 'The Audi Q5 is a luxury compact SUV that combines performance with sophistication. The 2025 model features the legendary quattro all-wheel drive, premium digital cockpit, and high-end safety features.',
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'features': [
                    'Audi Virtual Cockpit Plus',
                    '10.1-inch MMI Touch Display',
                    'Bang & Olufsen 3D Sound System',
                    'Panoramic Sunroof',
                    'quattro All-Wheel Drive',
                    'Audi Pre Sense Safety',
                    '3-Zone Climate Control',
                    'Leather Seats'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.0L TFSI 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '261 hp'},
                    {'label': 'Fuel Economy', 'value': '24 mpg city / 30 mpg highway'},
                    {'label': 'Cargo Volume', 'value': '25.8 cu ft'},
                    {'label': 'Wheelbase', 'value': '111.0 in'},
                    {'label': 'Transmission', 'value': '7-speed S tronic Dual-Clutch'}
                ],
                'mileage': 29,
                'engine': '2.0L TFSI 4-Cylinder Hybrid',
                'color': 'Mythos Black Metallic',
                'category': 'Luxury SUV',
                'rating': 4.8,
                'reviews': 78,
                'is_available': True
            },
            {
                'brand': 'Ford',
                'model': 'Mustang',
                'year': 2025,
                'seats': 4,
                'price_per_day': 110.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Ford/Mustang-2024/7939/1663750110692/front-left-side-47.jpg',
                'description': 'The Ford Mustang is an iconic sports car that offers powerful performance and classic styling. The 2025 model offers high-adrenaline V8 power, customizable digital cockpit screens, and an iconic driving experience.',
                'fuelType': 'Gasoline',
                'transmission': 'Automatic',
                'features': [
                    'SYNC 4',
                    '12-inch Digital Cluster',
                    'B&O Play Premium Audio',
                    'Electronic Drift Brake',
                    'Selectable Drive Modes',
                    'Brembo Performance Brakes',
                    'Co-Pilot360 Assist+',
                    'Active Valve Performance Exhaust'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '5.0L Coyote V8'},
                    {'label': 'Horsepower', 'value': '480 hp'},
                    {'label': 'Fuel Economy', 'value': '15 mpg city / 24 mpg highway'},
                    {'label': 'Cargo Volume', 'value': '13.5 cu ft'},
                    {'label': 'Wheelbase', 'value': '107.1 inches'},
                    {'label': '0-60 mph', 'value': '4.2 seconds'}
                ],
                'mileage': 24,
                'engine': '5.0L Coyote V8',
                'color': 'Vapor Blue Metallic',
                'category': 'Sports Car',
                'rating': 4.9,
                'reviews': 112,
                'is_available': True
            },
            {
                'brand': 'Hyundai',
                'model': 'Tucson',
                'year': 2025,
                'seats': 5,
                'price_per_day': 90.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Tucson/10134/1694668706095/front-left-side-47.jpg',
                'description': 'The Hyundai Tucson is a compact SUV that offers modern styling, advanced technology, and excellent value. The 2025 model features a refreshed modern style, spacious cabin layout, and highly efficient hybrid performance.',
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'features': [
                    'Dual 12.3-inch Panoramic Curved Displays',
                    'Bose Premium Audio System',
                    'Wireless Apple CarPlay & Android Auto',
                    'Panoramic Sunroof',
                    'Smart Cruise Control with Stop & Go',
                    'Heated & Ventilated Front Seats',
                    'Hands-Free Smart Power Tailgate',
                    'Blind-Spot View Monitor'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '1.6L Turbocharged Hybrid'},
                    {'label': 'Horsepower', 'value': '231 hp'},
                    {'label': 'Fuel Economy', 'value': '38 mpg city / 38 mpg highway'},
                    {'label': 'Cargo Volume', 'value': '38.7 cu ft'},
                    {'label': 'Wheelbase', 'value': '108.5 in'},
                    {'label': 'Drive System', 'value': 'HTRAC AWD'}
                ],
                'mileage': 38,
                'engine': '1.6L Turbocharged Hybrid',
                'color': 'Hampton Gray',
                'category': 'SUV',
                'rating': 4.6,
                'reviews': 85,
                'is_available': True
            },
            {
                'brand': 'Kia',
                'model': 'EV9',
                'year': 2025,
                'seats': 7,
                'price_per_day': 160.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Kia/EV9/9560/1727949076624/front-left-side-47.jpg',
                'description': 'The Kia EV9 is a groundbreaking all-electric SUV that combines luxury, technology, and sustainability. The 2025 three-row model delivers spacious luxury, ultra-fast charging capability, and futuristic design.',
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'features': [
                    'Digital Cockpit with Panoramic Display',
                    'Meridian Premium Sound System',
                    'Dual Sunroofs',
                    'Vehicle-to-Load (V2L) Power Outlet',
                    'Remote Smart Parking Assist 2',
                    'Highway Driving Assist 2',
                    'Heated, Ventilated & Massaging Seats',
                    'Digital Key 2'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '99.8 kWh'},
                    {'label': 'Electric Range', 'value': '304 miles'},
                    {'label': '0-60 mph', 'value': '4.5 seconds'},
                    {'label': 'Cargo Volume', 'value': '81.7 cu ft'},
                    {'label': 'Wheelbase', 'value': '122.0 in'},
                    {'label': 'Drive Type', 'value': 'Dual Motor AWD'}
                ],
                'mileage': 304,
                'engine': 'Dual Motor AWD',
                'color': 'Aurora Black Pearl',
                'category': 'Electric SUV',
                'rating': 4.9,
                'reviews': 45,
                'is_available': True
            },
            {
                'brand': 'Volkswagen',
                'model': 'ID.7',
                'year': 2025,
                'seats': 5,
                'price_per_day': 145.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Volkswagen/ID.7/9899/1681818658935/front-left-side-47.jpg',
                'description': 'The Volkswagen ID.7 is a premium electric sedan that combines elegant design with advanced technology. The 2025 model features a massive touchscreen interface, advanced safety features, and a spacious cabin.',
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'features': [
                    '15-inch Touchscreen Navigation',
                    'Augmented Reality Head-up Display',
                    'Harman Kardon Audio',
                    'Smart Glass Panoramic Roof',
                    'Travel Assist Driver Support',
                    'Park Assist Plus with Memory',
                    'ergoActive Massage Seats',
                    'Climatronic Auto Air Conditioning'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '86 kWh'},
                    {'label': 'Electric Range', 'value': '435 miles'},
                    {'label': '0-60 mph', 'value': '5.2 seconds'},
                    {'label': 'Drive Type', 'value': 'Dual Motor AWD'},
                    {'label': 'Wheelbase', 'value': '116.9 in'},
                    {'label': 'Length', 'value': '195.3 in'}
                ],
                'mileage': 435,
                'engine': 'Dual Motor AWD',
                'color': 'Moonstone Gray',
                'category': 'Electric Sedan',
                'rating': 4.8,
                'reviews': 38,
                'is_available': True
            },
            {
                'brand': 'Toyota',
                'model': 'Crown',
                'year': 2025,
                'seats': 5,
                'price_per_day': 135.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Toyota-Crown/1655/1563268708994/front-left-side-47.jpg',
                'description': 'The Toyota Crown is a premium hybrid sedan that combines luxury with efficiency. The 2025 model combines executive luxury styling with highly advanced hybrid powertrain systems.',
                'fuelType': 'Hybrid',
                'transmission': 'Automatic',
                'features': [
                    '12.3-inch Toyota Audio Multimedia',
                    'JBL Premium Surround Sound',
                    'Panoramic View Monitor',
                    'Toyota Safety Sense 3.0',
                    'Advanced Park Steering Assist',
                    'Heated & Ventilated Front Seats',
                    'Smart Key with Push Start',
                    'Ambient LED Interior Lighting'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '2.5L 4-Cylinder Hybrid'},
                    {'label': 'Horsepower', 'value': '236 hp'},
                    {'label': 'Fuel Economy', 'value': '41 mpg city / 38 mpg highway'},
                    {'label': 'Cargo Volume', 'value': '15.2 cu ft'},
                    {'label': 'Wheelbase', 'value': '112.2 in'},
                    {'label': 'Drive System', 'value': 'Electronic AWD'}
                ],
                'mileage': 41,
                'engine': '2.5L 4-Cylinder Hybrid',
                'color': 'Oxygen White',
                'category': 'Hybrid Sedan',
                'rating': 4.7,
                'reviews': 52,
                'is_available': True
            },
            {
                'brand': 'Mercedes-Benz',
                'model': 'EQE',
                'year': 2025,
                'seats': 5,
                'price_per_day': 180.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Mercedes-Benz/EQE-SUV/9404/1694768428968/front-left-side-47.jpg',
                'description': 'The Mercedes-Benz EQE is a luxury electric sedan that combines the brand\'s premium features with cutting-edge electric technology. The 2025 model provides premium electric cruising with massive touchscreen interfaces.',
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'features': [
                    'MBUX Hyperscreen Premium Dash',
                    'Burmester 3D Audio System',
                    'Panoramic Glass Sunroof',
                    'Active Driver Assistance Suite',
                    'Automatic Valet Parking System',
                    'Multi-contour Ventilated Seats',
                    'Interactive Ambient Light System',
                    'Augmented Reality HUD'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '90.6 kWh'},
                    {'label': 'Electric Range', 'value': '305 miles'},
                    {'label': '0-60 mph', 'value': '4.3 seconds'},
                    {'label': 'Cargo Volume', 'value': '15.0 cu ft'},
                    {'label': 'Wheelbase', 'value': '122.4 in'},
                    {'label': 'Drive Type', 'value': 'Dual Motor AWD'}
                ],
                'mileage': 305,
                'engine': 'Dual Motor AWD',
                'color': 'Digital White Metallic',
                'category': 'Electric Luxury',
                'rating': 4.9,
                'reviews': 67,
                'is_available': True
            },
            {
                'brand': 'Land Rover',
                'model': 'Defender',
                'year': 2025,
                'seats': 7,
                'price_per_day': 200.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Land-Rover/Defender/12031/Land-Rover-Defender-2.0-l-Petrol-110-X-Dynamic-HSE/1745991566052/front-left-side-47.jpg',
                'description': 'The Land Rover Defender is a rugged luxury SUV that combines off-road capability with premium features. The 2025 model merges top off-road capabilities with a modern premium interior layout.',
                'fuelType': 'Gasoline',
                'transmission': 'Automatic',
                'features': [
                    'Pivi Pro 11.4-inch Touchscreen',
                    'Meridian Sound System',
                    'Panoramic Roof',
                    'Terrain Response 2 Off-Road',
                    'ClearSight Ground View System',
                    'Wade Sensing Assistance',
                    'Climate Heated Seats',
                    'Keyless Entry & Ignition'
                ],
                'specifications': [
                    {'label': 'Engine', 'value': '3.0L Mild-Hybrid Turbo I6'},
                    {'label': 'Horsepower', 'value': '395 hp'},
                    {'label': 'Fuel Economy', 'value': '18 mpg city / 23 mpg highway'},
                    {'label': 'Cargo Volume', 'value': '34.0 cu ft'},
                    {'label': 'Wheelbase', 'value': '119.0 in'},
                    {'label': 'Drive Type', 'value': 'AWD'}
                ],
                'mileage': 23,
                'engine': '3.0L Mild-Hybrid Turbo I6',
                'color': 'Pangea Green Metallic',
                'category': 'Luxury SUV',
                'rating': 4.8,
                'reviews': 89,
                'is_available': True
            },
            {
                'brand': 'Porsche',
                'model': 'Taycan',
                'year': 2025,
                'seats': 4,
                'price_per_day': 250.00,
                'image': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Porsche/Taycan-2024/11515/1707404051019/front-left-side-47.jpg',
                'description': 'The Porsche Taycan is a high-performance electric sports car that delivers Porsche\'s driving dynamics with zero emissions. The 2025 model features massive performance dynamics and supercharged range.',
                'fuelType': 'Electric',
                'transmission': '2-Speed',
                'features': [
                    'Porsche Communication Management',
                    'Burmester 3D Surround Sound',
                    'Fixed Panoramic Glass Roof',
                    'Porsche Active Suspension Management',
                    'Sport Chrono Package Options',
                    'Performance Battery Plus 93.4kWh',
                    'Adaptive 18-Way Sport Seats',
                    'Rear Axle Steering Assist'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '93.4 kWh'},
                    {'label': 'Electric Range', 'value': '282 miles'},
                    {'label': '0-60 mph', 'value': '2.6 seconds'},
                    {'label': 'Cargo Volume', 'value': '14.3 cu ft'},
                    {'label': 'Wheelbase', 'value': '114.2 in'},
                    {'label': 'Drive Type', 'value': 'Dual Motor AWD'}
                ],
                'mileage': 282,
                'engine': 'Dual Motor AWD',
                'color': 'Frozen Blue Metallic',
                'category': 'Electric Sports',
                'rating': 4.9,
                'reviews': 112,
                'is_available': True
            },
            {
                'brand': 'Lexus',
                'model': 'RZ',
                'year': 2025,
                'seats': 5,
                'price_per_day': 170.00,
                'image': 'https://scene7.toyota.eu/is/image/toyotaeurope/2024-lexus-rz-hero-1920x1080-inperpetuity?qlt=80&wid=1600&fit=fit,1&ts=1732629595263&resMode=sharp2&op_usm=1.75,0.3,2,0&fmt=png-alpha',
                'description': 'The Lexus RZ is a premium electric SUV that combines Lexus\' luxury with advanced electric technology. The 2025 model offers highly quiet premium electric driving with luxurious cabin refinements.',
                'fuelType': 'Electric',
                'transmission': 'Single-Speed',
                'features': [
                    '14-inch Interface Touchscreen',
                    'Mark Levinson Sound System',
                    'Panoramic Glass Roof',
                    'Lexus Safety System+ 3.0',
                    'Advanced Parking Guidance',
                    'Heated & Ventilated Front Seats',
                    'Digital Smartphone Key',
                    'Custom Ambient LED Lights'
                ],
                'specifications': [
                    {'label': 'Battery', 'value': '71.4 kWh'},
                    {'label': 'Range', 'value': '220 miles'},
                    {'label': '0-60 mph', 'value': '5.0 seconds'},
                    {'label': 'Cargo Volume', 'value': '32.0 cu ft'},
                    {'label': 'Wheelbase', 'value': '112.2 inches'},
                    {'label': 'Drive Type', 'value': 'DIRECT4 AWD'}
                ],
                'mileage': 220,
                'engine': 'DIRECT4 AWD',
                'color': 'Sonic Chrome',
                'category': 'Electric Luxury',
                'rating': 4.7,
                'reviews': 58,
                'is_available': True
            }
        ]

        # Define galleries dynamically to avoid 404s
        for car_data in sample_cars:
            car, created = Car.objects.update_or_create(
                brand=car_data['brand'],
                model=car_data['model'],
                defaults=car_data
            )
            
            # Formulate the list of working carousel images
            main_image = car.image
            category = car.category.lower()
            
            if 'sports' in category:
                images_list = [main_image, unsplash_sports_ext, unsplash_sedan_int1, unsplash_sedan_int2]
            elif 'suv' in category or 'electric suv' in category:
                images_list = [main_image, unsplash_suv_ext, unsplash_suv_int1, unsplash_suv_int2]
            else:  # Sedan / Electric / Hybrid Sedan
                images_list = [main_image, unsplash_sedan_ext, unsplash_sedan_int1, unsplash_sedan_int2]

            CarGallery.objects.update_or_create(
                car=car,
                defaults={
                    'gallery_url': f"https://www.cardekho.com/carmodels/{car.brand}/{car.model}",
                    'images': images_list
                }
            )

        # Programmatically create admin superuser if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Admin superuser created successfully (admin / admin123)'))

        self.stdout.write(self.style.SUCCESS('Successfully loaded and updated sample car data with high-res images and galleries'))