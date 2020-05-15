"""appart.dimservice URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from dimservice import api

router = routers.DefaultRouter()
router.register("work", api.WorkViewSet,
                basename='work')
router.register("work_without_pagination", api.WorkWithoutPagination,
                basename='work_without_pagination')
router.register("order", api.OrderViewSet,
                basename='Order')
router.register("execution", api.ExecutionViewSet)


urlpatterns = (
    path("api/v1/", include(router.urls)),

    path("api/v1/get_exec_choices/", api.ExecStatusChoices.as_view()),
    path("api/v1/get_payment_choices/", api.PaymentStatusChoices.as_view()),
)
