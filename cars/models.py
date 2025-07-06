from django.db import models

class Car(models.Model):
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    seats = models.IntegerField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(max_length=500)
    description = models.TextField()
    fuelType = models.CharField(max_length=50, blank=True)
    transmission = models.CharField(max_length=50, blank=True)
    features = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(default=list, blank=True)
    mileage = models.IntegerField(default=0, blank=True)
    engine = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, blank=True)
    rating = models.FloatField(default=0.0)
    reviews = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

    @property
    def full_name(self):
        return f"{self.brand} {self.model}"

class CarGallery(models.Model):
    car = models.OneToOneField(Car, on_delete=models.CASCADE, related_name='gallery')
    gallery_url = models.URLField(default='', max_length=500)
    images = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return f"Gallery for {self.car.brand} {self.car.model}"