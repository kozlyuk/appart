from __future__ import absolute_import, unicode_literals

from celery.utils.log import get_task_logger
from appart.celery import app

from condominium.models import Apartment
from payments.models import Bill, BillLine, Service
from payments.services import debt_for_service, debt_for_month

logger = get_task_logger(__name__)


@app.task
def create_area_bills(period):
    """ create bills by area of apartments """

    # filter active apartments
    apartments = Apartment.objects.filter(is_active=True)

    # filter ByArea services
    services = Service.objects.filter(uom_type=Service.ByArea)

    # create bill for every apartments
    for apartment in apartments:
        bill = Bill.objects.create(apartment=apartment,
                                   number=apartment.bill_number_generate(period),
                                   period=period)
        # create bill_line for every service
        for service in services:
            BillLine.objects.create(bill=bill,
                            service=service,
                            previous_debt=debt_for_service(apartment, service, period),
                            value=debt_for_month(apartment, service))
        # calculate total_value for Bill
        bill.total_value = bill.calc_total_value()
        bill.save()
