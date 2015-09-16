from main.models import Info, Family, Location, Checkin, Todo
from django.contrib.auth.models import User, Group
from rest_framework import serializers


class TodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = (
            'title', 'description', 'completed', 'created',
            'due_date', 'location', 'user', 'id')
        read_only_fields = ('id',)


class LocationSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, required=False)

    class Meta:
        model = Location
        fields = (
            'title', 'description', 'lat', 'lng',
            'radius', 'family', 'user', 'id', 'todos')
        read_only_fields = ('id',)


class InfoSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        info, created = Info.objects.get_or_create(user_id=validated_data['user'])
        info.phone_number = validated_data.get('phone_number')
        info.profile_pic = validated_data.get('profile_pic')
        info.family = validated_data.get('family')
        info.save()

        return info

    def update(self, instance, validated_data):
        instance.phone_number = validated_data.get(
            'phone_number', instance.phone_number)
        instance.profile_pic = validated_data.get(
            'profile_pic', instance.profile_pic)
        instance.family = validated_data.get('family', instance.family)
        instance.save()

        return instance

    class Meta:
        model = Info
        fields = (
            'user', 'phone_number', 'profile_pic', 'family',)


class CheckinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Checkin
        fields = (
            'start_time', 'end_time', 'user', 'location',)


class UserSerializer(serializers.ModelSerializer):
    info = InfoSerializer(required=False)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name',
            'last_name', 'info', 'locations', 'checkins')
        # write_only_fields = ('password',)
        read_only_fields = ('id', 'locations')

    def create(self, validated_data):
        # info_data = validated_data.pop('info')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'])
        user.set_password(validated_data['password'])
        user.save()
        # Info.objects.create(
        #     user=user, phone_number=info_data['phone_number'],
        #     profile_pic=info_data['profile_pic'],
        #     family=info_data['family'])
        return user

    def update(self, instance, validated_data):
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


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group


class FamilySerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, required=False)
    users = InfoSerializer(many=True, required=False)

    def create(self, validated_data):
        family, created = Family.objects.get_or_create(
            name=validated_data['name'])
        return family

    class Meta:
        model = Family
        fields = ('id', 'name', 'users', 'locations')
        read_only_fields = ('id',)
