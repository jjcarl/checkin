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
    user = models.OneToOneField(User, null=True, blank=True)
    phone_number = models.CharField(max_length=30, null=True, blank=True)
    profile_pic = models.ImageField(
        upload_to='profile_pic', null=True, blank=True)
    family = models.ForeignKey(
        'Family', related_name='users', null=True, blank=True)

    def __unicode__(self):
        return '%s' % self.user

    class Meta:
        verbose_name = 'User Info'
        verbose_name_plural = 'User Info List'


class Family(models.Model):
    name = models.CharField(max_length=100)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'Family'
        verbose_name_plural = 'Families'


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

    class Meta:
        verbose_name = 'Location'
        verbose_name_plural = 'Locations'


class Checkin(models.Model):
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, related_name='checkins')
    location = models.ForeignKey('Location', related_name='checkins')

    def __unicode__(self):
        return "%s" % self.user

    class Meta:
        verbose_name = 'Check In'
        verbose_name_plural = 'Check In List'


class Todo(models.Model):
    title = models.TextField()
    description = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    location = models.ForeignKey(
        'Location', null=True, blank=True, related_name='todos')
    user = models.ForeignKey(User, null=True, blank=True, related_name='todos')

    def __unicode__(self):
        return self.item

    class Meta:
        verbose_name = 'To-do Item'
        verbose_name_plural = 'To-do Items'
