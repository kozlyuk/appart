import csv
import io
from datetime import date
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import Group
from rest_framework import views, viewsets, permissions, status
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response

from accounts.models import User
from condominium.models import Company, House, Apartment
from condominium import serializers
from condominium.services import is_int
from payments.models import Bill, Payment
from payments.serializers import BillSerializer, PaymentSerializer


def apartment_queryset_filter(request):
    """return queryset of apartments filtered by get parameters in request"""
    queryset = Apartment.objects.all()
    search_string = request.GET.get('filter', '').split()
    company = request.GET.get('company')
    houses = request.GET.getlist('house')
    is_active = not request.GET.get('is_active') == "0"
    order = request.GET.get('order')
    for word in search_string:
        queryset = queryset.filter(Q(resident__mobile_number__contains=word) |
                                   Q(resident__first_name__icontains=word) |
                                   Q(resident__last_name__icontains=word) |
                                   Q(number__contains=word) |
                                   Q(account_number__contains=word))
    if company:
        queryset = queryset.filter(house__company=company)
    if houses:
        qs_union = Apartment.objects.none()
        for house in houses:
            qs_segment = queryset.filter(house=house)
            qs_union = qs_union | qs_segment
        queryset = qs_union
    if is_active:
        queryset = queryset.filter(is_active=True)
    if order:
        queryset = queryset.order_by(order)
    return queryset


def house_queryset_filter(request):
    """return queryset of houses filtered by get parameters in request"""
    queryset = House.objects.all()
    search_string = request.GET.get('filter', '').split()
    order = request.GET.get('order')
    for word in search_string:
        queryset = queryset.filter(Q(name__icontains=word) |
                                   Q(address__icontains=word))
    if order:
        queryset = queryset.order_by(order)
    return queryset


class ApartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Apartment class
    Filter queryset by search string ('filter' get parameter)
    Filter queryset by house and is_active fields ('house', 'is_active' get parameters)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = serializers.ApartmentSerializer

    def get_queryset(self):
        # filtering queryset
        queryset = apartment_queryset_filter(self.request)

        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset


class ApartmentAnalytics(ListAPIView):
    """ ListView for Apartments analytics

    Args:
        start_date ([date]): [start_date of filter period]
        finish_date ([date]): [finish_date of filter period]
        filter ([str]): [search string for filtering]
        company ([str]): [company for filtering]
        house ([str]): [house for filtering]
        is_active ([boolean]): [is_active for filtering]
        order ([str]): [order for ordering]

    Returns:
        [queryset]: [queryset of filtered Apartments]
    """
    serializer_class = serializers.ApartmentAnalyticsSerializer

    def get_serializer_context(self):
        return {'start_date': self.request.query_params.get('start_date', date.today().replace(day=1)),
                'finish_date': self.request.query_params.get('finish_date', date.today())}

    def get_queryset(self):
        # filtering queryset
        queryset = apartment_queryset_filter(self.request)

        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        return queryset


class ApartmentWithoutPagination(ApartmentViewSet):
    """ViewSet for the Apartmen class
    Without pagination
    """
    pagination_class = None


class HouseViewSet(viewsets.ModelViewSet):
    """ViewSet for the House class
    Filter queryset by search string ('filter' get parameter)
    Order queryset by any given field ('order' get parameter)
    """
    serializer_class = serializers.HouseSerializer
    permission_class = permissions.AllowAny

    def get_queryset(self):
        return house_queryset_filter(self.request)


