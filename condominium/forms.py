from django import forms
from appart.custom_widgets import CustomInput, CustomFileInput, CustomSelect, CustomTextarea, CustomNumberInput
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

    logo = forms.ImageField(widget=CustomFileInput(attrs={'label': 'House logo'}))

    class Meta:
        model = models.House
        fields = [
            "name",
            "company",
            "logo",
            "apartments_count",
            "address",
            "description",
        ]
        widgets = {
            'description': CustomTextarea(attrs={'label': 'Description'}),
            'address': CustomTextarea(attrs={'label': 'Address'}),
            'name': CustomInput(attrs={'label': 'House name'}),
            'company': CustomSelect(attrs={'label': 'Company'}),
            'apartments_count': CustomNumberInput(attrs={'label': 'Apartaments count'}),
        }


class CompanyForm(forms.ModelForm):
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
        widgets = {
            'name': CustomInput(attrs={'label': 'Full name'}),
            'fullname': CustomInput(attrs={'label': 'Full name'}),
            'chief': CustomInput(attrs={'label': 'Chief name'}),
            'logo': CustomFileInput(attrs={'label': 'Company logo'}),
            'phone': CustomInput(attrs={'label': 'Chief phone'}),
            'address': CustomTextarea(attrs={'label': 'Company address'}),
            'description': CustomTextarea(attrs={'label': 'Description'}),
            'bank_requisites': CustomTextarea(attrs={'label': 'Bank requisites'}),
            'requisites': CustomTextarea(attrs={'label': 'Requisites'}),
        }
