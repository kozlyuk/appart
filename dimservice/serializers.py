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

    class Meta:
        model = Order
        fields = [
            "apartment",
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

    # @staticmethod
    # def setup_eager_loading(queryset):
    #     """ optimizing "to-many" relationships with prefetch_related """
    #     queryset = queryset.select_related("apartment",'apartment__house')
    #     return queryset

class ExecutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Execution
        fields = [
            "order",
            "executor",
            "scheduled_time",
            "exec_status",
        ]
