import csv, io
from django.db.models import Q
from django.contrib.auth.models import Group
from rest_framework import viewsets, permissions, status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from accounts.models import User
from condominium.models import Company, House, Apartment
from condominium import serializers


class ApartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Apartment class
    Filter queryset by search string ('filter' get parameter)
    Filter queryset by house and is_active fields ('house', 'is_active' get parameters)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = serializers.ApartmentSerializer

    def get_queryset(self):
        queryset = Apartment.objects.all()
        search_string = self.request.GET.get('filter', '').split()
        house = self.request.GET.get('house')
        is_active = self.request.GET.get('is_active', 'n')
        order = self.request.GET.get('order')
        for word in search_string:
            queryset = queryset.filter(Q(resident__mobile_number__contains=word) |
                                       Q(resident__first_name__icontains=word) |
                                       Q(resident__last_name__icontains=word) |
                                       Q(number__contains=word) |
                                       Q(account_number__contains=word))

        if house:
            queryset = queryset.filter(house=house)
        if is_active != 'n':
            queryset = queryset.filter(is_active=is_active)
        if order:
            queryset = queryset.order_by(order)

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
        queryset = House.objects.all()
        search_string = self.request.GET.get('filter', '').split()
        order = self.request.GET.get('order')
        for word in search_string:
            queryset = queryset.filter(Q(name__icontains=word) |
                                       Q(address__icontains=word))

        if order:
            queryset = queryset.order_by(order)
        return queryset


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

    def post(self, request, *args, **kwargs):
        def is_int(element):
            try:
                int(element)
                return True
            except ValueError:
                return False

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data['file']
        decoded_file = file.read().decode()
        # upload_products_csv.delay(decoded_file, request.user.pk)
        io_string = io.StringIO(decoded_file)
        rows = csv.reader(io_string)
        imported = 0
        for row in rows:
            print(is_int(row[0]))
            if is_int(row[0]) and is_int(row[1]) and not is_int(row[2]) and row[6]:
                full_name = row[2].split(' ', 1)
                user, created = User.objects.get_or_create(mobile_number=row[6],
                                                           defaults={'last_name': full_name[0],
                                                                     'first_name': full_name[1],
                                                                     'email': row[7]})
                resident_group = Group.objects.get(name='Резиденти')
                user.groups.add(resident_group)
                if created:
                    imported += 1
                print(user)

        message = f"Imported {imported} residents"
        return Response(message, status=status.HTTP_201_CREATED)
