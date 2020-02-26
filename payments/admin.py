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
        "total_value",
        "number",
        "date",
    ]


class BillPaymentAdminForm(forms.ModelForm):

    class Meta:
        model = models.BillPayment
        fields = "__all__"


class BillPaymentAdmin(admin.ModelAdmin):
    form = BillPaymentAdminForm
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
admin.site.register(models.BillPayment, BillPaymentAdmin)
admin.site.register(models.Service, ServiceAdmin)
