from django.views import generic
from . import models
from . import forms


class ApartmentListView(generic.ListView):
    model = models.Apartment
    form_class = forms.ApartmentForm


class ApartmentCreateView(generic.CreateView):
    model = models.Apartment
    form_class = forms.ApartmentForm


class ApartmentDetailView(generic.DetailView):
    model = models.Apartment
    form_class = forms.ApartmentForm


class ApartmentUpdateView(generic.UpdateView):
    model = models.Apartment
    form_class = forms.ApartmentForm
    pk_url_kwarg = "pk"


class HouseListView(generic.ListView):
    model = models.House
    form_class = forms.HouseForm


class HouseCreateView(generic.CreateView):
    model = models.House
    form_class = forms.HouseForm


class HouseDetailView(generic.DetailView):
    model = models.House
    form_class = forms.HouseForm


class HouseUpdateView(generic.UpdateView):
    model = models.House
    form_class = forms.HouseForm
    pk_url_kwarg = "pk"


class CompanyListView(generic.ListView):
    model = models.Company
    form_class = forms.CompanyForm


class CompanyCreateView(generic.CreateView):
    model = models.Company
    form_class = forms.CompanyForm


class CompanyDetailView(generic.DetailView):
    model = models.Company
    form_class = forms.CompanyForm


class CompanyUpdateView(generic.UpdateView):
    model = models.Company
    form_class = forms.CompanyForm
    pk_url_kwarg = "pk"
