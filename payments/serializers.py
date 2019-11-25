from rest_framework import serializers

from .models import Payment, Bill, Service


class PaymentSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Payment
        fields = [
            "bill",
            "created_by",
            "date_created",
            "date_updated",
            "type",
            "amount",
            "description",
            "date",
            "action",
        ]


class BillSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Bill
        fields = [
            "service",
            "apartment",
            "created_by",
            "amount",
            "number",
            "date_updated",
            "pdf_copy",
            "date",
            "date_created",
        ]


class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = [
            "description",
            "name",
        ]
