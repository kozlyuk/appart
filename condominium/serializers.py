from datetime import timedelta
from rest_framework import serializers

from condominium.models import Apartment, House, Company


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = [
            "pk",
            "fullname",
            "chief",
            "logo",
            "name",
            "phone",
            "address",
            "description",
            "bank_requisites",
            "requisites",
            "parent_company",
        ]


class HouseSerializer(serializers.ModelSerializer):

    class Meta:
        model = House
        fields = [
            "pk",
            "company",
            "description",
            "address",
            "name",
            "logo",
        ]


class ApartmentSerializer(serializers.ModelSerializer):
    house_name = serializers.CharField(source='house', required=False)
    resident_name = serializers.CharField(source='resident', required=False)

    class Meta:
        model = Apartment
        fields = [
            "pk",
            "house",
            "house_name",
            "resident",
            "resident_name",
            "number",
            "account_number",
            "description",
            "is_active",
            "area",
            "residents_count",
            "debt"
        ]

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-one" relationships with select_related """
        queryset = queryset.select_related('house', 'resident')
        return queryset


class ApartmentAnalyticsSerializer(serializers.ModelSerializer):
    """ Serializer with analytics data for Apartments
        Get start_date end_date data from context
    """
    house_name = serializers.CharField(source='house', required=False)
    resident_name = serializers.CharField(source='resident', required=False)
    start_total_debt = serializers.SerializerMethodField()
    end_total_debt = serializers.SerializerMethodField()
    period_total_bills = serializers.SerializerMethodField()
    period_total_payments = serializers.SerializerMethodField()

    class Meta:
        model = Apartment
        fields = [
            "pk",
            "house_name",
            "resident_name",
            "number",
            "account_number",
            "start_total_debt",
            "end_total_debt",
            "period_total_bills",
            "period_total_payments"
        ]

    def get_start_total_debt(self, obj):
        start_previous_day = self.context['start_date'] - timedelta(days=1)
        return obj.period_total_bills(end_date=start_previous_day)

    def get_end_total_debt(self, obj):
        return obj.period_total_bills(end_date=self.context['end_date'])

    def get_period_total_bills(self, obj):
        return obj.period_total_bills(self.context['start_date'],
                                      self.context['end_date'])

    def get_period_total_payments(self, obj):
        return obj.period_total_payments(self.context['start_date'],
                                         self.context['end_date'])

    @staticmethod
    def setup_eager_loading(queryset):
        """ optimizing "to-one" relationships with select_related """
        queryset = queryset.select_related('house', 'resident')
        return queryset


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    class Meta:
        fields = ["file"]
