from django.contrib import admin

from payments import models


@admin.register(models.Service)
class ServiceAdmin(admin.ModelAdmin):
    """ Admin settings for Service table """
    list_display = [
        "name",
        "description",
        "uom_type",
        "uom"
    ]


@admin.register(models.Rate)
class RateAdmin(admin.ModelAdmin):
    """ Admin settings for Rate table """
    list_display = [
        "service",
        "house",
        "rate",
        "from_date"
    ]


@admin.register(models.Meter)
class MeterAdmin(admin.ModelAdmin):
    """ Admin settings for Meter table """
    list_display = [
        "apartment",
        "meter_type",
        "serial_number",
        "is_active"
    ]


@admin.register(models.MeterRecord)
class MeterRecordAdmin(admin.ModelAdmin):
    """ Admin settings for MeterRecord table """
    list_display = [
        "meter",
        "value",
        "date",
    ]


@admin.register(models.Bill)
class BillAdmin(admin.ModelAdmin):
    """ Admin settings for Bill table """
    list_display = [
        "number",
        "apartment",
        "total_value",
        "period",
        "is_active",
    ]


@admin.register(models.BillLine)
class BIllLineAdmin(admin.ModelAdmin):
    """ Admin settings for BillLine table """
    list_display = [
        "bill",
        "service",
        "previous_debt",
        "value",
    ]


@admin.register(models.Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        "apartment",
        "payment_type",
        "date",
        "value",
    ]


@admin.register(models.PaymentService)
class PaymentServiceAdmin(admin.ModelAdmin):
    list_display = [
        "payment",
        "service",
        "value",
    ]
