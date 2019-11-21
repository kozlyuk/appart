from django import forms
from .models import Payment, Bill, Service


class PaymentForm(forms.ModelForm):
    class Meta:
        model = Payment
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
        model = Bill
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
        model = Service
        fields = [
            "description",
            "name",
        ]
