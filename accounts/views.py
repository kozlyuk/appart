from django.views import generic
from .models import User
from .forms import CustomUserCreationForm, CustomUserChangeForm


class UserListView(generic.ListView):
    model = User


class UserCreateView(generic.CreateView):
    model = User
    form_class = CustomUserCreationForm


class UserDetailView(generic.DetailView):
    model = User
#    form_class = forms.UserForm


class UserUpdateView(generic.UpdateView):
    model = User
    form_class = CustomUserChangeForm
    pk_url_kwarg = "pk"
