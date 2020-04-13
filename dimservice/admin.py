from django.contrib import admin

from dimservice.models import Work, Order, Execution


@admin.register(Work)
class WorkAdmin(admin.ModelAdmin):
    """ Admin settings for Work table """
    list_display = [
        "name",
        "price_code",
        "description",
        "is_active",
    ]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """ Admin settings for Order table """
    list_display = [
        "pk",
        "apartment",
        "work",
        "exec_status",
        "pay_status"
    ]


@admin.register(Execution)
class ExecutionAdmin(admin.ModelAdmin):
    """ Admin settings for Execution table """
    list_display = [
        "order",
        "executor",
        "scheduled_time",
        "exec_status"
    ]
