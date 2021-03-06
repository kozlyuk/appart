"""appart.condominium URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from condominium import api

router = routers.DefaultRouter()
router.register("apartment",
                api.ApartmentViewSet,
                basename='Apartment')
router.register("apartment_without_pagination",
                api.ApartmentWithoutPagination,
                basename='apartment_without_pagination')
router.register("house", api.HouseViewSet, basename='House')
router.register("house_without_pagination",
                api.HouseWithoutPagination,
                basename='house_without_pagination')
router.register("company", api.CompanyViewSet)


urlpatterns = (
    path("api/v1/", include(router.urls)),

    path("api/v1/apartment_analytics/",
         api.ApartmentAnalytics.as_view(),
         name='apartment_analytics'),
    path("api/v1/apartment_balance_sheet/<int:apartment_pk>/",
         api.ApartmentBalanceSheet.as_view(),
         name='apartment_balance_sheet'),
    path("api/v1/total_apartments_analytics/",
         api.TotalApartmentsAnalytics.as_view(),
         name='total_apartments_analytics'),
    path("api/v1/csv_import/<int:house_pk>/",
         api.CSVImport.as_view(),
         name='csv_import'),
)
