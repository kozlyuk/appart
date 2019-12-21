from django.core.management.base import BaseCommand, CommandError
from messaging.viber_init import unset_webhook

class Command(BaseCommand):
    help = 'Unsetting webhook'

    def handle(self, *args, **options):
        unset_webhook()
