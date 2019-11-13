from django import forms
from . import models


class PaymentForm(forms.ModelForm):
    class Meta:
        model = models.Payment
        fields = [
            "date_updated",
            "type",
            "amount",
            "description",
            "date",
            "action",
            "bill",
        ]


class BillForm(forms.ModelForm):
    class Meta:
        model = models.Bill
        fields = [
            "amount",
            "number",
            "date_updated",
            "pdf_copy",
            "date",
            "apartment",
            "service",
        ]


class BillPaymentForm(forms.ModelForm):
    class Meta:
        model = models.BillPayment
        fields = [
            "amount",
            "bill",
            "payment",
        ]


class ServiceForm(forms.ModelForm):
    class Meta:
        model = models.Service
        fields = [
            "description",
            "name",
        ]
