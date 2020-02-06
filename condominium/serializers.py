from rest_framework import serializers

from .models import Apartment, House, Company


class ApartmentSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Apartment
        fields = [
            "pk",
            "house",
            "resident",
            "number",
            "description",
            "area",
            "residents_count",
        ]


class HouseSerializer(serializers.ModelSerializer):

    class Meta:
        model = House
        fields = [
            "pk",
            "description",
            "address",
            "name",
            "logo",
            "apartments_count"
        ]


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
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
