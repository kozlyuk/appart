from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.views import LoginView
from django.views.generic import TemplateView, ListView, CreateView, UpdateView, DetailView

from .models import User
from .forms import EmailAuthenticationForm, CustomUserCreationForm, CustomUserChangeForm, CustomUserSelfUpdateForm


@method_decorator(login_required, name='dispatch')
class DashboardView(TemplateView):
    """ DashboardView - view for manager dashboard template """
    template_name = 'dashboard.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class EmailLoginView(LoginView):
    form_class = EmailAuthenticationForm


@method_decorator(login_required, name='dispatch')
class UserListView(ListView):
    model = User
    context_object_name = 'users'
    # success_url = reverse_lazy('manager_home')
    template_name = "user_list.j2"

    def get_queryset(self):
        deals = User.objects.filter(is_staff=True)
        return deals


@method_decorator(login_required, name='dispatch')
class UserCreateView(CreateView):
    model = User
    form_class = CustomUserCreationForm
    template_name = "user_form.j2"

    def get_context_data(self, **kwargs):
        context = super(UserCreateView, self).get_context_data(**kwargs)
        context['header'] = _('Add user')
        context['text_submit'] = _('Add user')
        return context

    def form_valid(self, form):
        form.instance.is_staff = True
        return super().form_valid(form)


@method_decorator(login_required, name='dispatch')
class UserDetailView(DetailView):
    model = User
    template_name = "user_detail.j2"
#    form_class = forms.UserForm


@method_decorator(login_required, name='dispatch')
class UserUpdateView(UpdateView):
    model = User
    template_name = "user_form.j2"
    form_class = CustomUserChangeForm
    pk_url_kwarg = "pk"

    def get_context_data(self, **kwargs):
        context = super(UserUpdateView, self).get_context_data(**kwargs)
        email = str(context['user'])
        context['header'] = _('Edit user: ') + email
        context['text_submit'] = _('Save')
        return context


@method_decorator(login_required, name='dispatch')  # pylint: disable=too-many-ancestors
class UserSelfUpdate(UpdateView):
    """ PartnerSelfUpdate - view for partners self updating """
    template_name = 'user_form.j2'
    form_class = CustomUserSelfUpdateForm
    # success_url = reverse_lazy('manager_home')

    def get_object(self, queryset=None):
        return User.objects.get(email=self.request.user)

    def get_context_data(self, **kwargs):
        context = super(UserSelfUpdate, self).get_context_data(**kwargs)
        context['header'] = _('My profile')
        context['text_submit'] = _('Save')
        return context
