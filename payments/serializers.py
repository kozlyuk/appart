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

    class Meta:
        model = BillLine
        fields = [
            "previous_debt",
            "value",
        ]


class BillSerializer(serializers.ModelSerializer):
    bill_lines = BillLineSerializer(source='billline_set', many=True)


    class Meta:
        model = Bill
        fields = [
            "apartment",
            "number",
            "total_value",
            "period",
            "bill_lines"
        ]

    @staticmethod
    # optimizing 'to-many' relationships with prefetch_related
    def setup_eager_loading(queryset):
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
