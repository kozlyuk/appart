from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "pk",
            "first_name",
            "last_name",
            "mobile_number",
            "email",
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
