from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import DetailView

from condominium.models import Company, House


@method_decorator(login_required, name='dispatch')
class CompanyView(DetailView):
    """ CompanyView - view for main company page """
    model = Company
    template_name = 'company_main.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


@method_decorator(login_required, name='dispatch')
class HouseView(DetailView):
    """ HouseView - view for main house page """
    model = House
    template_name = 'house_main.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
