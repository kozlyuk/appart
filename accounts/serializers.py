from rest_framework import serializers
from rest_auth.serializers import LoginSerializer
from django.utils.translation import ugettext_lazy as _

from accounts.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "pk",
            "first_name",
            "last_name",
            "mobile_number",
            "email",
            "is_active",
            "birth_date",
            "avatar",
            "theme",
        ]

    def validate_email(self, value):
        """
        Check that start is before finish.
        """
        message = _("User with such email already exist")
        if self.instance:
            if User.objects.filter(email=value.lower()).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError(message)
        else:
            if User.objects.filter(email=value.lower()).exists():
                raise serializers.ValidationError(message)
        return value


class GetUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "pk",
            "is_staff",
            "apartment_set"
        ]


class CustomLoginSerializer(LoginSerializer):
    email = None
