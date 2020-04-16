from django.db.models import Q
from rest_framework import viewsets

from condominium.models import Company, House, Apartment
from condominium.serializers import CompanySerializer, HouseSerializer, ApartmentSerializer


class ApartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Apartment class
    Filter queryset by search string ('filter' get parameter)
    Filter queryset by house and is_active fields ('house', 'is_active' get parameters)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = ApartmentSerializer

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


class HouseViewSet(viewsets.ModelViewSet):
    """ViewSet for the House class
    Filter queryset by search string ('filter' get parameter)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = HouseSerializer

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


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for the Company class"""

    queryset = Company.objects.all()
    serializer_class = CompanySerializer
