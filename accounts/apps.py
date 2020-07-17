from django.apps import AppConfig, apps
from django_rest_passwordreset.signals import reset_password_token_created
from accounts.signals import password_reset_token_created


class AccountsConfig(AppConfig):
    name = 'accounts'

    # def ready(self):
    #     sender = apps.get_model(app_label='accounts', model_name='User')
    #     reset_password_token_created.connect(password_reset_token_created, sender=sender)
