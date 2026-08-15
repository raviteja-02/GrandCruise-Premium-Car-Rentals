from django.db import models
from django.contrib.auth.models import User
from cars.models import Car
from django.conf import settings
from django.utils import timezone

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s booking of {self.car.brand} {self.car.model}"

    def can_be_cancelled(self):
        """Check if the booking can be cancelled."""
        if self.status == 'pending':
            return True
        return self.status == 'confirmed' and self.start_date > timezone.now().date()

    def save(self, *args, **kwargs):
        if self.status in ['cancelled', 'completed']:
            self.car.is_available = True
            self.car.save()
        super().save(*args, **kwargs)
