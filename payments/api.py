from datetime import datetime
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.db.models import Q, Sum
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from liqpay import LiqPay

from payments import serializers
from payments.models import Bill, BillLine, Payment, Service, Rate, PaymentService
from condominium.models import Apartment

from notice.models import News

class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Service class"""

    serializer_class = serializers.ServiceSerializer
    queryset = Service.objects.all()


class ServiceWithoutPagination(ServiceViewSet):
    """ViewSet for the Service class
    Without pagination
    """
    pagination_class = None


class RateViewSet(viewsets.ModelViewSet):
    """ViewSet for the Rate class
    Filter queryset by house field ('house' get parameter)
    Filter queryset by service field ('service' get parameter)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = serializers.RateSerializer

    def get_queryset(self):
        queryset = Rate.objects.all()
        house = self.request.GET.get('house')
        service = self.request.GET.get('service')
        order = self.request.GET.get('order')
        if house:
            queryset = queryset.filter(house=house)
        if service:
            queryset = queryset.filter(service=service)
        if order:
            queryset = queryset.order_by(order)
        return queryset


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Payment class
    Filter queryset by search string ('filter' get parameter)
    Filter queryset by house field ('house' get parameter)
    Filter queryset by apartment field ('apartment' get parameter)
    Filter queryset by service field ('service' get parameter)
    Filter queryset by payment_type field ('payment_type' get parameter)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = serializers.PaymentSerializer

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


class PaymentServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the PaymentService class"""

    serializer_class = serializers.PaymentServiceSerializer
    pagination_class = None
    def get_queryset(self):
        return PaymentService.objects.filter(payment=self.kwargs['payment_pk'])


class PaymentTypeChoices(APIView):
    """
    Send JSON list of PAYMENT_TYPE_CHOICES
    """
    queryset = Payment.objects.none()

    def get(self, request):
        # Sending JSON list PAYMENT_TYPE_CHOICES
        json_data = Payment.PAYMENT_TYPE_CHOICES
        return Response(json_data, status=status.HTTP_200_OK)


class BillViewSet(viewsets.ModelViewSet):
    """ViewSet for the Bill class
    Filter queryset by search string ('filter' get parameter)
    Filter queryset by house field ('house' get parameter)
    Filter queryset by apartment field ('apartment' get parameter)
    Filter queryset by service field ('service' get parameter)
    Filter queryset by is_active field ('is_active' get parameter)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = serializers.BillSerializer

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


class BillLineViewSet(viewsets.ModelViewSet):
    """ViewSet for the BillLine class"""

    serializer_class = serializers.BillLineSerializer
    pagination_class = None
    def get_queryset(self):
        return BillLine.objects.filter(bill=self.kwargs['bill_pk'])


class GetTotalDebt(APIView):
    """
    Return total debt for given apartment

    * Only apartment owner has permission to view.
    * Return error HTTP_400_BAD_REQUEST if apartment does not exist.
    """
    queryset = Apartment.objects.none()

    def get(self, request, apartment: int):
        apartment_pk = self.kwargs['apartment']
        # get the apartment
        try:
            apartment = Apartment.objects.get(pk=apartment_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Apartment.DoesNotExist:
            return Response(_('Apartment with such id does not exist'), status=status.HTTP_400_BAD_REQUEST)

        # return total_debt from apartment
        return Response(apartment.current_total_debt(), status=status.HTTP_200_OK)


class PayView(APIView):
    """
    Prepare data for Payment Widget

    * Get bill pk from URL parameter.
    * Return JSON with "data" and "signature"
    * Return error HTTP_400_BAD_REQUEST if bill does not exist.
    """
    queryset = Payment.objects.none()

    def get(self, request, bill: int):
        bill_pk = self.kwargs['bill']
        # get the apartment
        try:
            bill = Bill.objects.get(pk=bill_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Bill.DoesNotExist:
            return Response(_('Bill with such id does not exist'), status=status.HTTP_400_BAD_REQUEST)

        # prepearing Liqpay data
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
    queryset = Payment.objects.none()

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
