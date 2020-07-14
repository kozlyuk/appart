""" Business logic for payments app """
from condominium.models import Apartment
from payments.models import Bill, BillLine, Service


def make_previous_bill_inactive(apartment, service, period):
    """make old bills of apartment inactive

    Args:
        apartment (object): apartment object
        service (service): Service.UOM_CHOICES
    """
    prev_bills = Bill.objects.filter(apartment=apartment,
                                     service__in=service)
    # deletes current month bills
    prev_bills.filter(period=period).delete()
    # makes inactive previous month bills
    prev_bills.filter(is_active=True).update(is_active=False)


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
        make_previous_bill_inactive(apartment, services, period)
        # create new bill or update existing bill
        bill = Bill.objects.create(apartment=apartment,
                                   period=period,
                                   number= apartment.bill_number_generate(period),
                                   is_active= True)
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
