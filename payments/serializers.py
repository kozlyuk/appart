from rest_framework import serializers

from . import models


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Payment
        fields = [
            "date_created",
            "date_updated",
            "type",
            "amount",
            "description",
            "date",
            "action",
        ]

class BillSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Bill
        fields = [
            "amount",
            "number",
            "date_updated",
            "pdf_copy",
            "date",
            "date_created",
        ]

class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Service
        fields = [
            "description",
            "name",
        ]
