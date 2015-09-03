from main.models import Info, Family, Location, Checkin, Todo
from django.contrib.auth.models import User
from rest_framework import serializers


class FamilySerializer(serializers.ModelSerializer):

    class Meta:
        model = Family
        fields = ('name', 'locations', 'users',)


class TodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = (
            'title', 'description', 'completed', 'created',
            'due_date', 'location', 'user', 'id')
        read_only_fields = ('id',)


class LocationSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True)

    class Meta:
        model = Location
        fields = (
            'title', 'description', 'lat', 'lng',
            'radius', 'family', 'user', 'id', 'todos')
        read_only_fields = ('id',)


class InfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Info
        fields = (
            'user', 'phone_number', 'profile_pic', 'family',)


class UserSerializer(serializers.ModelSerializer):
    info = InfoSerializer()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'password', 'email', 'first_name',
            'last_name', 'info', 'locations',)
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        info_data = validated_data.pop('info')
        user = User.objects.create(**validated_data)
        Info.objects.create(user=user, **info_data)
        return user

    def update(self, validated_data):
        info_data = validated_data.pop('info')
        info = instance.info

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.password = validated_data.get('password', instance.password)
        instance.save()

        info.phone_number = info_data.get('phone_number', info.phone_number)
        info.profile_pic = info_data.get('profile_pic', info.profile_pic)
        info.family = info_data.get('family', info.family)
        info.save()

        return instance


class CheckinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Checkin
        fields = (
            'start_time', 'end_time', 'user', 'location',)
