from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers, status
from rest_framework.response import Response
from appart.utils import ChoicesField

from dimservice.models import Work, Order, Execution

class WorkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Work
        fields = [
            "pk",
            "name",
            "price_code",
            "price",
            "description",
            "is_active",
            "duration"
        ]


class OrderSerializer(serializers.ModelSerializer):
    work_name = serializers.CharField(source='work', required=False)
    exec_status = ChoicesField(choices=Order.EXEC_STATUS_CHOICES, required=False)
    pay_status = ChoicesField(choices=Order.PAYMENT_STATUS_CHOICES, required=False)

    class Meta:
        model = Order
        fields = [
            "pk",
            "apartment",
            "work",
            "work_name",
            "exec_status",
            "pay_status",
            "information",
            "warning",
            "created_by",
            "date_created",
            "date_updated",
            "date_closed",
        ]

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-one" relationships with select_related """
        queryset = queryset.select_related('work')
        return queryset

class ExecutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Execution
        fields = [
            "pk",
            "order",
            "executor",
            "scheduled_time",
            "exec_status",
        ]
