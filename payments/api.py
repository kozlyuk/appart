from datetime import datetime
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.db.models import Q, Sum
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from liqpay import LiqPay

from payments.serializers import BillSerializer, PaymentSerializer, \
                                 ServiceSerializer, RateSerializer
from payments.models import Bill, Payment, Service, Rate
from condominium.models import Apartment

from notice.models import News

class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Service class"""

    serializer_class = ServiceSerializer
    queryset = Service.objects.all()


class RateViewSet(viewsets.ModelViewSet):
    """ViewSet for the Rate class"""

    serializer_class = RateSerializer
    queryset = Rate.objects.all()


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Payment class
    Filter queryset by search string ('filter' get parameter)
    Filter queryset by house field ('house' get parameter)
    Filter queryset by apartment field ('apartment' get parameter)
    Filter queryset by service field ('service' get parameter)
    Filter queryset by payment_type field ('payment_type' get parameter)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = PaymentSerializer

    def get_queryset(self):
        queryset = Payment.objects.all()
        search_string = self.request.GET.get('filter', '').split()
        house = self.request.GET.get('house')
        apartment = self.request.GET.get('apartment')
        service = self.request.GET.get('service')
        payment_type = self.request.GET.getlist('payment_type')
        order = self.request.GET.get('order')
        for word in search_string:
            queryset = queryset.filter(Q(description__icontains=word) |
                                       Q(apartment__account_number__contains=word) |
                                       Q(apartment__number__contains=word))

        if house:
            queryset = queryset.filter(apartment__house=house)
        if apartment:
            queryset = queryset.filter(apartment=apartment)
        if service:
            queryset = queryset.filter(service=service)
        if payment_type:
            qs_union = Payment.objects.none()
            for payment in payment_type:
                qs_segment = queryset.filter(payment_type=payment)
                qs_union = qs_union | qs_segment
            queryset = qs_union
        if order:
            queryset = queryset.order_by(order)

        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset


class BillViewSet(viewsets.ModelViewSet):
    """ViewSet for the Bill class
    Filter queryset by search string ('filter' get parameter)
    Filter queryset by house field ('house' get parameter)
    Filter queryset by apartment field ('apartment' get parameter)
    Filter queryset by service field ('service' get parameter)
    Filter queryset by is_active field ('is_active' get parameter)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = BillSerializer

    def get_queryset(self):
        queryset = Bill.objects.all()
        search_string = self.request.GET.get('filter', '').split()
        house = self.request.GET.get('house')
        apartment = self.request.GET.get('apartment')
        service = self.request.GET.get('service')
        is_active = not self.request.GET.get('is_active') == "false"
        order = self.request.GET.get('order')
        for word in search_string:
            queryset = queryset.filter(Q(number__contains=word) |
                                       Q(apartment__number__contains=word) |
                                       Q(apartment__account_number__contains=word))

        if house:
            queryset = queryset.filter(apartment__house=house)
        if apartment:
            queryset = queryset.filter(apartment=apartment)
        if service:
            queryset = queryset.filter(service=service)
        if is_active:
            queryset = queryset.filter(is_active=True)
        if order:
            queryset = queryset.order_by(order)

        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset


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
            end_date = datetime.fromtimestamp(int(response['end_date']) / 1e3)

            Payment.objects.create(payment_type=Payment.LiqPay,
                                   date=end_date,
                                   value=response['amount'],
                                   description=response['description'],
                                   liqpay_responce=response)
            return Response({'check': 'callback is valid'},
                            status=status.HTTP_200_OK)
        else:
            News.objects.create(title="Failed payment", text=data+' '+signature)
            return Response({'check': 'callback is not valid'},
                            status=status.HTTP_412_PRECONDITION_FAILED)
