from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView
from django.urls import reverse, reverse_lazy

from condominium.models import Company, House, Apartment


class CompanyView(DetailView):
    """ CompanyView - view for main company page """
    model = Company
    template_name = 'company_main.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class HouseView(LoginRequiredMixin, DetailView):
    """ HouseView - view for main house page """
    model = House
    template_name = 'house/house_main.j2'
    login_url = reverse_lazy('company_main')
    redirect_field_name = ''
    raise_exception = False

    def get_object(self, queryset=None):
        apartment = Apartment.objects.filter(resident=self.request.user)
        if apartment.exists():
            return apartment.first().house
        return reverse('company_main')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
