"""appart.messaging URL Configuration"""

from django.urls import path

from messaging import views


urlpatterns = (
    path("viber_send/", views.ViberSentView.as_view(), name='viber_send'),
)
