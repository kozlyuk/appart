"""
Django settings for appart project.
"""
import os
from django.utils.translation import ugettext_lazy as _


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR_JINJA = os.path.dirname(__file__)
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG") == 'TRUE'

SITE_URL = os.environ.get("SITE_URL")
FRONT_SITE_URL = os.environ.get("FRONT_SITE_URL")

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'accounts.apps.AccountsConfig',
    'condominium.apps.CondominiumConfig',
    'payments.apps.PaymentsConfig',
    'messaging.apps.MessagingConfig',
    'notice.apps.NoticeConfig',
    'pages.apps.PagesConfig',
    'dimservice.apps.DimserviceConfig',
    'analytics.apps.AnalyticsConfig',
    'templatetags',
    'bootstrap4',
    'six',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'corsheaders',
    'font_awesome',
    'widget_tweaks',
    'django_celery_results',
    'django_rest_passwordreset',
]

if DEBUG:
    INSTALLED_APPS += ['silk',
                       #'django_extensions'
                       ]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'django.middleware.locale.LocaleMiddleware',
    'silk.middleware.SilkyMiddleware',
]

ROOT_URLCONF = 'appart.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'DIRS': [],
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'libraries':{
                'ita_template_tags': 'templatetags.ita_template_tags',
            },
        }
    },
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'APP_DIRS': True,
        'DIRS' : [
            os.path.join(BASE_DIR_JINJA, 'jinja2'),
        ],
        'OPTIONS': {
            'autoescape': True,
            'environment': 'appart.jinja_enviroment.environment',
            'extensions' : [
                'jinja2.ext.i18n',
                'jinja2.ext.with_',
                'jinja2.ext.autoescape'
            ],
        },
    },
]

WSGI_APPLICATION = 'appart.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get("DB_NAME"),
        'USER': os.environ.get("DB_USER"),
        'PASSWORD': os.environ.get("DB_PASSWORD"),
        'HOST': os.environ.get("DB_HOST"),
        'PORT': os.environ.get("DB_PORT"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 6,
        }
    },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]

AUTH_USER_MODEL = 'accounts.User'
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'

# CORS settings
CORS_ORIGIN_ALLOW_ALL = os.environ.get("CORS_ORIGIN_ALLOW_ALL") == 'TRUE'
CORS_ORIGIN_WHITELIST = os.environ.get("CORS_ORIGIN_WHITELIST").split(" ")
CORS_ALLOW_HEADERS = os.environ.get("CORS_ALLOW_HEADERS").split(" ")

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        #'rest_framework.authentication.SessionAuthentication', #need to disable
        # 'rest_framework.authentication.BasicAuthentication', #need to disable
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.DjangoModelPermissions',
    ),
    'DEFAULT_PAGINATION_CLASS': 'appart.drf_defaults.DefaultResultsSetPagination',
    'DATE_FORMAT': "%Y-%m-%d",
    'DATETIME_FORMAT': "%Y-%m-%d",
}

REST_AUTH_SERIALIZERS = {
    'LOGIN_SERIALIZER': 'accounts.serializers.CustomLoginSerializer',
}

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'uk'
TIME_ZONE = 'Europe/Kiev'
USE_I18N = True
USE_L10N = True
USE_TZ = False
LANGUAGES = [
    ('uk', _('Ukrainian')),
    ('en-us', _('English')),
]
LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, "static"),
# ]
STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATIC_URL = '/back_static/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = '/media/'

# REDIS and CELERY related settings
CELERY_BROKER_URL = os.environ.get("REDIS_SERVER")
CELERY_RESULT_BACKEND = os.environ.get("REDIS_SERVER")
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
CELERY_RESULT_BACKEND = 'django-db'

# VARIABLES
CURRENCY = 'грн.'

# Email related settings
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS") == 'TRUE'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_PORT = os.environ.get("EMAIL_PORT")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL")

# SMS related settings
SMS_SERVER_URL = os.environ.get("SMS_SERVER_URL")
SMS_TOKEN = os.environ.get("SMS_TOKEN")
SMS_SENDER = os.environ.get("SMS_SENDER")
OTP_SECRET = os.environ.get("OTP_SECRET")

# Viber related settings
VIBER_AUTH_TOKEN = os.environ.get("VIBER_AUTH_TOKEN")
VIBER_BOT_NAME = os.environ.get("VIBER_BOT_NAME")
VIBER_AVATAR = os.environ.get("VIBER_AVATAR")

# LIQPAY related settings
# REQUIRED:
# Public_key - the identifier of the created company. For example: i00000000
LIQPAY_PUBLIC_KEY = os.environ.get("LIQPAY_PUBLIC_KEY")
# Private key of the created company (not available to anyone except your developer).
# For example: a4825234f4bae72a0be04eafe9e8e2bada209255
LIQPAY_PRIVATE_KEY = os.environ.get("LIQPAY_PRIVATE_KEY")
# OPTIONAL:
# Payment currency. Example value: USD, EUR, RUB, UAH, BYN, KZT.
# Additional currencies can be added by company's request.
# Default: UAH
LIQPAY_DEFAULT_CURRENCY = os.environ.get("LIQPAY_DEFAULT_CURRENCY")
# Language code
# Default: uk
LIQPAY_DEFAULT_LANGUAGE = os.environ.get("LIQPAY_DEFAULT_LANGUAGE")
# Transaction type. Possible values: pay - payment, hold - amount of hold on sender's account,
# subscribe - regular payment, paydonate - donation, auth - card preauth
# Default: pay
LIQPAY_DEFAULT_ACTION = os.environ.get("LIQPAY_DEFAULT_ACTION")
