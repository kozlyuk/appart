""" Business logic for payments app """
from django.db.models import Sum

from payments.models import Bill, BillLine



def debt_for_month(apartment, service):
    """ return previous debt of apartment for service """

    return apartment.area * service.rate


def total_debt(apartment):          # TODO
    """ return previous debt of apartment for service """

    BillLine.objects.filter(field_name__isnull=True).aggregate(Sum('field_name'))

    return 0


def debt_for_service(apartment, service, period):          # TODO
    """ return previous debt of apartment for service """

    return 0
