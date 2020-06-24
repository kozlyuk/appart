""" Business logic for condominium app """
from datetime import timedelta
from django.apps import apps


def bulk_create_apartments(house):
    """ create appartments in range from 1 to apartments_count """
    Apartment = apps.get_model('condominium.Apartment')
    for number in range(house.apartments_count):
        Apartment.objects.create(house=house, number=number+1)


def last_day_of_month(any_day):
    # reurl last day for given month
    next_month = any_day.replace(day=28) + timedelta(days=4)
    return next_month - timedelta(days=next_month.day)
