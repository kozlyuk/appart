from django.utils.translation import ugettext_lazy as _
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


# class RegisteredResidents(views.APIView):
#     """
#     Get count of active apartments
#     """
#     queryset = User.objects.none()

#     def get(self, request):
#         # calculate bills sum for appartment
#         bills_sum = Bill.filter(is_active=True) \
#                             .aggregate(bills_sum=Sum('total_value')) \
#                             ['bills_sum'] or 0

#     def total_payments_sum(self):
#         """ return payments sum for appartment """
#         return self.payment_set.aggregate(payments_sum=Sum('value')) \
#                                 ['payments_sum'] or 0
#         json_data = {}
#         json_data["label"] = _("Registered Residents")
#         json_data["data"] = User.objects.filter(is_registered=True,
#                                                 groups__name='Резиденти') \
#                                         .count()
#         return Response(json_data, status=status.HTTP_200_OK)
