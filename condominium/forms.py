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

    name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    logo = forms.ImageField(widget=forms.FileInput(attrs={'class': 'custom-file-input'}))
    apartments_count = forms.IntegerField(widget=forms.NumberInput(attrs={'class': 'form-control'}))
    address = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    description = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'rows': '4'}))
    class Meta:
        model = models.House
        fields = [
            "name",
            "logo",
            "apartments_count",
            "address",
            "description",
        ]
        # widgets = {
        #     'description': CustomTextarea(attrs={'label': 'Description'}),
        #     'address': CustomTextarea(attrs={'label': 'Address'}),
        #     'name': CustomInput(attrs={'label': 'House name'}),
        #     'apartments_count': CustomNumberInput(attrs={'label': 'Apartments count'}),
        # }


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
    