from django.conf import settings
from viberbot import Api
from viberbot.api.bot_configuration import BotConfiguration

# Viber authentification

VIBER_AUTH_TOKEN = '4aad892000a7d6f9-80aecfcf7028b55f-39b5e6f03ba8a278'
VIBER_BOT_NAME = 'PythonSampleBot'
VIBER_AVATAR = 'https://bnbkeepers.com/assets/uploads/pic1-1490178768.jpg'

# Set Viber bot configuration
BOT_CONFIGURATION = BotConfiguration(
    name=VIBER_BOT_NAME,
    avatar=VIBER_AVATAR,
    auth_token=VIBER_AUTH_TOKEN
)
VIBER = Api(BOT_CONFIGURATION)

def set_webhook():
    VIBER.set_webhook('https://appart.itel.rv.ua/webhook/:443')

def unset_webhook():
    VIBER.unset_webhook()
