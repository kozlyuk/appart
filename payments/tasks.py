from __future__ import absolute_import, unicode_literals

from celery.utils.log import get_task_logger
from appart.celery import app

from condominium.models import Apartment
from payments.models import Bill, BillLine, Service

logger = get_task_logger(__name__)


@app.task
def create_area_bills(house, period, is_active):
    """ create bills by area of apartments """

    # filter apartments
    apartments = Apartment.objects.filter(is_active=is_active,
                                          house__pk=house)

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
                                    previous_debt=service.previous_debt(apartment, period),
                                    value=service.debt_for_month(apartment, period))
        # calculate total_value for Bill
        bill.total_value = bill.calc_total_value()
        bill.save()

    return apartments.count()
