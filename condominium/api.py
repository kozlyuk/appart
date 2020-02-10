from rest_framework import viewsets

from . import serializers
from . import models


class ApartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Apartment class"""

    queryset = models.Apartment.objects.all()
    serializer_class = serializers.ApartmentSerializer


class HouseViewSet(viewsets.ModelViewSet):
    """ViewSet for the House class"""

    queryset = models.House.objects.all()
    serializer_class = serializers.HouseSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for the Company class"""

    queryset = models.Company.objects.all()
    serializer_class = serializers.CompanySerializer
