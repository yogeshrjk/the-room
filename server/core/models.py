from django.db import models
from django.contrib.auth.models import User
from properties.models import Property

class Profile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    phone = models.CharField(max_length=15, blank=True)
    bio = models.TextField(blank=True)

    image = models.ImageField(upload_to="users/", null=True, blank=True)

    favorites = models.ManyToManyField(
        Property, blank=True, related_name="saved_by"
    )

    def __str__(self):
        return self.user.username
