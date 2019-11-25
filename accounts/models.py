""" Models for managing accounts """

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.urls import reverse
from django.core.validators import RegexValidator

from .managers import CustomUserManager

THEME_CHOICES = (
    ('LT', _('Light')),
    ('DK', _('Dark')),
)


def avatar_directory_path(instance, filename):
    """ file will be uploaded to MEDIA_ROOT/avatars/user_id/<filename> """
    return 'avatars/user_{0}/{1}'.format(instance.user.id, filename)


class User(AbstractUser):
    """
    Custom user model where mobile_number is the unique identifiers
    for authentication instead of usernames.
    Added fields mobile_number, birth_date, avatar, theme
    """
    phone_regex = RegexValidator(regex=r'^\d{10}$', message=_("Mobile number must contain 10 digits."))

    #  Fields
    username = None
    mobile_number = models.CharField(_('Mobile number'), max_length=10, validators=[phone_regex], unique=True)
    email = models.EmailField(_('Email address'), unique=True, blank=True)
    birth_date = models.DateField(_('Birth date'), null=True, blank=True)
    avatar = models.ImageField(_('Photo'), upload_to=avatar_directory_path, default='avatars/no_image.jpg', blank=True)
    theme = models.CharField(_('Theme'), max_length=2, choices=THEME_CHOICES, default='LT')

    USERNAME_FIELD = 'mobile_number'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def get_absolute_url(self):
        return reverse("accounts_User_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("accounts_User_update", args=(self.pk,))