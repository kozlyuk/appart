import pytest
import test_helpers

from django.urls import reverse
from django.test import Client


pytestmark = [pytest.mark.django_db]


def tests_Apartment_list_view():
    instance1 = test_helpers.create_condominium_Apartment()
    instance2 = test_helpers.create_condominium_Apartment()
    client = Client()
    url = reverse("condominium_Apartment_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_Apartment_create_view():
    house = test_helpers.create_condominium_House()
    resident = test_helpers.create_AbstractBaseUser()
    client = Client()
    url = reverse("condominium_Apartment_create")
    data = {
        "description": "text",
        "area": 1,
        "residents_count": 1,
        "house": house.pk,
        "resident": resident.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Apartment_detail_view():
    client = Client()
    instance = test_helpers.create_condominium_Apartment()
    url = reverse("condominium_Apartment_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_Apartment_update_view():
    house = test_helpers.create_condominium_House()
    resident = test_helpers.create_AbstractBaseUser()
    client = Client()
    instance = test_helpers.create_condominium_Apartment()
    url = reverse("condominium_Apartment_update", args=[instance.pk, ])
    data = {
        "description": "text",
        "area": 1,
        "residents_count": 1,
        "house": house.pk,
        "resident": resident.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_House_list_view():
    instance1 = test_helpers.create_condominium_House()
    instance2 = test_helpers.create_condominium_House()
    client = Client()
    url = reverse("condominium_House_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_House_create_view():
    company = test_helpers.create_condominium_Company()
    client = Client()
    url = reverse("condominium_House_create")
    data = {
        "description": "text",
        "apartments_count": 1,
        "address": "text",
        "name": "text",
        "logo": "anImage",
        "company": company.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_House_detail_view():
    client = Client()
    instance = test_helpers.create_condominium_House()
    url = reverse("condominium_House_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_House_update_view():
    company = test_helpers.create_condominium_Company()
    client = Client()
    instance = test_helpers.create_condominium_House()
    url = reverse("condominium_House_update", args=[instance.pk, ])
    data = {
        "description": "text",
        "apartments_count": 1,
        "address": "text",
        "name": "text",
        "logo": "anImage",
        "company": company.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Company_create_view():
    client = Client()
    url = reverse("condominium_Company_create")
    data = {
        "fullname": "text",
        "chief": "text",
        "logo": "anImage",
        "name": "text",
        "phone": "text",
        "address": "text",
        "description": "text",
        "bank_requisites": "text",
        "requisites": "text",
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Company_update_view():
    client = Client()
    instance = test_helpers.create_condominium_Company()
    url = reverse("condominium_Company_update", args=[instance.pk, ])
    data = {
        "fullname": "text",
        "chief": "text",
        "logo": "anImage",
        "name": "text",
        "phone": "text",
        "address": "text",
        "description": "text",
        "bank_requisites": "text",
        "requisites": "text",
    }
    response = client.post(url, data)
    assert response.status_code == 302
