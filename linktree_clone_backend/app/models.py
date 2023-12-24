from django.db import models
from django.conf import settings

# Create your models here.

class Style(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class LinkGroup(models.Model):
    name = models.CharField(max_length=50)
    group_creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    style = models.ForeignKey(Style, on_delete=models.CASCADE, default=1)
    unique_string = models.CharField(max_length=8, unique=True)

    def __str__(self):
        return self.name

class Link(models.Model):
    title = models.CharField(max_length=255)
    url = models.URLField()
    group = models.ForeignKey(LinkGroup, on_delete=models.CASCADE)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title