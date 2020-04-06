"""appart.account URL Configuration"""

from django.urls import path, include, reverse_lazy
from django.contrib.auth import views as auth
from rest_framework import routers

from accounts.api import UserViewSet, GetUser, GetByNumber, \
                         CheckResident, Register

router = routers.DefaultRouter()
router.register("user", UserViewSet, basename='User')

urlpatterns = [

    path("api/v1/", include(router.urls)),
    path("api/v1/get_user/", GetUser.as_view(), name='get_user'),
    path("api/v1/get_by_number/<str:mobile_number>/", GetByNumber.as_view(), name='get_by_number'),
    path("api/v1/check_resident/<str:mobile_number>/", CheckResident.as_view(), name='check_resident'),
    path("api/v1/register/", Register.as_view(), name='register'),
    path("api/v1/activate/<str:uidb64>/<str:token>/", Register.as_view(), name='activate'),

    path('login/', auth.LoginView.as_view(template_name='auth.html'), name='login'),
    path('logout/', auth.LogoutView.as_view(next_page=reverse_lazy('login')), name='logout'),
    path('password_change/', auth.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('password_reset/', auth.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
