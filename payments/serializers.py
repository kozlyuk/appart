from django.conf import settings
from rest_framework import serializers

from .models import Payment, Bill, Service, BillLine, PaymentService


class PaymentServiceSerializer(serializers.ModelSerializer):
    service = serializers.StringRelatedField()

    class Meta:
        model = PaymentService
        fields = [
            "service",
            "value"
        ]


class PaymentSerializer(serializers.ModelSerializer):
    payment_service = PaymentServiceSerializer(source='paymentservice_set', many=True)
    payment_type = serializers.CharField(source='get_payment_type_display')
    action = serializers.CharField(source='get_action_display')

    class Meta:
        model = Payment
        fields = [
            "apartment",
            "payment_service",
            "payment_type",
            "action",
            "date",
            "value",
            "description",
        ]

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-many" relationships with prefetch_related """
        queryset = queryset.prefetch_related('paymentservice_set')
        return queryset


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
            "pk",
            "apartment",
            "number",
            "total_value",
            "period",
            "bill_lines",
        ]

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-many" relationships with prefetch_related """
        queryset = queryset.prefetch_related('billline_set')
        return queryset


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
