import logging
from django.conf import settings
from viberbot import Api
from viberbot.api.bot_configuration import BotConfiguration


# Set Viber bot configuration
bot_configuration = BotConfiguration(
    name=settings.VIBER_BOT_NAME,
    avatar=settings.VIBER_AVATAR,
    auth_token=settings.VIBER_AUTH_TOKEN
)
viber = Api(bot_configuration)

# Get an instance of a logger
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


def set_webhook(url):
    logger.debug('Setting webhook')
    viber.set_webhook(url + ':443/webhook/')


def unset_webhook():
    logger.debug('Unsetting webhook')
    viber.unset_webhook()
