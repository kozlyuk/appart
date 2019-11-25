from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.User
        fields = [
            "mobile_number",
            "email",
            "birth_date",
            "avatar",
            "theme",
        ]
