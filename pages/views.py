from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView

from condominium.models import Company, House


class CompanyView(LoginRequiredMixin, DetailView):
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

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
