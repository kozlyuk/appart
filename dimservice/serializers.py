from rest_framework import serializers
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
            "duration"
        ]


class ExecutionSerializer(serializers.ModelSerializer):
    executor_name = serializers.CharField(source='executor', required=False)
    exec_status = ChoicesField(choices=Order.EXEC_STATUS_CHOICES, required=False)

    class Meta:
        model = Execution
        fields = [
            "pk",
            "order",
            "executor",
            "executor_name",
            "scheduled_time",
            "exec_status",
        ]
        read_only_fields = ['executor_name']


class OrderSerializer(serializers.ModelSerializer):
    work_name = serializers.CharField(source='work', required=False)
    exec_status = ChoicesField(choices=Order.EXEC_STATUS_CHOICES, required=False)
    pay_status = ChoicesField(choices=Order.PAYMENT_STATUS_CHOICES, required=False)
    house = serializers.CharField(source='apartment.house.pk', required=False)
    execution_set = ExecutionSerializer(many=True, required=False)
    apartment_name = serializers.CharField(source='apartment', required=False)

    class Meta:
        model = Order
        fields = [
            "pk",
            "apartment",
            "apartment_name",
            "house",
            "work",
            "work_name",
            "exec_status",
            "pay_status",
            "information",
            "warning",
            "execution_set",
            "created_by",
            "date_created",
            "date_updated",
            "date_closed",
            ]
        read_only_fields = [
            "house",
            "work_name",
            "execution_set",
            "created_by",
            "date_created",
            "date_updated",
            "date_closed"
            ]

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-one" relationships with select_related """
        queryset = queryset.select_related('work', 'apartment', 'apartment__house') \
                           .prefetch_related('execution_set')
        return queryset
