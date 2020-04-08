from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.serializers import ValidationError
from rest_framework.response import Response
from rest_framework import status, permissions
from liqpay import LiqPay

from payments.serializers import BillSerializer, PaymentSerializer
from payments.models import Bill, Payment
from condominium.models import Apartment

from notice.models import News

class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Payment class"""

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class BillViewSet(viewsets.ModelViewSet):
    """ViewSet for the Payment class"""

    queryset = Bill.objects.all()
    serializer_class = BillSerializer


class GetTotalDebt(APIView):
    """
    Return total debt for given apartment

    * Only apartment owner has permission to view.
    * Return error HTTP_400_BAD_REQUEST if apartment does not exist.
    """

    def get(self, request, apartment: int):
        apartment_pk = self.kwargs['apartment']
        # get the apartment
        try:
            apartment = Apartment.objects.get(pk=apartment_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Apartment.DoesNotExist:
            return Response(_('Apartment with such id does not exist'), status=status.HTTP_400_BAD_REQUEST)

        # aggregate total_debt from bills
        total_debt = apartment.bill_set.filter(is_active=True) \
                                       .aggregate(total_debt=Sum('total_value')) \
                                       ['total_debt'] or 0
        return Response(total_debt, status=status.HTTP_200_OK)


class BillListView(ListAPIView):
    """
    View all active bills of apartment.

    * Requires parameters: apartment.
    * Only apartment owner has permission to bills.
    * Return error HTTP_400_BAD_REQUEST if apartment does not exist
    """

    serializer_class = BillSerializer

    def get_queryset(self):
        apartment_pk = self.kwargs['apartment']
        # get the apartment
        try:
            apartment = Apartment.objects.get(pk=apartment_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Apartment.DoesNotExist:
            raise ValidationError({_('error'): [_('Apartment with such id does not exist')]})
        # get bills for apartment
        queryset = apartment.bill_set.filter(is_active=True)

        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset.order_by('period')


class PaymentsListView(ListAPIView):
    """
    View all payments for apartment.

    * Requires parameters: apartment.
    * Only apartment owner has permission to payments.
    * Return error HTTP_400_BAD_REQUEST if apartment does not exist
    """

    serializer_class = PaymentSerializer

    def get_queryset(self):
        apartment_pk = self.kwargs['apartment']
        # get the apartment
        try:
            apartment = Apartment.objects.get(pk=apartment_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Apartment.DoesNotExist:
            raise ValidationError({_('error'): [_('Apartment with such id does not exist')]})
        # get bills for apartment
        queryset = apartment.payment_set.all()

        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset.order_by('date')


class PayView(APIView):
    """
    Prepare data for Payment Widget

    * Get bill pk from URL parameter.
    * Return JSON with "data" and "signature"
    * Return error HTTP_400_BAD_REQUEST if bill does not exist.
    """

    def get(self, request, bill: int):
        bill_pk = self.kwargs['bill']
        # get the apartment
        try:
            bill = Bill.objects.get(pk=bill_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Bill.DoesNotExist:
            return Response(_('Bill with such id does not exist'), status=status.HTTP_400_BAD_REQUEST)

        # aggregate total_debt from bills
        liqpay = LiqPay(settings.LIQPAY_PUBLIC_KEY, settings.LIQPAY_PRIVATE_KEY)
        params = {
            'action': settings.LIQPAY_DEFAULT_ACTION,
            'currency': settings.LIQPAY_DEFAULT_CURRENCY,
            'language': settings.LIQPAY_DEFAULT_LANGUAGE,
            'amount': str(bill.total_value),
            'description': f'Payment for bill {bill.number}',
            'order_id': bill_pk,
            'version': '3',
            'sandbox': 1, # sandbox mode, set to 1 to enable it
            'server_url': 'https://dimonline.pp.ua:8443/payments/api/v1/pay_callback/', # url to callback view
        }
        signature = liqpay.cnb_signature(params)
        data = liqpay.cnb_data(params)

        return Response({'signature': signature, 'data': data}, status=status.HTTP_200_OK)


class PayCallbackView(APIView):
    """
    Receice callback from bank and create payment

    * Get bill pk from URL parameter.
    * Return JSON with "data" and "signature"
    * Return error HTTP_400_BAD_REQUEST if bill does not exist.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        liqpay = LiqPay(settings.LIQPAY_PUBLIC_KEY, settings.LIQPAY_PRIVATE_KEY)
        data = request.POST.get('data')
        signature = request.POST.get('signature')
        if not data or not signature:
            return Response({'POST data is not provided'},
                            status=status.HTTP_412_PRECONDITION_FAILED)
        sign = liqpay.str_to_sign(settings.LIQPAY_PRIVATE_KEY + data + settings.LIQPAY_PRIVATE_KEY)
        if sign == signature:
            response = liqpay.decode_data_from_str(data)

            News.objects.create(title="Success Payment", text=response)
#            Payment.objects.create()
            return Response({'check': 'callback is valid'},
                            status=status.HTTP_200_OK)
        else:
            News.objects.create(title="Failed payment", text=data+' '+signature)
            return Response({'check': 'callback is not valid'},
                            status=status.HTTP_412_PRECONDITION_FAILED)
