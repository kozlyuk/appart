from django import forms
from appart.custom_widgets import CustomInput, CustomFileInput, CustomSelect, CustomTextarea, CustomNumberInput
from appart.formatChecker import ContentTypeRestrictedFileField
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
            "name",
            "logo",
            "apartments_count",
            "address",
            "description",
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'logo': forms.FileInput(attrs={'class': 'custom-file-input'}),
            'apartments_count': forms.NumberInput(attrs={'class': 'form-control'}),
            'address': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': '4'}),
        }


class CompanyForm(forms.ModelForm):

    # logo = ContentTypeRestrictedFileField()

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
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'fullname': forms.TextInput(attrs={'class': 'form-control'}),
            'chief': forms.TextInput(attrs={'class': 'form-control'}),
            'logo': forms.FileInput(attrs={'class': 'custom-file-input'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': '2'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': '4'}),
            'bank_requisites': forms.Textarea(attrs={'class': 'form-control', 'rows': '4'}),
            'requisites': forms.Textarea(attrs={'class': 'form-control', 'rows': '4'}),
        }
    