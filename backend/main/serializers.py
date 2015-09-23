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


class CheckinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Checkin
        fields = (
            'start_time', 'end_time', 'user', 'location', 'id')


class LocationSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, required=False)

    class Meta:
        model = Location
        fields = (
            'title', 'description', 'lat', 'lng',
            'radius', 'family', 'user', 'id', 'todos')
        read_only_fields = ('id',)


class Base64ImageField(serializers.ImageField):

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12]  # 12 characters limit.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension, )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class InfoSerializer(serializers.ModelSerializer):
    profile_pic = Base64ImageField(
        max_length=None, use_url=True, required=False)

    def create(self, validated_data):
        info, created = Info.objects.get_or_create(
            user_id=validated_data['user'])
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


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name',
            'last_name', 'info', 'locations', 'checkins', 'password')
        depth = 1
        write_only_fields = ('password',)
        read_only_fields = ('id', 'locations', 'checkins')

    def create(self, validated_data):
        print validated_data
        print self
        user = User.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()

        return user

    def update(self, instance, validated_data):

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.password = validated_data.get('password', instance.password)
        instance.save()

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
