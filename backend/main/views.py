from rest_framework import viewsets
from rest_framework.response import Response
from main.serializers import FamilySerializer, LocationSerializer
from main.serializers import UserSerializer, CheckinSerializer, TodoSerializer
from main.models import Info, Family, Location, Checkin, Todo
from django.contrib.auth.models import User
from django.views.generic import View
import user_auth


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def get(request):
        # family = self.request.user.family
        family = 1
        return Location.objects.filter(family=family)


class FamilyViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer


class CheckinViewSet(viewsets.ModelViewSet):
    queryset = Checkin.objects.all()
    serializer_class = CheckinSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


# class FamilyLocationViewSet(viewsets.ModelViewSet):
#     queryset = Location.objects.all()    # TODO filter by auth/user
#     serializer_class = LocationSerializer
