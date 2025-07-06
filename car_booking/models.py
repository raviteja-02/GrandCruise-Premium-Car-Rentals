from django.db import models

class SystemSettings(models.Model):
    maintenance_mode = models.BooleanField(default=False)
    booking_confirmation_required = models.BooleanField(default=True)
    max_bookings_per_user = models.IntegerField(default=3)
    default_booking_duration = models.IntegerField(default=24)  # in hours
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'System Setting'
        verbose_name_plural = 'System Settings'

    @classmethod
    def get_settings(cls):
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings 