import pytest
import test_helpers

from django.urls import reverse
from django.test import Client


pytestmark = [pytest.mark.django_db]


def tests_Choice_list_view():
    instance1 = test_helpers.create_notice_Choice()
    instance2 = test_helpers.create_notice_Choice()
    client = Client()
    url = reverse("notice_Choice_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_Choice_create_view():
    user = test_helpers.create_User()
    question = test_helpers.create_Question()
    client = Client()
    url = reverse("notice_Choice_create")
    data = {
        "votes": 1,
        "choice_text": "text",
        "user": user.pk,
        "question": question.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Choice_detail_view():
    client = Client()
    instance = test_helpers.create_notice_Choice()
    url = reverse("notice_Choice_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_Choice_update_view():
    user = test_helpers.create_User()
    question = test_helpers.create_Question()
    client = Client()
    instance = test_helpers.create_notice_Choice()
    url = reverse("notice_Choice_update", args=[instance.pk, ])
    data = {
        "votes": 1,
        "choice_text": "text",
        "user": user.pk,
        "question": question.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Notice_list_view():
    instance1 = test_helpers.create_notice_Notice()
    instance2 = test_helpers.create_notice_Notice()
    client = Client()
    url = reverse("notice_Notice_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_Notice_create_view():
    apartment = test_helpers.create_model_Apartment()
    created_by = test_helpers.create_User()
    house = test_helpers.create_model_House()
    client = Client()
    url = reverse("notice_Notice_create")
    data = {
        "actual_to": datetime.now(),
        "actual_from": datetime.now(),
        "picture": "anImage",
        "title": "text",
        "notice_type": "text",
        "date_updated": datetime.now(),
        "date_created": datetime.now(),
        "text": "text",
        "apartment": apartment.pk,
        "created_by": created_by.pk,
        "house": house.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Notice_detail_view():
    client = Client()
    instance = test_helpers.create_notice_Notice()
    url = reverse("notice_Notice_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_Notice_update_view():
    apartment = test_helpers.create_model_Apartment()
    created_by = test_helpers.create_User()
    house = test_helpers.create_model_House()
    client = Client()
    instance = test_helpers.create_notice_Notice()
    url = reverse("notice_Notice_update", args=[instance.pk, ])
    data = {
        "actual_to": datetime.now(),
        "actual_from": datetime.now(),
        "picture": "anImage",
        "title": "text",
        "notice_type": "text",
        "date_updated": datetime.now(),
        "date_created": datetime.now(),
        "text": "text",
        "apartment": apartment.pk,
        "created_by": created_by.pk,
        "house": house.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Question_list_view():
    instance1 = test_helpers.create_notice_Question()
    instance2 = test_helpers.create_notice_Question()
    client = Client()
    url = reverse("notice_Question_list")
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance1) in response.content.decode("utf-8")
    assert str(instance2) in response.content.decode("utf-8")


def tests_Question_create_view():
    created_by = test_helpers.create_User()
    client = Client()
    url = reverse("notice_Question_create")
    data = {
        "actual_from": datetime.now(),
        "actual_to": datetime.now(),
        "question_text": "text",
        "date_updated": datetime.now(),
        "date_created": datetime.now(),
        "created_by": created_by.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302


def tests_Question_detail_view():
    client = Client()
    instance = test_helpers.create_notice_Question()
    url = reverse("notice_Question_detail", args=[instance.pk, ])
    response = client.get(url)
    assert response.status_code == 200
    assert str(instance) in response.content.decode("utf-8")


def tests_Question_update_view():
    created_by = test_helpers.create_User()
    client = Client()
    instance = test_helpers.create_notice_Question()
    url = reverse("notice_Question_update", args=[instance.pk, ])
    data = {
        "actual_from": datetime.now(),
        "actual_to": datetime.now(),
        "question_text": "text",
        "date_updated": datetime.now(),
        "date_created": datetime.now(),
        "created_by": created_by.pk,
    }
    response = client.post(url, data)
    assert response.status_code == 302
