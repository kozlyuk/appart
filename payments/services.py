""" Business logic for payments app """
from datetime import date

from condominium.models import Apartment
from payments.models import Bill, BillLine, Service


def last_day_of_month(any_day):
    # reurl last day for given month
    next_month = any_day.replace(day=28) + date.timedelta(days=4)
    return next_month - date.timedelta(days=next_month.day)


def create_area_bills(house, period):
    """create bills by area of apartments

    Args:
        house (int): house pk
        period (str): date in iso format

    Returns:
        int: count of created bills
    """
    # set first day of month
    period = period.replace(day=1)

    # filter apartments
    apartments = Apartment.objects.filter(is_active=True,
                                          house__pk=house)

    # filter ByArea services
    services = Service.objects.filter(uom_type=Service.ByArea)

    # create bill for every apartments
    for apartment in apartments:
        # make old bills not active
        bill_lines = BillLine.objects.filter(bill__apartment=apartment,
                                             service__uom_type=Service.ByArea,
                                             is_active=True)
        for line in bill_lines:
            if line.bill.period != date.today().month.replace(day=1):
                line.bill.is_active = False
                line.bill.save()
            # else:
            #     line


        # create new bill or update existing bill
        bill = Bill.objects.get(apartment=apartment,
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
