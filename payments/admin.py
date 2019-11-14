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
        "date_created",
        "date_updated",
        "type",
        "amount",
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
        "amount",
        "number",
        "date_updated",
        "pdf_copy",
        "date",
        "date_created",
    ]


class BillPaymentAdminForm(forms.ModelForm):

    class Meta:
        model = models.BillPayment
        fields = "__all__"


class BillPaymentAdmin(admin.ModelAdmin):
    form = BillPaymentAdminForm
    list_display = [
        "amount",
    ]
    readonly_fields = [
        "amount",
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
admin.site.register(models.BillPayment, BillPaymentAdmin)
admin.site.register(models.Service, ServiceAdmin)
