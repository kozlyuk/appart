from django import forms
from . import models


class ApartmentForm(forms.ModelForm):
    class Meta:
        model = models.Apartment
        fields = [
            "description",
            "area",
            "residents_count",
            "house",
            "resident",
        ]


class HouseForm(forms.ModelForm):
    class Meta:
        model = models.House
        fields = [
            "description",
            "address",
            "name",
            "logo",
            "company",
        ]


class CompanyForm(forms.ModelForm):
    class Meta:
        model = models.Company
        fields = [
            "fullname",
            "chief",
            "logo",
            "name",
            "phone",
            "address",
            "description",
            "bank_requisites",
            "requisites",
        ]
