from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView
from django.urls import reverse, reverse_lazy
from datetime import date
from django.shortcuts import redirect
from django.core.exceptions import PermissionDenied

from condominium.models import Company, House, Apartment
from notice.models import News



class CompanyView(DetailView):
    """ CompanyView - view for main company page """
    model = Company
    template_name = 'company/company_main.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['news_list'] = News.objects.filter(
            houses=None,
            actual_from__lte=date.today(), actual_to__gte=date.today())
        return context

    def get_object(self, queryset=None):
        try:
            return Company.objects.get(pk=1)
        except self.model.DoesNotExist:
            raise PermissionDenied


class HouseView(DetailView):
    """ HouseView - view for main house page """
    model = House
    template_name = 'house/house_main.j2'

    def dispatch(self, request, *args, **kwargs):
        if self.request.user:
            if Apartment.objects.filter(resident=self.request.user).exists():
                return super().dispatch(request, *args, **kwargs)
        return redirect('company_main')

    def get_object(self, queryset=None):
        return Apartment.objects.first().house

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['news_list'] = self.object.news_set.filter(
            actual_from__lte=date.today(), actual_to__gte=date.today())
        return context
