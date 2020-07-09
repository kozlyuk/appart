from django.contrib import admin
from django import forms

from . import models


class ApartmentAdminForm(forms.ModelForm):

    class Meta:
        model = models.Apartment
        fields = "__all__"


class ApartmentAdmin(admin.ModelAdmin):
    form = ApartmentAdminForm
    list_display = [
        "number",
        "house",
        "area",
        "resident",
    ]
    list_filter = ["house"]


class HouseAdminForm(forms.ModelForm):

    class Meta:
        model = models.House
        fields = "__all__"


class HouseAdmin(admin.ModelAdmin):
    form = HouseAdminForm
    list_display = [
        "name",
        "address",
        "logo",
        "apartments_count"
    ]


class CompanyAdminForm(forms.ModelForm):

    class Meta:
        model = models.Company
        fields = "__all__"


class CompanyAdmin(admin.ModelAdmin):
    form = CompanyAdminForm
    list_display = [
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


admin.site.register(models.Apartment, ApartmentAdmin)
admin.site.register(models.House, HouseAdmin)
admin.site.register(models.Company, CompanyAdmin)
