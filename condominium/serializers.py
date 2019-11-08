from rest_framework import serializers

from . import models


class ApartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Apartment
        fields = [
            "description",
            "area",
            "residents_count",
        ]

class HouseSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.House
        fields = [
            "description",
            "address",
            "name",
            "logo",
        ]

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Company
        fields = [
            "fullname",
            "chief",
            "logo",
            "name",
            "phone",
            "address",
            "description",
            "bank_requisites",
            "requisites",
        ]
