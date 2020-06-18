"""appart.payments URL Configuration"""

from django.urls import path, include
from rest_framework_nested import routers

from payments import api

router = routers.DefaultRouter()
router.register("service", api.ServiceViewSet, basename='Service')
router.register("service_wop", api.ServiceWithoutPagination, basename='service_wop')
router.register("rate", api.RateViewSet, basename='Rate')
router.register("bill", api.BillViewSet, basename='Bill')
router.register("payment", api.PaymentViewSet, basename='Payment')

bill_router = routers.NestedSimpleRouter(router, r'bill', lookup='bill')
bill_router.register(r'billline', api.BillLineViewSet, basename='BillLine')


urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("api/v1/", include(bill_router.urls)),

    path("api/v1/get_total_debt/<int:apartment>/", api.GetTotalDebt.as_view(), name='get_total_debt'),
    path("api/v1/pay/<int:bill>/", api.PayView.as_view(), name='pay_view'),
    path("api/v1/pay_callback/", api.PayCallbackView.as_view(), name='pay_callback'),
)
