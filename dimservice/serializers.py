from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers, status
from rest_framework.response import Response

from dimservice.models import Work, Order, Execution


class WorkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Work
        fields = [
            "name",
            "price_code",
            "price",
            "description",
            "active",
            "duration"
        ]


class OrderSerializer(serializers.ModelSerializer):
    apartment_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "apartment",
            "apartment_name",
            "work",
            "exec_status",
            "pay_status",
            "information",
            "warning",
            "created_by",
            "date_created",
            "date_updated",
            "date_closed",
        ]

    def get_apartment_name(self, obj):
        return f"{obj.apartment.number} - {obj.apartment.house.name}"


class ExecutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Execution
        fields = [
            "order",
            "executor",
            "scheduled_time",
            "exec_status",
        ]
