from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Info(models.Model):
    user = models.OneToOneField(User)
    phone_number = models.IntegerField()
    profile_pic = models.ImageField(
        upload_to='profile_pic', null=True, blank=True)
    family = models.ForeignKey('Family', related_name='users')

    def __unicode__(self):
        return self.user


class Family(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __unicode__(self):
        return self.name


class Location(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    lat = models.FloatField()
    lng = models.FloatField()
    radius = models.IntegerField()
    family = models.ForeignKey('Family', related_name='locations')
    user = models.ForeignKey(User, related_name='locations')

    def __unicode__(self):
        return self.title


class Checkin(models.Model):
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User)
    location = models.ForeignKey('Location', related_name='checkins')

    def __unicode__(self):
        return self.user


class Todo(models.Model):
    item = models.TextField()
    completed = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    location = models.ForeignKey(
        'Location', null=True, blank=True, related_name='todos')
    user = models.ForeignKey(User, null=True, blank=True)

    def __unicode__(self):
        return self.item
