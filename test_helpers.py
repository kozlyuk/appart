import random
import string

from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType
from datetime import datetime

from condominium import models as condominium_models
from payments import models as payments_models
from notice import models as notice_models
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
def create_payments_Payment(**kwargs):
    defaults = {}
    defaults["date_updated"] = datetime.now()
    defaults["type"] = ""
    defaults["amount"] = ""
    defaults["description"] = ""
    defaults["date"] = datetime.now()
    defaults["action"] = ""
    if "bill" not in kwargs:
        defaults["bill"] = create_payments_Bill()
    defaults.update(**kwargs)
    return payments_models.Payment.objects.create(**defaults)
def create_payments_Bill(**kwargs):
    defaults = {}
    defaults["amount"] = ""
    defaults["number"] = ""
    defaults["date_updated"] = datetime.now()
    defaults["pdf_copy"] = ""
    defaults["date"] = datetime.now()
    if "apartment" not in kwargs:
        defaults["apartment"] = create_condominium_Apartment()
    if "service" not in kwargs:
        defaults["service"] = create_payments_Service()
    defaults.update(**kwargs)
    return payments_models.Bill.objects.create(**defaults)
def create_payments_BillPayment(**kwargs):
    defaults = {}
    defaults["amount"] = ""
    if "bill" not in kwargs:
        defaults["bill"] = create_payments_Bill()
    if "payment" not in kwargs:
        defaults["payment"] = create_payments_Payment()
    defaults.update(**kwargs)
    return payments_models.BillPayment.objects.create(**defaults)
def create_payments_Service(**kwargs):
    defaults = {}
    defaults["description"] = ""
    defaults["name"] = ""
    defaults.update(**kwargs)
    return payments_models.Service.objects.create(**defaults)
def create_notice_Choice(**kwargs):
    defaults = {}
    defaults["votes"] = ""
    defaults["choice_text"] = ""
    if "user" not in kwargs:
        defaults["user"] = create_User()
    if "question" not in kwargs:
        defaults["question"] = create_Question()
    defaults.update(**kwargs)
    return notice_models.Choice.objects.create(**defaults)
def create_notice_Notice(**kwargs):
    defaults = {}
    defaults["actual_to"] = datetime.now()
    defaults["actual_from"] = datetime.now()
    defaults["picture"] = ""
    defaults["title"] = ""
    defaults["notice_type"] = ""
    defaults["date_updated"] = datetime.now()
    defaults["date_created"] = datetime.now()
    defaults["text"] = ""
    if "apartment" not in kwargs:
        defaults["apartment"] = create_model_Apartment()
    if "created_by" not in kwargs:
        defaults["created_by"] = create_User()
    if "house" not in kwargs:
        defaults["house"] = create_model_House()
    defaults.update(**kwargs)
    return notice_models.Notice.objects.create(**defaults)
def create_notice_Question(**kwargs):
    defaults = {}
    defaults["actual_from"] = datetime.now()
    defaults["actual_to"] = datetime.now()
    defaults["question_text"] = ""
    defaults["date_updated"] = datetime.now()
    defaults["date_created"] = datetime.now()
    if "created_by" not in kwargs:
        defaults["created_by"] = create_User()
    defaults.update(**kwargs)
    return notice_models.Question.objects.create(**defaults)
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