class HouseWithoutPagination(HouseViewSet):
    """ViewSet for the House class
    Without pagination
    """
    pagination_class = None


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for the Company class"""

    queryset = Company.objects.all()
    serializer_class = serializers.CompanySerializer
    pagination_class = None


class CSVImport(CreateAPIView):
    """
    Imoprt CSV file with User and Apartments data.
    Format of CSV row is:
    appartment_number;account_number;full_name;apartment_area;
    residents_count;exemption_count;phone_number;email;
    """
    queryset = Apartment.objects.none()
    serializer_class = serializers.FileUploadSerializer

    def post(self, request, house_pk):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data['file']
        decoded_file = file.read().decode()
        # upload_products_csv.delay(decoded_file, request.user.pk)
        io_string = io.StringIO(decoded_file)
        rows = csv.reader(io_string)
        imported_users = 0
        imported_apartment = 0
        for row in rows:
            print(is_int(row[0]))
            if is_int(row[0]) and is_int(row[1]) and row[6]:
                # prepearing data
                full_name = row[2].split(' ', 1)
                if row[3] == '' or row[3] == ' ':
                    row[3] = 0
                row[3] = float(row[3].replace(',', '.'))
                if row[4] == '' or row[4] == ' ':
                    row[4] = 0
                if row[5] == '' or row[5] == ' ':
                    row[5] = 0
                if len(row[6]) == 9:
                    row[6] = '0' + row[6]
                if len(row[6]) > 10:
                    row[6] = row[6][len(row[6])-10:]
                # create resident if user with such mobile_number does not exist
                user, created = User.objects.get_or_create(mobile_number=row[6],
                                                           defaults={'last_name': full_name[0],
                                                                     'first_name': full_name[1],
                                                                     'email': row[7]})
                resident_group = Group.objects.get(name='Резиденти')
                user.groups.add(resident_group)
                if created:
                    imported_users += 1
                print(user)
                # create apartment if apartment with such house and number does not exist
                house = House.objects.get(pk=house_pk)
                apartment, created = Apartment.objects.get_or_create(house=house,
                                                                     resident=user,
                                                                     number=row[0],
                                                                     defaults={'account_number': row[1],
                                                                               'area': row[3],
                                                                               'residents_count': row[4] or 0,
                                                                               'exemption_count': row[5] or 0,
                                                                               'is_active': True})
                if created:
                    imported_apartment += 1

                if imported_users == 0 and imported_apartment == 0:
                    message = _("File already imported or data is incorrect")
                    return Response(message, status=status.HTTP_400_BAD_REQUEST)

        message = _(f"Imported {imported_users} residents and {imported_apartment} apartments")
        return Response(message, status=status.HTTP_201_CREATED)


class ApartmentBalanceSheet(ListAPIView):
    """ Send list of apartments bills and payments for period
    Url parameters:
        apartment_pk (int): apartment_pk
    Get parameters:
        start_date (date): from date filter
        finish_date (date): to date filter
    Returns:
            "Bills": BillSerializer.data,
            "Payments": PaymentSerializer.data
    """

    permission_classes = [permissions.IsAuthenticated] # TODO write permissions
    serializer_class_bill = BillSerializer
    serializer_class_payment = PaymentSerializer
    queryset = Bill.objects.none

    def get_queryset_bill(self, apartment_pk):
        start_date = self.request.GET.get('start_date')
        finish_date = self.request.GET.get('finish_date')
        bills = Bill.objects.filter(apartment=apartment_pk) \
                            .order_by('period')
        if start_date:
            bills = bills.filter(period__gte=start_date)
        if finish_date:
            bills = bills.filter(period__lte=finish_date)
        return bills

    def get_queryset_payment(self, apartment_pk):
        start_date = self.request.GET.get('start_date')
        finish_date = self.request.GET.get('finish_date')
        payments = Payment.objects.filter(apartment=apartment_pk) \
                                  .order_by('date')
        if start_date:
            payments = payments.filter(date__gte=start_date)
        if finish_date:
            payments = payments.filter(date__lte=finish_date)
        return payments

    def list(self, request, apartment_pk):
        bill = self.serializer_class_bill(self.get_queryset_bill(apartment_pk), many=True)
        payment = self.serializer_class_payment(self.get_queryset_payment(apartment_pk), many=True)
        return Response({
            "Bills": bill.data,
            "Payments": payment.data
        })


class TotalApartmentsAnalytics(views.APIView):
    """
    Sending JSON with total apartments analytics
    Get parameters:
        start_date (date): from date filter
        finish_date (date): to date filter
    Returns:
        "total_apartments_count": count of apartments in queryset,
        "current_total_debt": total debt of apartments in queryset
        "period_total_bills_sum": bills sum of apartments in queryset,
        "period_total_payments_sum": payments sum of apartments in queryset
    """
    queryset = Apartment.objects.none()

    def get(self, request):
        # filtering queryset
        queryset = apartment_queryset_filter(self.request)

        # qalculating total data
        start_date = self.request.GET.get('start_date')
        finish_date = self.request.GET.get('finish_date')
        current_total_debt = 0
        period_total_bills_sum = 0
        period_total_payments_sum = 0
        for apartment in queryset:
            current_total_debt += apartment.current_total_debt()
            period_total_bills_sum += apartment.period_total_bills(start_date, finish_date)
            period_total_payments_sum += apartment.period_total_payments(start_date, finish_date)

        # sending responce with totals
        json_data = {}
        json_data["total_apartments_count"] = queryset.count()
        json_data["current_total_debt"] = current_total_debt
        json_data["period_total_bills_sum"] = period_total_bills_sum
        json_data["period_total_payments_sum"] = period_total_payments_sum
        return Response(json_data, status=status.HTTP_200_OK)
