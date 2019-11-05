"""account URL Configuration"""
from django.urls import path, reverse_lazy

from django.contrib.auth import views


urlpatterns = [
    path('login/', views.LoginView.as_view(template_name='auth.html'), name='login'),
    path('logout/', views.LogoutView.as_view(next_page=reverse_lazy('login')), name='logout'),
]