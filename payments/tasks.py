from __future__ import absolute_import, unicode_literals

from celery.utils.log import get_task_logger
from appart.celery import app

from condominium.models import Apartment
from payments.models import Bill, BillLine, Service
from payments.services import bill_number_generate, debt_for_service, debt_for_month

logger = get_task_logger(__name__)


@app.task
def create_area_bills(date):
    """ create bills by area of apartments """

    # filter active apartments
    apartments = Apartment.objects.filter(is_active=True)

    # filter ByArea services
    services = Service.objects.filter(uom_type=Service.ByArea)

    # create bill for every apartments
    for apartment in apartments:
        bill = Bill.objects.create(apartment=apartment,
                                   number=bill_number_generate(apartment, bill_date),
                                   date=date)
        # create bill_line for every service
        for service in services:
            BillLine.create(bill=bill,
                            service=service,
                            previous_debt=debt_for_service(apartment, service, date),
                            value=debt_for_month(apartment, service))
