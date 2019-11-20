from django.views import generic
from django.urls import reverse_lazy

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
    template_name = "house/house_list.j2"
    context_object_name = 'houses'
    form_class = forms.HouseForm


class HouseCreateView(generic.CreateView):
    model = models.House
    template_name = "house/house_form.j2"
    form_class = forms.HouseForm

    def get_context_data(self, **kwargs):
        context = super(HouseCreateView, self).get_context_data(**kwargs)
        context['header'] = 'Add new house'
        context['text_submit'] = 'Add'
        return context


class HouseDetailView(generic.DetailView):
    model = models.House
    template_name = "house/house_detail.j2"
    form_class = forms.HouseForm


class HouseUpdateView(generic.UpdateView):
    model = models.House
    template_name = "house/house_form.j2"
    form_class = forms.HouseForm
    pk_url_kwarg = "pk"

    def get_context_data(self, **kwargs):
        context = super(HouseUpdateView, self).get_context_data(**kwargs)
        house = str(context['house'])
        context['header'] = 'Edit house: ' + house
        context['text_submit'] = 'Save'
        return context


class HouseDeleteView(generic.DeleteView):
    """ HouseDelete - view for deleting houses """
    model = models.House
    template_name = 'house/house_delete.j2'
    success_url = reverse_lazy('condominium_House_list')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = self.get_object()
        if obj.apartments_set.exists():
            context['apartments'] = obj.apartments_set.all()
        return context


class CompanyCreateView(generic.CreateView):
    model = models.Company
    form_class = forms.CompanyForm
    success_url = reverse_lazy('appart_main')


class CompanyUpdateView(generic.UpdateView):
    model = models.Company
    template_name = "company/company_form.j2"
    form_class = forms.CompanyForm
    pk_url_kwarg = "pk"
    success_url = reverse_lazy('appart_main')
