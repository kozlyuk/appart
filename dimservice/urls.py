"""appart.dimservice URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from dimservice import api

router = routers.DefaultRouter()
router.register("work", api.WorkViewSet)
router.register("order", api.OrderViewSet, basename='Order')
router.register("execution", api.ExecutionViewSet)


urlpatterns = (
    path("api/v1/", include(router.urls)),

    path("api/v1/get_orders/<int:apartment>/", api.OrderListView.as_view()),
    path("api/v1/get_exec_choices/", api.ExecStatusChoices.as_view()),
)
