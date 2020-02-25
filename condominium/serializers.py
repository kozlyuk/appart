from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers, status
from rest_framework.response import Response


from condominium.models import Apartment, House, Company
from accounts.models import User
from accounts.serializers import UserSerializer


class ApartmentSerializer(serializers.ModelSerializer):
    house_name = serializers.SerializerMethodField()
    resident_name = serializers.SerializerMethodField()
    resident_phone = serializers.SerializerMethodField()

    class Meta:
        model = Apartment
        fields = [
            "pk",
            "house",
            "house_name",
            "resident",
            "resident_name",
            "number",
            "description",
            "area",
            "residents_count",
        ]

    def get_house_name(self, obj):
        return obj.house.name

    def get_resident_name(self, obj):
        if obj.resident:
            return f"{obj.resident.first_name} {obj.resident.last_name}"

    def get_resident_phone(self, obj):
        if obj.resident:
            return obj.resident.mobile_number


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
