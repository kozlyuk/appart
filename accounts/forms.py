from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from accounts.models import User


class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = User
        fields = ('email', 'mobile_number', 'birth_date', 'avatar', 'theme')


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ('mobile_number', 'birth_date', 'avatar', 'theme')
