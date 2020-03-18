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
            "is_active",
            "duration"
        ]


class OrderSerializer(serializers.ModelSerializer):
    work = serializers.StringRelatedField()
    exec_status = serializers.CharField(source='get_exec_status_display')
    pay_status = serializers.CharField(source='get_pay_status_display')

    class Meta:
        model = Order
        fields = [
            "pk",
            "apartment",
            "work",
            "number",
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
