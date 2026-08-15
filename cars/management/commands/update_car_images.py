from django.core.management.base import BaseCommand
from cars.models import Car
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from cars.models import CarGallery
import time

class Command(BaseCommand):
    help = 'Updates car images with more reliable sources'

    def handle(self, *args, **kwargs):
        # Dictionary with normalized keys
        car_images = {
            'toyota camry': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Toyota/Camry/11344/1733916451269/front-left-side-47.jpg?tr=w-664',
            'honda cr-v': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/CR-V/7739/1585800250804/front-left-side-47.jpg?tr=w-664',
            'tesla model 3': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tesla/Model-3/5251/1693556345148/front-left-side-47.jpg?tr=w-664',
            'bmw x5': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/BMW/X5-2023/10452/1688992642182/front-left-side-47.jpg?tr=w-230',
            'mercedes-benz c-class': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/C-Class/10858/Mercedes-Benz-C-Class-C-200/1720160050225/front-left-side-47.jpg',
            'audi q5': 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Audi/Q5/10556/1689594416925/front-left-side-47.jpg?tr=w-664',
            'ford mustang': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Ford/Mustang-2024/7939/1663750110692/front-left-side-47.jpg',
            'hyundai tucson': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Tucson/10134/1694668706095/front-left-side-47.jpg'
        }

        updated_count = 0
        for car in Car.objects.all():
            # Normalize car name
            car_name = f"{car.brand} {car.model}".strip().lower()
            car_name = ' '.join(car_name.split())  # remove extra internal spaces

            if car_name in car_images:
                car.image = car_images[car_name]
                car.save()
                updated_count += 1
                self.stdout.write(f"✅ Updated image for {car.brand} {car.model}")
            else:
                self.stdout.write(f"❌ No image found for {car.brand} {car.model}")

        self.stdout.write(self.style.SUCCESS(f'\n🎉 Successfully updated {updated_count} car images'))

def scrape_and_save_gallery_images():
    options = Options()
    options.headless = True
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    driver = None
    try:
        driver = webdriver.Chrome(options=options)
        for gallery in CarGallery.objects.all():
            if not gallery.gallery_url:
                continue
            try:
                print(f"Scraping images for {gallery.car}...")
                driver.get(gallery.gallery_url)
                time.sleep(15)  # Wait longer for dynamic content
                
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
                
                gallery.images = unique_images
                gallery.save()
                print(f'✅ Saved {len(unique_images)} images for {gallery.car}')
                
            except Exception as e:
                print(f'❌ Error scraping {gallery.car}: {str(e)}')
                continue
    except Exception as e:
        print(f'❌ Error initializing driver: {str(e)}')
    finally:
        if driver:
            driver.quit()

# Add this to the handle() method if not present
if __name__ == "__main__":
    scrape_and_save_gallery_images()
