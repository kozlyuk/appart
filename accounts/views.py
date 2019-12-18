from django.utils.translation import gettext_lazy as _
from django.contrib.auth.views import LoginView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import TemplateView, ListView, CreateView, UpdateView, DetailView

from .models import User
from .forms import CustomAuthenticationForm, CustomUserCreationForm, CustomUserChangeForm, CustomUserSelfUpdateForm


class DashboardView(LoginRequiredMixin, TemplateView):
    """ DashboardView - view for manager dashboard template """
    template_name = 'dashboard.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class CabinetView(LoginRequiredMixin, TemplateView):
    """ CabinetView - view for resident personal cabinet template """
    template_name = 'cabinet.j2'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm


class UserListView(LoginRequiredMixin, ListView):
    model = User
    context_object_name = 'users'
    template_name = "user_list.j2"

    def get_queryset(self):
        deals = User.objects.filter(is_staff=True)
        return deals


class UserCreateView(LoginRequiredMixin, CreateView):
    model = User
    form_class = CustomUserCreationForm
    template_name = "user_form.j2"
    success_url = reverse_lazy('accounts_User_list')

    def get_context_data(self, **kwargs):
        context = super(UserCreateView, self).get_context_data(**kwargs)
        context['header'] = _('Add user')
        context['text_submit'] = _('Add user')
        return context

    def form_valid(self, form):
        form.instance.is_staff = True
        return super().form_valid(form)


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    template_name = "user_detail.j2"
#    form_class = forms.UserForm


class UserUpdateView(LoginRequiredMixin, UpdateView):
    model = User
    template_name = "user_form.j2"
    form_class = CustomUserChangeForm
    pk_url_kwarg = "pk"
    success_url = reverse_lazy('accounts_User_list')

    def get_context_data(self, **kwargs):
        context = super(UserUpdateView, self).get_context_data(**kwargs)
        email = str(context['user'])
        context['header'] = _('Edit user: ') + email
        context['text_submit'] = _('Save')
        return context


class UserSelfUpdate(LoginRequiredMixin, UpdateView):
    """ PartnerSelfUpdate - view for partners self updating """
    template_name = 'user_form.j2'
    form_class = CustomUserSelfUpdateForm
    success_url = reverse_lazy('accounts_User_list')

    def get_object(self, queryset=None):
        return User.objects.get(email=self.request.user)

    def get_context_data(self, **kwargs):
        context = super(UserSelfUpdate, self).get_context_data(**kwargs)
        context['header'] = _('My profile')
        context['text_submit'] = _('Save')
        return context
