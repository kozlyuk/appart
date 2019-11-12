from django.views import generic
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .models import User
from .forms import CustomUserCreationForm, CustomUserChangeForm


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


@method_decorator(login_required, name='dispatch')
class UserDetailView(generic.DetailView):
    model = User
#    form_class = forms.UserForm


@method_decorator(login_required, name='dispatch')
class UserUpdateView(generic.UpdateView):
    model = User
    form_class = CustomUserChangeForm
    pk_url_kwarg = "pk"
