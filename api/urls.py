from django.urls import path, re_path, include
from rest_framework import routers

from accounts import api as accounts_api
from condominium import api as condominium_api
from payments import api as payments_api

router = routers.DefaultRouter()
router.register("user", accounts_api.UserViewSet)
router.register("apartment", condominium_api.ApartmentViewSet)
router.register("house", condominium_api.HouseViewSet)
router.register("company", condominium_api.CompanyViewSet)
router.register("Payment", payments_api.PaymentViewSet)
router.register("Bill", payments_api.BillViewSet)
router.register("Service", payments_api.ServiceViewSet)
r'^\d{10}$'

urlpatterns = [
    path("api/v1/", include(router.urls)),

    re_path(r'^api/v1/user/get_by_number/(?P<mobile_number>\d{10})/$', accounts_api.GetByNumber.as_view()),
]