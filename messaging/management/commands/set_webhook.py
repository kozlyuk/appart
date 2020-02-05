from django.core.management.base import BaseCommand, CommandError
from messaging.viber_init import set_webhook

class Command(BaseCommand):
    help = 'Setting webhook'

    def add_arguments(self, parser):
        parser.add_argument('url', type=str)

    def handle(self, *args, **options):
        set_webhook(options['url'])
