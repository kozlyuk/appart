from django.views import generic
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


@method_decorator(login_required, name='dispatch')
class DashboardView(generic.TemplateView):
    """ DashboardView - view for manager dashboard template """
    template_name = 'dashboard.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
