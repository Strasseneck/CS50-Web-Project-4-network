from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", symmetrical=False, blank=True,related_name="followers")


class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField("User", blank=True, related_name="liked_posts")