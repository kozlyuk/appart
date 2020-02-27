from django.contrib import admin
from django import forms

from . import models


class PaymentAdminForm(forms.ModelForm):

    class Meta:
        model = models.Payment
        fields = "__all__"


class PaymentAdmin(admin.ModelAdmin):
    form = PaymentAdminForm
    list_display = [
        "payment_type",
        "value",
        "description",
        "date",
        "action",
    ]


class BillAdminForm(forms.ModelForm):

    class Meta:
        model = models.Bill
        fields = "__all__"


class BillAdmin(admin.ModelAdmin):
    form = BillAdminForm
    list_display = [
        "total_value",
        "number",
        "date",
    ]


class PaymentServiceAdminForm(forms.ModelForm):

    class Meta:
        model = models.PaymentService
        fields = "__all__"


class PaymentServiceAdmin(admin.ModelAdmin):
    form = PaymentServiceAdminForm
    list_display = [
        "value",
    ]


class ServiceAdminForm(forms.ModelForm):

    class Meta:
        model = models.Service
        fields = "__all__"


class ServiceAdmin(admin.ModelAdmin):
    form = ServiceAdminForm
    list_display = [
        "description",
        "name",
    ]


admin.site.register(models.Payment, PaymentAdmin)
admin.site.register(models.Bill, BillAdmin)
admin.site.register(models.PaymentService, PaymentServiceAdmin)
admin.site.register(models.Service, ServiceAdmin)
