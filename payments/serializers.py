from django.conf import settings
from rest_framework import serializers

from .models import Payment, Bill, Service, BillLine


class PaymentSerializer(serializers.ModelSerializer):

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
        ]


class BillLineSerializer(serializers.ModelSerializer):
    total_debt = serializers.SerializerMethodField()

    class Meta:
        model = BillLine
        fields = [
            "previous_debt",
            "value",
            "total_debt"
        ]

    def get_total_debt(self, obj):
        return str(obj.previous_debt + obj.value)


class BillSerializer(serializers.ModelSerializer):
    bill_lines = BillLineSerializer(source='billline_set', many=True)

    class Meta:
        model = Bill
        fields = [
            "apartment",
            "number",
            "total_value",
            "period",
            "bill_lines",
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
