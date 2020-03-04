from django.db.models import Q
from rest_framework import viewsets
from django_auto_prefetching import AutoPrefetchViewSetMixin
from rest_framework.response import Response

from . import serializers
from . import models


class ApartmentViewSet(AutoPrefetchViewSetMixin, viewsets.ModelViewSet):
    """ViewSet for the Apartment class"""

    serializer_class = serializers.ApartmentSerializer

    def get_queryset(self):
        queryset = models.Apartment.objects.all()
        # get filter parameters
        house_id=self.request.GET.get('house_id', '0')
        is_active=self.request.GET.get('is_active', '0')
        search_string=self.request.GET.get('filter', '').split()
        order = self.request.GET.get('o', '0')

        for word in search_string:
            queryset = tasks.filter(Q(resident__icontains=word) |
                                    Q(number__icontains=word) |
                                    Q(account_number__icontains=word))

        if customers != '0':
            tasks_union = Task.objects.none()
            for customer in customers:
                tasks_segment = tasks.filter(deal__customer=customer)
                tasks_union = tasks_union | tasks_segment
            tasks = tasks_union
        if order != '0':
            tasks = tasks.order_by(order)
        else:
            tasks = tasks.order_by('-creation_date', '-deal', 'object_code')

        return queryset


#        tasks = Task.objects.all()
        # search_string = self.request.GET.get('filter', '').split()
        # exec_statuses = self.request.GET.getlist('exec_status', '0')
        # owners = self.request.GET.getlist('owner', '0')
        # customers = self.request.GET.getlist('customer', '0')
        # order = self.request.GET.get('o', '0')
        # for word in search_string:
        #     tasks = tasks.filter(Q(object_code__icontains=word) |
        #                          Q(object_address__icontains=word) |
        #                          Q(deal__number__icontains=word) |
        #                          Q(project_type__price_code__icontains=word) |
        #                          Q(project_type__project_type__icontains=word))
        # if exec_statuses != '0':
        #     tasks_union = Task.objects.none()
        #     for status in exec_statuses:
        #         tasks_segment = tasks.filter(exec_status=status)
        #         tasks_union = tasks_union | tasks_segment
        #     tasks = tasks_union
        # if owners != '0':
        #     tasks_union = Task.objects.none()
        #     for owner in owners:
        #         tasks_segment = tasks.filter(owner=owner)
        #         tasks_union = tasks_union | tasks_segment
        #     tasks = tasks_union
        # if customers != '0':
        #     tasks_union = Task.objects.none()
        #     for customer in customers:
        #         tasks_segment = tasks.filter(deal__customer=customer)
        #         tasks_union = tasks_union | tasks_segment
        #     tasks = tasks_union
        # if order != '0':
        #     tasks = tasks.order_by(order)
        # else:
        #     tasks = tasks.order_by('-creation_date', '-deal', 'object_code')
        # return tasks


class HouseViewSet(viewsets.ModelViewSet):
    """ViewSet for the House class"""

    queryset = models.House.objects.all()
    serializer_class = serializers.HouseSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for the Company class"""

    queryset = models.Company.objects.all()
    serializer_class = serializers.CompanySerializer
