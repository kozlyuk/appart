import pytest
import test_helpers

from django.urls import reverse
from django.test import Client


pytestmark = [pytest.mark.django_db]


def tests_User_list_view():
    instance1 = test_helpers.create_accounts_User()
    instance2 = test_helpers.create_accounts_User()
    client = Client()
    url = reverse("accounts_User_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_User_create_view():
    client = Client()
    url = reverse("accounts_User_create")
    data = {
        "avatar": "anImage",
        "birth_date": datetime.now(),
        "theme": "text",
        "mobile_number": "text",
        "email": "user@tempurl.com",
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_User_detail_view():
    client = Client()
    instance = test_helpers.create_accounts_User()
    url = reverse("accounts_User_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_User_update_view():
    client = Client()
    instance = test_helpers.create_accounts_User()
    url = reverse("accounts_User_update", args=[instance.pk, ])
    data = {
        "avatar": "anImage",
        "birth_date": datetime.now(),
        "theme": "text",
        "mobile_number": "text",
        "email": "user@tempurl.com",
    }
    response = client.post(url, data)
    assert response.status_code == 302
