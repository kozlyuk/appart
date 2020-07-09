"""appart.dimonline URL Configuration"""

from django.urls import path

from dashboard import api


urlpatterns = (
    path("api/v1/active_apartments/", api.ActiveApartments.as_view(), name='active_apartments'),
    path("api/v1/registered_residents/", api.RegisteredResidents.as_view(), name='registered_residents'),
)
