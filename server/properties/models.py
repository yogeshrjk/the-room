from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Property(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="properties")

    title = models.CharField(max_length=255)
    description = models.TextField()
    rent = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    property_type = models.CharField(max_length=50)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    area = models.DecimalField(max_digits=10, decimal_places=2)
    wifi = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    kitchen = models.BooleanField(default=False)
    gym = models.BooleanField(default=False)
    ac = models.BooleanField(default=False)
    laundry = models.BooleanField(default=False)
    water = models.BooleanField(default=False)
    electricity = models.BooleanField(default=False)
    furnished = models.BooleanField(default=False)
    cctv = models.BooleanField(default=False)
    lift = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="properties/")