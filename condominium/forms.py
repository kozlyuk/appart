""" Forms for managing condominiums """

from django import forms
from bootstrap_modal_forms.forms import BSModalForm

from condominium.models import Apartment, House, Company
from accounts.models import User


class ApartmentForm(forms.ModelForm):
    class Meta:
        model = Apartment
        fields = [
            "house",
            "resident",
            "number",
            "area",
            "residents_count",
            "description",
        ]
        widgets = {
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': '4'}),
            'area': forms.NumberInput(attrs={'class': 'form-control'}),
            'residents_count': forms.NumberInput(attrs={'class': 'form-control'}),
            'house': forms.Select(attrs={'class': 'form-control'}),
            'resident': forms.Select(attrs={'class': 'form-control'}),
            'number': forms.NumberInput(attrs={'class': 'form-control'})
        }


class ResidentForm(BSModalForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']


class HouseForm(forms.ModelForm):
    class Meta:
        model = House
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

    class Meta:
        model = Company
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
