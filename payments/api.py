from datetime import datetime, date
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.db.models import Q, Sum
from rest_framework import views, viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from liqpay import LiqPay

from payments import serializers
from payments.services import create_area_bills
from payments.utils import last_day_of_month
from payments.models import Bill, BillLine, Payment, Service, Rate, PaymentService
from notice.models import News


def payment_queryset_filter(request):
    """return queryset of payments filtered by get parameters in request"""
    # get all payments
    queryset = Payment.objects.all()
    # get parameters from request
    search_string = request.GET.get('filter', '').split()
    company = request.GET.get('company')
    houses = request.GET.getlist('house')
    apartment = request.GET.get('apartment')
    service = request.GET.get('service')
    payment_type = request.GET.getlist('payment_type')
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    is_recognized = request.GET.get('is_recognized')
    order = request.GET.get('order')
    # filtering queryset
    for word in search_string:
        queryset = queryset.filter(Q(description__icontains=word) |
                                   Q(apartment__account_number__contains=word) |
                                   Q(apartment__number__contains=word))
    if company:
        queryset = queryset.filter(Q(apartment__house__company=company) |
                                   Q(apartment__house__company__parent_company=company))
    if houses and houses[0]:
        qs_union = Payment.objects.none()
        for house in houses:
            qs_segment = queryset.filter(apartment__house=house)
            qs_union = qs_union | qs_segment
        queryset = qs_union
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
    if start_date:
        queryset = queryset.filter(date__gte=start_date)
    if end_date:
        queryset = queryset.filter(date__lte=end_date)
    if is_recognized == '0':
        queryset = queryset.filter(is_recognized=False)
    if is_recognized == '1':
        queryset = queryset.filter(is_recognized=True)
    if order:
        queryset = queryset.order_by(order)
    return queryset


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Service class"""

    serializer_class = serializers.ServiceSerializer
    queryset = Service.objects.all()


class ServiceWithoutPagination(ServiceViewSet):
    """ViewSet for the Service class
    Without pagination
    """
    pagination_class = None


class UOMChoices(APIView):
    """
    Send JSON list of UOM_CHOICES
    """
    queryset = Service.objects.none()

    def get(self, request):
        # Sending JSON list PAYMENT_TYPE_CHOICES
        json_data = Service.UOM_CHOICES
        return Response(json_data, status=status.HTTP_200_OK)


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
    """ ViewSet for the Payment

    Args:
        start_date ([date]): [start_date of filter period]
        end_date ([date]): [end_date of filter period]
        filter ([str]): [search string for filtering]
        company ([pk]): [company id for filtering]
        house ([pk]): [house id for filtering] [list]
        apartment ([pk]): [apartment id for filtering]
        service ([pk]): [service id for filtering]
        payment_type ([pk]): [PAYMENT_TYPE_CHOICES for filtering] [list]
        is_recognized ([0 or 1]): [is_active for filtering]
        order ([str]): [order for ordering]

    Returns:
        [queryset]: [queryset of filtered Payments]
    """

    serializer_class = serializers.PaymentSerializer

    def get_queryset(self):
        # get filtered payments
        queryset = payment_queryset_filter(self.request)
        # set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        # return filtered queryset
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
        period = self.request.GET.get('period')
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
        if period:
            period = datetime.strptime(period, '%Y-%m-%d').replace(day=1)
            queryset = queryset.filter(period=period)
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


class CreateBills(APIView):
    """
    Create bills for active apartments for given house

    * Only apartment owner has permission to view.
    * Return error HTTP_400_BAD_REQUEST if apartment does not exist.
    """
    queryset = Bill.objects.none()

    def get(self, request):
        bills_count = 0
        if request.query_params.get('uom_type') == Service.ByArea:
            # create bills by area for all houses in list
            for house in request.query_params.getlist('house'):
                bills_count += create_area_bills(house=house, period=date.today())

        message = f"{bills_count} bills successfully created"
        return Response(message, status=status.HTTP_200_OK)


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
        # get the bill
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


class TotalPayments(views.APIView):
    """
    Sending JSON with total payments analytics

    Args:
        start_date ([date]): [start_date of filter period]
        end_date ([date]): [end_date of filter period]
        filter ([str]): [search string for filtering]
        company ([pk]): [company id for filtering]
        house ([pk]): [house id for filtering] [list]
        apartment ([pk]): [apartment id for filtering]
        service ([pk]): [service id for filtering]
        payment_type ([pk]): [PAYMENT_TYPE_CHOICES for filtering] [list]
        is_recognized ([0 or 1]): [is_active for filtering]
        order ([str]): [order for ordering]

    Returns:
        [queryset]: [queryset of filtered Payments]
    """

    queryset = Payment.objects.none()

    def get(self, request):
        # get filtered queryset of payments
        queryset = payment_queryset_filter(self.request)
        # creating JSON data
        json_data = {}
        json_data["total_payments_count"] = queryset.count()
        json_data["period_total_payments"] = queryset.aggregate(Sum('value'))['value__sum'] or 0
        # sending responce with totals
        return Response(json_data, status=status.HTTP_200_OK)
