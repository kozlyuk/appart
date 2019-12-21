"""appart.messaging URL Configuration"""

from django.urls import path

from messaging import views


urlpatterns = (
    path("webhook/", views.webhook, name='webhook'),
)
