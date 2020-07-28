"""appart.dimonline URL Configuration"""

from django.urls import path

from analytics import api


urlpatterns = (
    path("api/v1/active_apartments/", api.ActiveApartments.as_view(), name='active_apartments'),
    path("api/v1/registered_residents/", api.RegisteredResidents.as_view(), name='registered_residents'),
    path("api/v1/total_debt_company/", api.TotalDebtCompany.as_view(), name='total_debt_company'),
    path("api/v1/total_payments_company/", api.TotalPaymentsCompany.as_view(), name='total_payments_company'),
    path("api/v1/last_payments/", api.LastPayments.as_view(), name='last_payments'),
)
