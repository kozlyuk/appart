""" Business logic for condominium app """
from datetime import timedelta
from django.apps import apps


def last_day_of_month(any_day):
    # reurl last day for given month
    next_month = any_day.replace(day=28) + timedelta(days=4)
    return next_month - timedelta(days=next_month.day)


def is_int(element):
    try:
        int(element)
        return True
    except ValueError:
        return False
