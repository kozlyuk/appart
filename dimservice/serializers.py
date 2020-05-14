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
    executions = ExecutionSerializer(source='execution_set', many=True)

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
            "executions",
            "created_by",
            "date_created",
            "date_updated",
            "date_closed",
        ]
        read_only_fields = ["house",
                            "work_name",
                            "created_by",
                            "date_created",
                            "date_updated",
                            "date_closed"
                            ]

    def create(self, validated_data):
        executions_data = validated_data.pop('executions')
        order = Order.objects.create(**validated_data)
        for execution_data in executions_data:
            Execution.objects.create(order=order, **execution_data)
        return order

    def update(self, instance, validated_data):
        # updating order
        instance.apartment = validated_data.get('apartment', instance.apartment)
        instance.work = validated_data.get('work', instance.work)
        instance.exec_status = validated_data.get('exec_status', instance.exec_status)
        instance.pay_status = validated_data.get('pay_status', instance.pay_status)
        instance.information = validated_data.get('information', instance.information)
        instance.warning = validated_data.get('warning', instance.warning)

        # updating execution
        executions_data = validated_data.get('executions')
        for execution_data in executions_data:
            execution_id = execution_data.get('id', None)
            if execution_id:
                execution = Execution.objects.get(id=execution_id, order=instance)
                execution.name = execution_data.get('name', execution.name)
                execution.price = execution_data.get('price', execution.price)
                execution.save()
            else:
                Execution.objects.create(order=instance, **execution_data)

        return instance

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-one" relationships with select_related """
        queryset = queryset.select_related('work', 'apartment', 'apartment__house') \
                           .prefetch_related('execution_set')
        return queryset
