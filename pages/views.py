from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView
from django.urls import reverse, reverse_lazy
from datetime import date

from condominium.models import Company, House, Apartment
from notice.models import Notice


class CompanyView(DetailView):
    """ CompanyView - view for main company page """
    model = Company
    template_name = 'company/company_main.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['notices'] = Notice.objects.filter(
            actual_from__gte=date.today(), actual_to__lte=date.today(),
            notice_type=Notice.Company).order_by('notice_status', 'notice_type')
        return context

    def get_object(self, queryset=None):
        return Company.objects.first()


class HouseView(LoginRequiredMixin, DetailView):
    """ HouseView - view for main house page """
    model = House
    template_name = 'house/house_main.j2'
    login_url = reverse_lazy('company_main')
    redirect_field_name = ''

    def get_object(self, queryset=None):
        apartment = Apartment.objects.filter(resident=self.request.user)
        if apartment.exists():
            return apartment.first().house
        return reverse('company_main')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['notices'] = self.object.notice_set.filter(
            actual_from__gte=date.today(), actual_to__lte=date.today()) \
            .order_by('-notice_status', 'notice_type')
        return context
