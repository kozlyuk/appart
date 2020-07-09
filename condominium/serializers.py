from rest_framework import serializers
from rest_framework.response import Response

from condominium.models import Apartment, House, Company


class ApartmentSerializer(serializers.ModelSerializer):
    house_name = serializers.CharField(source='house', required=False)
    resident_name = serializers.CharField(source='resident', required=False)

    class Meta:
        model = Apartment
        fields = [
            "pk",
            "house",
            "house_name",
            "resident",
            "resident_name",
            "number",
            "account_number",
            "description",
            "is_active",
            "area",
            "residents_count",
        ]

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-one" relationships with select_related """
        queryset = queryset.select_related('house', 'resident')
        return queryset


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


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    class Meta:
        fields = ["file"]


# class OTPSerializer(serializers.Serializer):
#     file = serializers.FileField()

#     class Meta:
#         fields = ["file"]
