from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.User
        fields = [
            "first_name",
            "last_name",
            "mobile_number",
            "email",
            "birth_date",
            "avatar",
            "theme",
        ]
