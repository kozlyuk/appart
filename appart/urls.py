"""appart URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from appart.settings import DEBUG, MEDIA_URL, MEDIA_ROOT, STATIC_URL, STATIC_ROOT


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('condominium/', include('condominium.urls')),
    path('payments/', include('payments.urls')),
    path('', include('pages.urls')),
    path('messaging/', include('messaging.urls')),
    path('notice/', include('notice.urls')),
    path('dimservice/', include('dimservice.urls')),
    path('dashboard/', include('dashboard.urls')),

    path('rest-auth/', include('rest_auth.urls')),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]

# Debuging tools

if DEBUG:
    urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
    urlpatterns += static(STATIC_URL, document_root=STATIC_ROOT)
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]  # Django silk
