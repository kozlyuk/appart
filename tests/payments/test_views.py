import pytest
import test_helpers

from django.urls import reverse
from django.test import Client


pytestmark = [pytest.mark.django_db]


def tests_Payment_list_view():
    instance1 = test_helpers.create_payments_Payment()
    instance2 = test_helpers.create_payments_Payment()
    client = Client()
    url = reverse("payments_Payment_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_Payment_create_view():
    bill = test_helpers.create_payments_Bill()
    client = Client()
    url = reverse("payments_Payment_create")
    data = {
        "date_updated": datetime.now(),
        "type": "text",
        "amount": 1.0,
        "description": "text",
        "date": datetime.now(),
        "action": "text",
        "bill": bill.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Payment_detail_view():
    client = Client()
    instance = test_helpers.create_payments_Payment()
    url = reverse("payments_Payment_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_Payment_update_view():
    bill = test_helpers.create_payments_Bill()
    client = Client()
    instance = test_helpers.create_payments_Payment()
    url = reverse("payments_Payment_update", args=[instance.pk, ])
    data = {
        "date_updated": datetime.now(),
        "type": "text",
        "amount": 1.0,
        "description": "text",
        "date": datetime.now(),
        "action": "text",
        "bill": bill.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Bill_list_view():
    instance1 = test_helpers.create_payments_Bill()
    instance2 = test_helpers.create_payments_Bill()
    client = Client()
    url = reverse("payments_Bill_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_Bill_create_view():
    apartment = test_helpers.create_condominium_Apartment()
    service = test_helpers.create_payments_Service()
    client = Client()
    url = reverse("payments_Bill_create")
    data = {
        "amount": 1.0,
        "number": "text",
        "date_updated": datetime.now(),
        "pdf_copy": undefined,
        "date": datetime.now(),
        "apartment": apartment.pk,
        "service": service.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Bill_detail_view():
    client = Client()
    instance = test_helpers.create_payments_Bill()
    url = reverse("payments_Bill_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_Bill_update_view():
    apartment = test_helpers.create_condominium_Apartment()
    service = test_helpers.create_payments_Service()
    client = Client()
    instance = test_helpers.create_payments_Bill()
    url = reverse("payments_Bill_update", args=[instance.pk, ])
    data = {
        "amount": 1.0,
        "number": "text",
        "date_updated": datetime.now(),
        "pdf_copy": undefined,
        "date": datetime.now(),
        "apartment": apartment.pk,
        "service": service.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_BillPayment_list_view():
    instance1 = test_helpers.create_payments_BillPayment()
    instance2 = test_helpers.create_payments_BillPayment()
    client = Client()
    url = reverse("payments_BillPayment_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_BillPayment_create_view():
    bill = test_helpers.create_payments_Bill()
    payment = test_helpers.create_payments_Payment()
    client = Client()
    url = reverse("payments_BillPayment_create")
    data = {
        "amount": 1.0,
        "bill": bill.pk,
        "payment": payment.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_BillPayment_detail_view():
    client = Client()
    instance = test_helpers.create_payments_BillPayment()
    url = reverse("payments_BillPayment_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_BillPayment_update_view():
    bill = test_helpers.create_payments_Bill()
    payment = test_helpers.create_payments_Payment()
    client = Client()
    instance = test_helpers.create_payments_BillPayment()
    url = reverse("payments_BillPayment_update", args=[instance.pk, ])
    data = {
        "amount": 1.0,
        "bill": bill.pk,
        "payment": payment.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Service_list_view():
    instance1 = test_helpers.create_payments_Service()
    instance2 = test_helpers.create_payments_Service()
    client = Client()
    url = reverse("payments_Service_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_Service_create_view():
    client = Client()
    url = reverse("payments_Service_create")
    data = {
        "description": "text",
        "name": "text",
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Service_detail_view():
    client = Client()
    instance = test_helpers.create_payments_Service()
    url = reverse("payments_Service_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_Service_update_view():
    client = Client()
    instance = test_helpers.create_payments_Service()
    url = reverse("payments_Service_update", args=[instance.pk, ])
    data = {
        "description": "text",
        "name": "text",
    }
    response = client.post(url, data)
    assert response.status_code == 302
