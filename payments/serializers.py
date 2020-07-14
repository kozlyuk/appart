from django.utils import timezone
from rest_framework import serializers

from payments.models import Payment, Bill, Service, Rate, BillLine, PaymentService


class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = [
            "pk",
            "houses",
            "name",
            "description",
            "uom_type",
            "uom"
        ]


class RateSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service', required=False)
    house_name = serializers.CharField(source='house', required=False)

    class Meta:
        model = Rate
        fields = [
            "pk",
            "service",
            "house",
            "value",
            "from_date",
            "service_name",
            "house_name"
        ]


class PaymentServiceSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service', required=False)

    class Meta:
        model = PaymentService
        fields = [
            "pk",
            "service",
            "service_name",
            "value"
        ]

    def create(self, validated_data):
        # add paymentservice to payment
        payment = Payment.objects.get(pk=self.context["view"].kwargs["payment_pk"])
        validated_data["payment"] = payment
        paymentservice = PaymentService.objects.create(**validated_data)
        return paymentservice


class PaymentSerializer(serializers.ModelSerializer):
    payment_service = PaymentServiceSerializer(source='paymentservice_set', many=True, required=False)
    apartment_name = serializers.CharField(source='apartment', required=False)

    class Meta:
        model = Payment
        fields = [
            "pk",
            "apartment",
            "apartment_name",
            "payment_service",
            "payment_type",
            "date",
            "value",
            "description",
        ]

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-many" relationships with prefetch_related """
        queryset = queryset.prefetch_related('paymentservice_set') \
                           .select_related('apartment')
        return queryset


class BillLineSerializer(serializers.ModelSerializer):
    total_debt = serializers.SerializerMethodField()
    rate = serializers.SerializerMethodField()
    service_name = serializers.CharField(source='service', required=False)

    class Meta:
        model = BillLine
        fields = [
            "pk",
            "service",
            "service_name",
            "previous_debt",
            "value",
            "total_debt",
            "rate"
        ]

    def create(self, validated_data):
        # add billline to bill
        bill = Bill.objects.get(pk=self.context["view"].kwargs["bill_pk"])
        validated_data["bill"] = bill
        billline = BillLine.objects.create(**validated_data)
        # update bill total_value
        bill.total_value += billline.total_debt()
        bill.save()
        return billline

    def get_total_debt(self, obj):
        return str(obj.total_debt())

    def get_rate(self, obj):
        area = obj.bill.apartment.area
        if area != 0:
            return str(obj.value / obj.bill.apartment.area)
        return 0


class BillSerializer(serializers.ModelSerializer):
    bill_lines = BillLineSerializer(source='billline_set', many=True, required=False)
    purpose = serializers.SerializerMethodField()
    apartment_name = serializers.CharField(source='apartment', required=False)
    apartment_area = serializers.CharField(source='apartment.area', required=False)
    apartment_account_number = serializers.CharField(source='apartment.account_number', required=False)
    bill_local_period = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = [
            "pk",
            "apartment",
            "apartment_name",
            "number",
            "total_value",
            "purpose",
            "period",
            "bill_local_period",
            "bill_lines",
            "is_active",
            "apartment_area",
            "apartment_account_number"
        ]

    def get_purpose(self, obj):
        return ", ".join([line.service.name for line in obj.billline_set.all()])

    def get_bill_local_period(self, obj):
        return obj.period.strftime('%B %Y')

    # def to_representation(self, instance):
    #     representation = instance.period(timezone.get_default_timezone()).isoformat()
    #     return representation

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-many" relationships with prefetch_related """
        queryset = queryset.prefetch_related('billline_set') \
                           .select_related('apartment')
        return queryset


class BillPDFSerializer(serializers.ModelSerializer):
    bill_lines = BillLineSerializer(source='billline_set', many=True, required=False)
    purpose = serializers.SerializerMethodField()
    apartment_name = serializers.CharField(source='apartment', required=False)

    class Meta:
        model = Bill
        fields = [
            "pk",
            "apartment",
            "apartment_name",
            "number",
            "total_value",
            "purpose",
            "period",
            "bill_lines",
            "is_active"
        ]

    def get_purpose(self, obj):
        return ", ".join([line.service.name for line in obj.billline_set.all()])

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-many" relationships with prefetch_related """
        queryset = queryset.prefetch_related('billline_set') \
                           .select_related('apartment')
        return queryset
