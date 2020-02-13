from django.core.exceptions import PermissionDenied

from django.apps import apps


def bulk_create_apartments(house):
    """ create appartments in range from 1 to apartments_count """
    Apartment = apps.get_model('condominium.Apartment')
    for number in range(house.apartments_count):
        Apartment.objects.create(house=house, number=number+1)
