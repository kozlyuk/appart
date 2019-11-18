from django import forms
from appart.custom_widgets import CustomInput, CustomFileInput, CustomSelect, CustomTextarea
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
            "apartments_count",
        ]


class CompanyForm(forms.ModelForm):
    fullname = forms.CharField(widget=CustomInput(attrs={'label': 'Full name'}))
    chief = forms.CharField(widget=CustomInput(attrs={'label': 'Chief name'}))
    logo = forms.ImageField(required=False, widget=CustomFileInput(attrs={'label': 'Company logo'}))
    name = forms.CharField(widget=CustomInput(attrs={'label': 'Company name'}))
    phone = forms.CharField(widget=CustomInput(attrs={'label': 'Chief phone'}))
    address = forms.CharField(widget=CustomTextarea(attrs={'label': 'Company address'}))
    description = forms.CharField(widget=CustomTextarea(attrs={'label': 'Description'}))
    bank_requisites = forms.CharField(widget=CustomTextarea(attrs={'label': 'Bank requisites'}))
    requisites = forms.CharField(widget=CustomTextarea(attrs={'label': 'Requisites'}))
    class Meta:
        model = models.Company
        fields = [
            "name",
            "fullname",
            "chief",
            "logo",
            "phone",
            "address",
            "bank_requisites",
            "requisites",
            "description",
        ]
