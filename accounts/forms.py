from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.forms import AuthenticationForm
from appart.custom_widgets import CustomInput, CustomFileInput, CustomSelect, CustomPasswordInput

from accounts.models import User


class EmailLowerField(forms.EmailField):
    def to_python(self, value):
        return value.lower()


class EmailAuthenticationForm(AuthenticationForm):
    username = EmailLowerField(required=True)


class CustomUserCreationForm(UserCreationForm):
    password1 = forms.CharField(label=_("Password"), strip=False, widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    password2 = forms.CharField(label=_("Password confirmation"), widget=forms.PasswordInput(attrs={'class': 'form-control'}), strip=False)

    class Meta:
        model = User
        fields = ('email', 'mobile_number', 'birth_date', 'avatar', 'theme', 'password1', 'password2')
        widgets = {
            'email': forms.TextInput(attrs={'class': 'form-control'}),
            'mobile_number': forms.TextInput(attrs={'class': 'form-control'}),
            'birth_date': forms.DateInput(attrs={'class': 'form-control'}),
            'avatar': forms.FileInput(attrs={'class': 'custom-file-input'}),
            'theme': forms.Select(attrs={'class': 'form-control'}),
        }


class CustomUserChangeForm(UserChangeForm):
    password = forms.CharField(label=_("Current password"), strip=False, widget=CustomPasswordInput(attrs={'label': 'Current password'}))
    password1 = forms.CharField(label=_("New password"), strip=False, widget=CustomPasswordInput(attrs={'label': 'New password'}))
    password2 = forms.CharField(label=_('Confirm new password'), max_length=255, required=True, widget=CustomPasswordInput(attrs={'label': 'Confirm new password'}))
    avatar = forms.CharField(required=False, widget=CustomFileInput(attrs={'label': 'Avatar'}))
    birth_date = forms.DateField(required=False, widget=CustomInput(attrs={'label': 'Birthday'}))

    class Meta:
        model = User
        fields = ('email', 'mobile_number', 'birth_date', 'avatar', 'theme')
        widgets = {
            'email': CustomInput(attrs={'label': 'Email'}),
            'mobile_number': CustomInput(attrs={'label': 'Mobile phone'}),
            'theme': CustomSelect(attrs={'label': 'Theme'}),
        }
        email = EmailLowerField(required=True)


class CustomUserSelfUpdateForm(forms.ModelForm):
    """ EmployeeSelfUpdateForm - form for employees self-creating self-updating """
    x = forms.FloatField(widget=forms.HiddenInput(), initial=0)
    y = forms.FloatField(widget=forms.HiddenInput(), initial=0)
    width = forms.FloatField(widget=forms.HiddenInput(), initial=0)
    height = forms.FloatField(widget=forms.HiddenInput(), initial=0)
    password = forms.CharField(label=_("Current password"), strip=False, widget=CustomPasswordInput(attrs={'label': 'Current password'}))
    password1 = forms.CharField(label=_("New password"), strip=False, widget=CustomPasswordInput(attrs={'label': 'New password'}))
    password2 = forms.CharField(label=_('Confirm new password'), max_length=255, required=True, widget=CustomPasswordInput(attrs={'label': 'Confirm new password'}))
    avatar = forms.CharField(required=False, widget=CustomFileInput(attrs={'label': 'Avatar'}))
    birth_date = forms.DateField(required=False, widget=CustomInput(attrs={'label': 'Birthday'}))

    class Meta:
        model = User
        fields = ['email', 'mobile_number', 'birth_date', 'avatar', 'theme']
        widgets = {
            'email': CustomInput(attrs={'label': 'Email'}),
            'mobile_number': CustomInput(attrs={'label': 'Mobile phone'}),
            'theme': CustomSelect(attrs={'label': 'Theme'}),
        }

    def save(self, *args, **kwargs):  # pylint: disable=W0221
        instance = super().save(*args, **kwargs)
        pos_x = self.cleaned_data.get('x')
        pos_y = self.cleaned_data.get('y')
        width = self.cleaned_data.get('width')
        height = self.cleaned_data.get('height')
        if width > 0 and height > 0:
            image = Image.open(instance.avatar)
            cropped_image = image.crop((pos_x, pos_y, width+pos_x, height+pos_y))
            resized_image = cropped_image.resize((200, 200), Image.ANTIALIAS)
            resized_image.save(instance.avatar.path)
        return instance
