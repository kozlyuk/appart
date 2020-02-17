from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers, status
from rest_framework.response import Response


from condominium.models import Apartment, House, Company
from accounts.models import User
from accounts.serializers import UserNameSerializer


class HouseNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = House
        fields = [
            "pk",
            "name",
        ]


class ApartmentSerializer(serializers.ModelSerializer):
    house = HouseNameSerializer(read_only=True)
    resident = UserNameSerializer()

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

    def update(self, instance, validated_data):
        resident_pk = validated_data.pop('resident')
        try:
            resident = User.objects.get(pk=resident_pk)
            instance.resident = resident
            instance.number = validated_data.get('number', instance.number)
            instance.description = validated_data.get('description', instance.description)
            instance.area = validated_data.get('area', instance.area)
            instance.residents_count = validated_data.get('residents_count', instance.residents_count)
            instance.save()
        except User.DoesNotExist:
            message = _("Resident with such pk doesn`t exists")
            return Response(message, status=status.HTTP_404_NOT_FOUND)

        return instance


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
