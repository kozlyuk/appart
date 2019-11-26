from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "mobile_number",
            "email",
            "birth_date",
            "avatar",
            "theme",
        ]
