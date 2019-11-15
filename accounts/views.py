from django.views import generic
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import User
from .forms import CustomUserCreationForm, CustomUserChangeForm, EmailAuthenticationForm, CustomUserSelfUpdateForm
from django.contrib.auth.views import LoginView


class EmailLoginView(LoginView):
    form_class = EmailAuthenticationForm


@method_decorator(login_required, name='dispatch')
class UserListView(generic.ListView):
    model = User
    context_object_name = 'users'
    # success_url = reverse_lazy('manager_home')
    template_name = "user_list.j2"


@method_decorator(login_required, name='dispatch')
class UserCreateView(generic.CreateView):
    model = User
    form_class = CustomUserCreationForm
    template_name = "user_form.j2"

    def get_context_data(self, **kwargs):
        context = super(UserCreateView, self).get_context_data(**kwargs)
        context['header'] = 'Add user'
        context['text_submit'] = 'Add user'
        return context


@method_decorator(login_required, name='dispatch')
class UserDetailView(generic.DetailView):
    model = User
    template_name = "user_detail.j2"
#    form_class = forms.UserForm


@method_decorator(login_required, name='dispatch')
class UserUpdateView(generic.UpdateView):
    model = User
    template_name = "user_form.j2"
    form_class = CustomUserChangeForm
    pk_url_kwarg = "pk"

    def get_context_data(self, **kwargs):
        context = super(UserUpdateView, self).get_context_data(**kwargs)
        email = str(context['user'])
        context['header'] = 'Edit user: ' + email
        context['text_submit'] = 'Save'
        return context


@method_decorator(login_required, name='dispatch')  # pylint: disable=too-many-ancestors
class UserSelfUpdate(generic.UpdateView):
    """ PartnerSelfUpdate - view for partners self updating """
    template_name = 'user_form.j2'
    form_class = CustomUserSelfUpdateForm
    # success_url = reverse_lazy('manager_home')

    def get_object(self, queryset=None):
        return User.objects.get(email=self.request.user)

    def get_context_data(self, **kwargs):
        context = super(UserSelfUpdate, self).get_context_data(**kwargs)
        context['header'] = 'My profile'
        return context