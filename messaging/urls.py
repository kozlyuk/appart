"""appart.messaging URL Configuration"""

from django.urls import path, include
from rest_framework import routers

from messaging import views
from messaging import api

router = routers.DefaultRouter()
router.register("feedback", api.FeedbackViewSet)


urlpatterns = (
    path("api/v1/", include(router.urls)),

    path("webhook/", views.webhook, name='webhook'),
)
