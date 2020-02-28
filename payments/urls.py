"""appart.payments URL Configuration"""

from django.urls import path

from payments.api import BillListView

urlpatterns = (
    path("api/v1/Bill/", BillListView.as_view()),
)
