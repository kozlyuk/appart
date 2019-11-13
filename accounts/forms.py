from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.translation import ugettext_lazy as _

from appart.custom_widgets import CustomInput, CustomFileInput, CustomSelect, CustomPasswordInput

from accounts.models import User


class EmailLowerField(forms.EmailField):
    def to_python(self, value):
        return value.lower()


class AuthenticationForm(forms.Form):
    email = EmailLowerField(required=True)
    password = forms.CharField(label=_('Password'), max_length=255, required=True, widget=forms.PasswordInput)


class CustomUserCreationForm(UserCreationForm):
    password1 = forms.CharField(label=_("Пароль"), strip=False, widget=CustomPasswordInput(attrs={'label': 'Пароль'}))
    password2 = forms.CharField(label=_('Підтвердження пароля'), max_length=255, required=True, widget=CustomPasswordInput(attrs={'label': 'Підтвердження пароля'}))
    avatar = forms.CharField(required=False, widget=CustomFileInput(attrs={'label': 'Аватар'}))
    birth_date = forms.DateField(required=False, widget=CustomInput(attrs={'label': 'День народження'}))

    class Meta:
        model = User
        fields = ('email', 'mobile_number', 'birth_date', 'avatar', 'theme', 'password1', 'password2')
        widgets = {
            'email': CustomInput(attrs={'label': 'Пошта'}),
            'mobile_number': CustomInput(attrs={'label': 'Мобільний номер'}),
            'theme': CustomSelect(attrs={'label': 'Тема'}),
        }
        email = EmailLowerField(required=True)


class CustomUserChangeForm(UserChangeForm):
    password = forms.CharField(label=_("Пароль"), strip=False, widget=CustomPasswordInput(attrs={'label': 'Поточний пароль'}))
    password1 = forms.CharField(label=_("Пароль"), strip=False, widget=CustomPasswordInput(attrs={'label': 'Новий пароль'}))
    password2 = forms.CharField(label=_('Підтвердження пароля'), max_length=255, required=True, widget=CustomPasswordInput(attrs={'label': 'Підтвердження нового паролю'}))
    avatar = forms.CharField(required=False, widget=CustomFileInput(attrs={'label': 'Аватар'}))
    birth_date = forms.CharField(required=False, widget=CustomInput(attrs={'label': 'День народження'}))

    class Meta:
        model = User
        fields = ('email', 'mobile_number', 'birth_date', 'avatar', 'theme')
        widgets = {
            'email': CustomInput(attrs={'label': 'Пошта'}),
            'mobile_number': CustomInput(attrs={'label': 'Мобільний номер'}),
            'theme': CustomSelect(attrs={'label': 'Тема'}),
        }
        email = EmailLowerField(required=True)
