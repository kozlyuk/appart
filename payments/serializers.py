from rest_framework import serializers

from .models import Payment, Bill, Service


class PaymentSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Payment
        fields = [
            "apartment",
            "service",
            "payment_type",
            "action",
            "date",
            "value",
            "description",
            "created_by",
            "date_created",
            "date_created"
        ]


class BillSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Bill
        fields = [
            "apartment",
            "number",
            "total_value",
            "period",
            "created_by",
            "date_created",
            "date_updated",
        ]


class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = [
            "house",
            "name",
            "description",
            "uom_type",
            "rate",
            "uom"
        ]
