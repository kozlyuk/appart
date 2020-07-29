from rest_framework import serializers
from rest_auth.serializers import LoginSerializer
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.hashers import make_password

from accounts.models import User
from condominium.models import Apartment


class UserSerializer(serializers.ModelSerializer):
    """A Serizlier class for User """
    password = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = [
            "pk",
            "first_name",
            "last_name",
            "mobile_number",
            "email",
            "is_active",
            "is_staff",
            "birth_date",
            "avatar",
            "groups",
            "password"
        ]
        extra_kwargs = {
            'password' : {'write_only' : True},
        }

    def validate_email(self, value):
        """
        Check that start is before finish.
        """
        message = _("User with such email already exist")
        if value:
            if self.instance:
                if User.objects.filter(email=value.lower()) \
                               .exclude(pk=self.instance.pk) \
                               .exists():
                    raise serializers.ValidationError(message)
            else:
                if User.objects.filter(email=value.lower()) \
                               .exists():
                    raise serializers.ValidationError(message)
        return value

    def create(self, validated_data):
        # creating user and adding it to groups
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        groups_data = validated_data.pop('groups')
        user = User.objects.create(**validated_data)
        if groups_data:
            for group_data in groups_data:
                user.groups.add(group_data)
        return user

    def update(self, instance, validated_data):
        # updating user
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        if 'password' in validated_data:
            instance.password = make_password(validated_data['password'])
        instance.save()

        # adding user to groups
        groups_data = validated_data.get('groups')
        if groups_data:
            instance.groups.clear()
            for group_data in groups_data:
                instance.groups.add(group_data)
        return instance


class UserApartmentsSerializer(serializers.ModelSerializer):
    house = serializers.StringRelatedField()

    class Meta:
        model = Apartment
        fields = [
            "pk",
            "house",
            "number",
            "debt"
        ]


class GetUserSerializer(serializers.ModelSerializer):
    apartment = UserApartmentsSerializer(source='apartment_set', many=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "pk",
            "email",
            "is_staff",
            "is_active",
            "is_registered",
            "is_superuser",
            "groups",
            "apartment",
            "first_name",
            "last_name",
            "avatar",
            "lang"
        ]

    def get_avatar(self, obj):
        request = self.context.get('request')
        photo_url = obj.avatar.url
        return request.build_absolute_uri(photo_url)


class CustomLoginSerializer(LoginSerializer):
    email = None
