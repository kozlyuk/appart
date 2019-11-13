from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.translation import ugettext_lazy as _

from accounts.models import User


class EmailLowerField(forms.EmailField):
    def to_python(self, value):
        return value.lower()


class AuthenticationForm(forms.Form):
    email = EmailLowerField(required=True)
    password = forms.CharField(label=_('Password'), max_length=255, required=True, widget=forms.PasswordInput)


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ('email', 'mobile_number', 'birth_date', 'avatar', 'theme')

    email = EmailLowerField(required=True)


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ('email', 'mobile_number', 'birth_date', 'avatar', 'theme')

    email = EmailLowerField(required=True)
