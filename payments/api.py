from django.utils.translation import gettext_lazy as _
from django.db.models import Sum
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.serializers import ValidationError
from rest_framework.response import Response
from rest_framework import status

from payments.serializers import BillSerializer
from payments.models import Bill
from condominium.models import Apartment


class BillListView(ListAPIView):
    """
    View all active bills of apartment.

    * Requires parameters: apartment.
    * Only apartment owner has permission to bills.
    * Return error HTTP_400_BAD_REQUEST if apartment does not exist
    """

    serializer_class = BillSerializer
    paginate_by = 100

    def get_queryset(self):
        apartment_pk = self.kwargs['apartment']
        # get the apartment
        try:
            apartment = Apartment.objects.get(pk=apartment_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Apartment.DoesNotExist:
            raise ValidationError({"error": [_('Apartment with such id does not exist')]})
        # get bills for apartment
        queryset = apartment.bill_set.filter(is_active=True)
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset.order_by('period')


class GetTotalDebt(APIView):
    """
    View to list all users in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """

    def get(self, request, apartment: int):
        apartment_pk = self.kwargs['apartment']
        # get the apartment
        try:
            apartment = Apartment.objects.get(pk=apartment_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Apartment.DoesNotExist:
            return Response(_('Apartment with such id does not exist'), status=status.HTTP_400_BAD_REQUEST)

        #
        total_debt = apartment.bill_set.filter(is_active=True).aggregate(total_debt=Sum('total_value')) \
                                                                         ['total_debt'] or 0
        return Response(total_debt, status=status.HTTP_200_OK)
