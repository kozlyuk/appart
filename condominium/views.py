from django.shortcuts import redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.utils.translation import ugettext_lazy as _
from datetime import date

from condominium.models import Apartment, House, Company
from condominium.forms import ApartmentForm, HouseForm, CompanyForm
from notice.models import Notice


class ApartmentListView(LoginRequiredMixin, ListView):
    model = Apartment
    template_name = "apartment/apartment_list.j2"
    context_object_name = 'apartments'
    form_class = ApartmentForm


class ApartmentCreateView(LoginRequiredMixin, CreateView):
    model = Apartment
    template_name = "apartment/apartment_form.j2"
    form_class = ApartmentForm
    success_url = reverse_lazy('condominium_Apartment_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['header'] = _('Add new apartment')
        context['apartment_id'] = 'undefined'
        context['text_submit'] = _('Add')
        return context


class ApartmentDetailView(LoginRequiredMixin, DetailView):
    model = Apartment
    template_name = "apartment/apartment_detail.j2"
    form_class = ApartmentForm


class ApartmentUpdateView(LoginRequiredMixin, UpdateView):
    model = Apartment
    template_name = "apartment/apartment_form.j2"
    form_class = ApartmentForm
    success_url = reverse_lazy('condominium_Apartment_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        apartment = str(context['apartment'])
        context['header'] = _('Edit apartment: ') + apartment
        context['apartment_id'] = self.object.pk
        context['text_submit'] = _('Save')
        return context


class ApartmentDeleteView(LoginRequiredMixin, DeleteView):
    model = Apartment
    template_name = 'apartment/apartment_delete.j2'
    success_url = reverse_lazy('condominium_Apartment_list')


class HouseListView(LoginRequiredMixin, ListView):
    model = House
    template_name = "house/house_list.j2"
    context_object_name = 'houses'
    form_class = HouseForm


class HouseCreateView(CreateView):
    model = House
    template_name = "house/house_form.j2"
    form_class = HouseForm
    success_url = reverse_lazy('condominium_House_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['header'] = _('Add new house')
        context['text_submit'] = _('Add')
        return context

    def form_valid(self, form):
        house_obj = form.save()
        for number in range(house_obj.apartments_count):
            Apartment.objects.create(house=house_obj, number=number+1)
        return redirect(self.success_url)


class HouseDetailView(DetailView):
    model = House
    template_name = "house/house_detail.j2"
    form_class = HouseForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['notices'] = self.object.notice_set.filter(
            actual_from__gte=date.today(), actual_to__lte=date.today()) \
            .order_by('notice_status')
        return context

class HouseUpdateView(UpdateView):
    model = House
    template_name = "house/house_form.j2"
    form_class = HouseForm
    pk_url_kwarg = "pk"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        house = str(context['house'])
        context['header'] = _('Edit house: ') + house
        context['text_submit'] = _('Save')
        return context


class HouseDeleteView(DeleteView):
    model = House
    template_name = 'house/house_delete.j2'
    success_url = reverse_lazy('condominium_House_list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        obj = self.get_object()
        if obj.apartment_set.exists():
            context['apartments'] = obj.apartment_set.all()
        return context


class CompanyUpdateView(UpdateView):
    model = Company
    template_name = "company/company_form.j2"
    form_class = CompanyForm
    success_url = reverse_lazy('dashboard_main')

    def get_object(self, queryset=None):
        if Company.objects.exists():
            return Company.objects.last()
        company = Company.objects.create()
        return company
