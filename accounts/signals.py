from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse

from django_rest_passwordreset.signals import reset_password_token_created
from messaging.tasks import send_email


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    """

    mail_subject = _("DimOnline Password Reset Confirmation")
    domain = settings.FRONT_SITE_URL
    token = reset_password_token.key
    message = render_to_string('email/user_reset_password.txt', {
        'first_name': reset_password_token.user.first_name,
        'reset_password_url': f"{domain}/registration/password_reset/{token}/"
    })
    send_email(mail_subject, message, [reset_password_token.user.email])  # TODO add delay
