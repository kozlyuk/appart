import random
import string

from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from datetime import datetime

from condominium import models as condominium_models
from accounts import models as accounts_models


def random_string(length=10):
    # Create a random string of length length
    letters = string.ascii_lowercase
    return "".join(random.choice(letters) for i in range(length))


def create_User(**kwargs):
    defaults = {
        "username": "%s_username" % random_string(5),
        "email": "%s_username@tempurl.com" % random_string(5),
    }
    defaults.update(**kwargs)
    return User.objects.create(**defaults)


def create_AbstractUser(**kwargs):
    defaults = {
        "username": "%s_username" % random_string(5),
        "email": "%s_username@tempurl.com" % random_string(5),
    }
    defaults.update(**kwargs)
    return AbstractUser.objects.create(**defaults)


def create_AbstractBaseUser(**kwargs):
    defaults = {
        "username": "%s_username" % random_string(5),
        "email": "%s_username@tempurl.com" % random_string(5),
    }
    defaults.update(**kwargs)
    return AbstractBaseUser.objects.create(**defaults)


def create_Group(**kwargs):
    defaults = {
        "name": "%s_group" % random_string(5),
    }
    defaults.update(**kwargs)
    return Group.objects.create(**defaults)


def create_ContentType(**kwargs):
    defaults = {
    }
    defaults.update(**kwargs)
    return ContentType.objects.create(**defaults)


def create_condominium_Apartment(**kwargs):
    defaults = {}
    defaults["description"] = ""
    defaults["area"] = ""
    defaults["residents_count"] = ""
    if "house" not in kwargs:
        defaults["house"] = create_condominium_House()
    if "resident" not in kwargs:
        defaults["resident"] = create_AbstractBaseUser()
    defaults.update(**kwargs)
    return condominium_models.Apartment.objects.create(**defaults)
def create_condominium_House(**kwargs):
    defaults = {}
    defaults["description"] = ""
    defaults["address"] = ""
    defaults["name"] = ""
    defaults["logo"] = ""
    if "company" not in kwargs:
        defaults["company"] = create_condominium_Company()
    defaults.update(**kwargs)
    return condominium_models.House.objects.create(**defaults)
def create_condominium_Company(**kwargs):
    defaults = {}
    defaults["fullname"] = ""
    defaults["chief"] = ""
    defaults["logo"] = ""
    defaults["name"] = ""
    defaults["phone"] = ""
    defaults["address"] = ""
    defaults["description"] = ""
    defaults["bank_requisites"] = ""
    defaults["requisites"] = ""
    defaults.update(**kwargs)
    return condominium_models.Company.objects.create(**defaults)
def create_accounts_User(**kwargs):
    defaults = {}
    defaults["avatar"] = ""
    defaults["birth_date"] = datetime.now()
    defaults["theme"] = ""
    defaults["mobile_number"] = ""
    defaults["email"] = ""
    defaults["username"] = "username"
    defaults["email"] = "username@tempurl.com"
    defaults.update(**kwargs)
    return accounts_models.User.objects.create(**defaults)
