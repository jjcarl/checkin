from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from main.serializers import FamilySerializer, LocationSerializer
from main.serializers import UserSerializer, CheckinSerializer, TodoSerializer
from main.models import Info, Family, Location, Checkin, Todo
from django.contrib.auth.models import User


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(request):
        # family = self.request.user.family
        family = 1
        return Location.objects.filter(family=family)


class FamilyViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer
    permission_classes = (permissions.IsAuthenticated,)


class CheckinViewSet(viewsets.ModelViewSet):
    queryset = Checkin.objects.all()
    serializer_class = CheckinSerializer
    permission_classes = (permissions.IsAuthenticated,)


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = (permissions.IsAuthenticated,)


class UserRegistration(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class GetUserInfo(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# class FamilyLocationViewSet(viewsets.ModelViewSet):
#     queryset = Location.objects.all()    # TODO filter by auth/user
#     serializer_class = LocationSerializer
