from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("Apartment", api.ApartmentViewSet)
router.register("House", api.HouseViewSet)
router.register("Company", api.CompanyViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),

    path("condominium/Apartment/", views.ApartmentListView.as_view(), name="condominium_Apartment_list"),
    path("condominium/Apartment/create/", views.ApartmentCreateView.as_view(), name="condominium_Apartment_create"),
    path("condominium/Apartment/detail/<int:pk>/", views.ApartmentDetailView.as_view(), name="condominium_Apartment_detail"),
    path("condominium/Apartment/update/<int:pk>/", views.ApartmentUpdateView.as_view(), name="condominium_Apartment_update"),
    path("condominium/Apartment/delete/<int:pk>/", views.ApartmentDeleteView.as_view(), name="condominium_Apartment_delete"),

    path("condominium/House/", views.HouseListView.as_view(), name="condominium_House_list"),
    path("condominium/House/create/", views.HouseCreateView.as_view(), name="condominium_House_create"),
    path("condominium/House/detail/<int:pk>/", views.HouseDetailView.as_view(), name="condominium_House_detail"),
    path("condominium/House/update/<int:pk>/", views.HouseUpdateView.as_view(), name="condominium_House_update"),
    path("condominium/House/delete/<int:pk>/", views.HouseDeleteView.as_view(), name="condominium_House_delete"),

    path("condominium/Company/create/", views.CompanyCreateView.as_view(), name="condominium_Company_create"),
    path("condominium/Company/update/<int:pk>/", views.CompanyUpdateView.as_view(), name="condominium_Company_update"),
)
