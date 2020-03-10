"""appart.payments URL Configuration"""

from django.urls import path

from payments.api import BillListView, GetTotalDebt, PaymentsListView

urlpatterns = (
    path("api/v1/get_bills/<int:apartment>/", BillListView.as_view()),
    path("api/v1/get_total_debt/<int:apartment>/", GetTotalDebt.as_view()),
    path("api/v1/get_payments/<int:apartment>/", PaymentsListView.as_view())
    )
