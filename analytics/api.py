from datetime import date
from django.utils.translation import ugettext_lazy as _
from django.db.models import Sum
from rest_framework.response import Response
from rest_framework import views, status

from condominium.models import Apartment
from accounts.models import User
from payments.models import Bill, Payment


class ActiveApartments(views.APIView):
    """
    Get count of active apartments
    """
    queryset = Apartment.objects.none()

    def get(self, request):
        json_data = {}
        json_data["label"] = _("Active Apartments")
        json_data["data"] = Apartment.objects.filter(is_active=True) \
                                             .count()
        json_data["data_all"] = Apartment.objects.all() \
                                .count()
        return Response(json_data, status=status.HTTP_200_OK)


class RegisteredResidents(views.APIView):
    """
    Get count of registered residents
    """
    queryset = User.objects.none()

    def get(self, request):
        json_data = {}
        json_data["label"] = _("Registered Residents")
        json_data["data"] = User.objects.filter(is_registered=True,
                                                groups__name='Резиденти') \
                                        .count()
        json_data["data_all"] = User.objects.filter(groups__name='Резиденти') \
                                .count()

        return Response(json_data, status=status.HTTP_200_OK)


class TotalDebtCompany(views.APIView):
    """
    Get total debt of all apartments
    """
    queryset = Apartment.objects.none()

    def get(self, request):
        # calculate bills sum for all appartments
        bills_sum = Bill.objects.filter(is_active=True) \
                                .aggregate(bills_sum=Sum('total_value')) \
                                ['bills_sum'] or 0
        # calculate payments sum for all appartments
        paments_sum = Payment.objects.aggregate(payments_sum=Sum('value')) \
                                      ['payments_sum'] or 0

        json_data = {}
        json_data["label"] = _("Total Debt")
        json_data["data"] = bills_sum - paments_sum
        return Response(json_data, status=status.HTTP_200_OK)


class TotalPaymentsCompany(views.APIView):
    """
    Get total debt of all apartments
    """
    queryset = Apartment.objects.none()

    def get(self, request):
        # calculate payments sum for all appartments im current month
        paments_sum = Payment.objects.filter(date__month=date.today().month) \
                                     .aggregate(payments_sum=Sum('value')) \
                                      ['payments_sum'] or 0
        bills_sum = Bill.objects.filter(is_active=True) \
                        .aggregate(bills_sum=Sum('total_value')) \
                        ['bills_sum'] or 0

        json_data = {}
        json_data["label"] = _("Payment per month")
        json_data["data"] = paments_sum
        json_data["data_all"] = bills_sum
        return Response(json_data, status=status.HTTP_200_OK)
