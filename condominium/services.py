from django.core.exceptions import PermissionDenied

from django.apps import apps


def bulk_create_apartments(house):
    """ create appartments in range from 1 to apartments_count """
    Apartment = apps.get_model('condominium.Apartment')
    for number in range(house.apartments_count):
        apartment, created = Apartment.objects.get_or_create(house=house, number=number+1)
        if not created:
            raise PermissionDenied('Apartments already created')
