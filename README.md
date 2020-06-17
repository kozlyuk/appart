# [Appart](https://dimonline.pp.ua/) &middot; 
![GitHub license](https://img.shields.io/badge/license-MIT-green.svg) 
![npm version](https://img.shields.io/npm/v/react.svg?style=flat)
[![made-with-python](https://img.shields.io/badge/Made%20with-Python-1f425f.svg)](https://www.python.org/)
[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

Automation system for apartments buildings.

![Docker](https://github.com/kozlyuk/appart/workflows/Docker/badge.svg)

## Installing
1. install Python3
2. create virtual env ``` python3 -m venv /path/to/new/virtual/environment```
3. activate venv ``` source venv/bin/activate```
4. install dependencies ``` pip install -r requirements.txt ```
5. in folder planner create ```settings_local.py``` file
<p align="center"> content settings_local.py </p>

```python
SECRET_KEY = ''
DEBUG = True
ALLOWED_HOSTS = ['*']
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

INSTALLED_APPS = []

# Viber related settings
VIBER_AUTH_TOKEN = ''
VIBER_BOT_NAME = 'PythonSampleBot'
VIBER_AVATAR = ''
```
