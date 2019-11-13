from django import forms
from . import models


class PaymentForm(forms.ModelForm):
    class Meta:
        model = models.Payment
        fields = [
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
            "pdf_copy",
            "date",
            "apartment",
            "service",
        ]


class ServiceForm(forms.ModelForm):
    class Meta:
        model = models.Service
        fields = [
            "description",
            "name",
        ]
