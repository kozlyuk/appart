from django.shortcuts import redirect
from django.views import generic
from django.urls import reverse_lazy
from django.utils.translation import ugettext_lazy as _
from bootstrap_modal_forms.generic import BSModalCreateView

from .models import Apartment, House, Company
from .forms import ApartmentForm, HouseForm, CompanyForm, ResidentForm


class ApartmentListView(generic.ListView):
    model = Apartment
    template_name = "apartment/apartment_list.j2"
    context_object_name = 'apartments'
    form_class = ApartmentForm


class ApartmentCreateView(generic.CreateView):
    model = Apartment
    template_name = "apartment/apartment_form.j2"
    form_class = ApartmentForm

    def get_context_data(self, **kwargs):
        context = super(ApartmentCreateView, self).get_context_data(**kwargs)
        context['header'] = _('Add new apartment')
        context['text_submit'] = _('Add')
        return context


class ApartmentDetailView(generic.DetailView):
    model = Apartment
    template_name = "apartment/apartment_detail.j2"
    form_class = ApartmentForm


class ApartmentUpdateView(generic.UpdateView):
    model = Apartment
    template_name = "apartment/apartment_form.j2"
    form_class = ApartmentForm
    pk_url_kwarg = "pk"

    def get_context_data(self, **kwargs):
        context = super(ApartmentUpdateView, self).get_context_data(**kwargs)
        apartment = str(context['apartment'])
        context['header'] = _('Edit apartment: ') + apartment
        context['text_submit'] = _('Save')
        return context


class ResidentModalView(BSModalCreateView):
    template_name = 'resident_modal.j2'
    form_class = ResidentForm
    success_url = reverse_lazy('condominium_Apartment_update')


class ApartmentDeleteView(generic.DeleteView):
    model = Apartment
    template_name = 'apartment/apartment_delete.j2'
    success_url = reverse_lazy('condominium_Apartment_list')


class HouseListView(generic.ListView):
    model = House
    template_name = "house/house_list.j2"
    context_object_name = 'houses'
    form_class = HouseForm


class HouseCreateView(generic.CreateView):
    model = House
    template_name = "house/house_form.j2"
    form_class = HouseForm

    def get_context_data(self, **kwargs):
        context = super(HouseCreateView, self).get_context_data(**kwargs)
        context['header'] = _('Add new house')
        context['text_submit'] = _('Add')
        return context

    def form_valid(self, form):
        house_obj = form.save()
        for number in range(self.object.apartments_count):
            Apartment.objects.create(house=house_obj, number=number+1)
        return redirect(self.get_success_url())


class HouseDetailView(generic.DetailView):
    model = House
    template_name = "house/house_detail.j2"
    form_class = HouseForm


class HouseUpdateView(generic.UpdateView):
    model = House
    template_name = "house/house_form.j2"
    form_class = HouseForm
    pk_url_kwarg = "pk"

    def get_context_data(self, **kwargs):
        context = super(HouseUpdateView, self).get_context_data(**kwargs)
        house = str(context['house'])
        context['header'] = _('Edit house: ') + house
        context['text_submit'] = _('Save')
        return context


class HouseDeleteView(generic.DeleteView):
    model = House
    template_name = 'house/house_delete.j2'
    success_url = reverse_lazy('condominium_House_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = self.get_object()
        if obj.apartment_set.exists():
            context['apartments'] = obj.apartment_set.all()
        return context


class CompanyUpdateView(generic.UpdateView):
    model = Company
    template_name = "company/company_form.j2"
    form_class = CompanyForm
    success_url = reverse_lazy('dashboard_main')

    def get_object(self, queryset=None):
        if Company.objects.exists():
            return Company.objects.last()
        else:
            company = Company.objects.create()
            return company
