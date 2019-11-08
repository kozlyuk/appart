"""account URL Configuration"""
from django.urls import path, include, reverse_lazy
from rest_framework import routers

from django.contrib.auth import views
from .views import UserListView, UserCreateView, UserUpdateView, UserDetailView
from . import api

router = routers.DefaultRouter()
router.register("User", api.UserViewSet)

urlpatterns = [
    path("api/v1/", include(router.urls)),

    path('login/', views.LoginView.as_view(template_name='auth.html'), name='login'),
    path('logout/', views.LogoutView.as_view(next_page=reverse_lazy('login')), name='logout'),
    path('password_change/', views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', views.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('password_reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

    path("accounts/User/", UserListView.as_view(), name="accounts_User_list"),
    path("accounts/User/create/", UserCreateView.as_view(), name="accounts_User_create"),
    path("accounts/User/detail/<int:pk>/", UserDetailView.as_view(), name="accounts_User_detail"),
    path("accounts/User/update/<int:pk>/", UserUpdateView.as_view(), name="accounts_User_update"),

]
