"""appart.account URL Configuration"""

from django.urls import path, include, reverse_lazy
from django.contrib.auth import views as auth
from rest_framework import routers

from accounts import api

router = routers.DefaultRouter()
router.register("user", api.UserViewSet, basename='User')
router.register("user_wop", api.UserWithoutPagination, basename='user_wop')

urlpatterns = [

    path("api/v1/", include(router.urls)),
    path("api/v1/get_user/", api.GetUser.as_view(), name='get_user'),
    path("api/v1/get_by_number/<str:mobile_number>/", api.GetByNumber.as_view(), name='get_by_number'),
    path("api/v1/check_resident/<str:mobile_number>/", api.CheckResident.as_view(), name='check_resident'),
    path("api/v1/register/", api.Register.as_view(), name='register'),
    path("api/v1/activate/<str:uidb64>/<str:token>/", api.Activate.as_view(), name='activate'),
    path("api/v1/get_acl/", api.GetACL.as_view(), name='get_acl'),
    path("api/v1/set_lang/<str:lang>/", api.SetLang.as_view(), name='set_lang'),
    path("api/v1/get_group_choices/", api.GroupChoices.as_view(), name='group_choices'),

    path('login/', auth.LoginView.as_view(template_name='auth.html'), name='login'),
    path('logout/', auth.LogoutView.as_view(next_page=reverse_lazy('login')), name='logout'),
    path('password_change/', auth.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('password_reset/', auth.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
