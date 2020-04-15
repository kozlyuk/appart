from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers, status
from rest_framework.response import Response

from condominium.models import Apartment, House, Company


class ResidentField(serializers.RelatedField):
    def to_representation(self, value):
        return value.pk, value.mobile_number, \
               f"{value.first_name} {value.last_name}"

class ApartmentSerializer(serializers.ModelSerializer):
    house_name = serializers.CharField(source='house', required=False)
    resident = ResidentField(read_only=True)

    class Meta:
        model = Apartment
        fields = [
            "pk",
            "house",
            "house_name",
            "resident",
            "number",
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
