""" Views for managing messaging """

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import FormView
from django.urls import reverse_lazy

from messaging.forms import ViberSentForm


class ViberSentView(LoginRequiredMixin, FormView):
    """ ViberSentView - view for sent viber messages """
    template_name = 'contact.html'
    form_class = ViberSentForm
    success_url = reverse_lazy('dashboard_main')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
