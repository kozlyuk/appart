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


class OrderSerializer(serializers.ModelSerializer):
    work_name = serializers.CharField(source='work', required=False)
    exec_status = ChoicesField(choices=Order.EXEC_STATUS_CHOICES, required=False)
    pay_status = ChoicesField(choices=Order.PAYMENT_STATUS_CHOICES, required=False)
    house = serializers.CharField(source='apartment.house.pk', required=False)

    class Meta:
        model = Order
        fields = [
            "pk",
            "apartment",
            "house",
            "work",
            "work_name",
            "exec_status",
            "pay_status",
            "information",
            "warning",
            "executors",
            "created_by",
            "date_created",
            "date_updated",
            "date_closed",
        ]
        read_only_fields = ('house', 'work_name')

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-one" relationships with select_related """
        queryset = queryset.select_related('work', 'apartment', 'apartment__house') \
                           .prefetch_related('executors')
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
