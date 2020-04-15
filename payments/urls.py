"""appart.payments URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from payments.api import BillViewSet, PaymentViewSet, \
                         BillListView, GetTotalDebt, PaymentsListView, \
                         PayView, PayCallbackView

router = routers.DefaultRouter()
router.register("bill", BillViewSet, basename='Bill')
router.register("payment", PaymentViewSet, basename='Payment')

urlpatterns = (
    path("api/v1/", include(router.urls)),

    path("api/v1/get_bills/<int:apartment>/", BillListView.as_view()),
    path("api/v1/get_total_debt/<int:apartment>/", GetTotalDebt.as_view()),
    path("api/v1/get_payments/<int:apartment>/", PaymentsListView.as_view()),

    path("api/v1/pay/<int:bill>/", PayView.as_view(), name='pay_view'),
    path("api/v1/pay_callback/", PayCallbackView.as_view(), name='pay_callback'),
)
