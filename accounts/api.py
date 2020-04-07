import re
from django.utils.translation import ugettext_lazy as _
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from django.db.models import Q
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from rest_framework import viewsets, views, status, permissions
from rest_framework.response import Response
from messaging.tasks import send_email

from accounts.serializers import UserSerializer, GetUserSerializer
from accounts.models import User
from accounts.services import account_activation_token


class UserViewSet(viewsets.ModelViewSet):
    """ ViewSet for the User class
    Filter queryset by search string ('filter' get parameter)
    Order queryset by any given field ('order' get parameter)
    """

    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        search_string = self.request.GET.get('filter', '').split()
        order = self.request.GET.get('order')
        for word in search_string:
            queryset = queryset.filter(Q(mobile_number__contains=word) |
                                       Q(first_name__icontains=word) |
                                       Q(last_name__icontains=word) |
                                       Q(email__icontains=word))

        if order:
            queryset = queryset.order_by(order)

        return queryset


class GetUser(views.APIView):
    """
    Return current authentificated User
    pk, is_staff, apartments fields
    """

    def get(self, request):
        serializer = GetUserSerializer(request.user)
        return Response(serializer.data)


class GetByNumber(views.APIView):
    """
    Return User object by given in URL mobile_number
    or return status.HTTP_404_NOT_FOUND if it isn`t exist.
    """

    def get(self, request, mobile_number):
        # check if number is valid
        message = _("Mobile number must contain 10 digits")
        if not re.match(r'^\d{10}$', mobile_number):
            # except return status.HTTP_404_NOT_FOUND
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        # try if Resident with such email exists
        try:
            user = User.objects.get(mobile_number=mobile_number)
            serializer = UserSerializer(user)
        # except return status.HTTP_404_NOT_FOUND
        except User.DoesNotExist:
            message = _("Resident with such mobile number doesn`t exist")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        # return user serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)


class CheckResident(views.APIView):
    """
    Check if resident mobile number exists in DB and not registered.
    If True return status HTTP_200_OK.
    If False return status HTTP_404_NOT_FOUND.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, mobile_number):
        # try if Resident with such mobile_number exists
        try:
            User.objects.get(mobile_number=mobile_number, is_active=False)
        # except return status.HTTP_404_NOT_FOUND
        except User.DoesNotExist:
            message = _("Resident with such mobile number doesn`t exist or already registered")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        # return user serialized data
        message = _("Resident with such mobile number exists")
        return Response(message, status=status.HTTP_200_OK)


class Register(views.APIView):
    """
    Check if resident mobile number exists in DB.
    If post_data valid - updates user data and
    sends confirmation email with token.
    If resident don`t exists return status HTTP_404_NOT_FOUND.
    If post_data not valid return status HTTP_400_BAD_REQUEST.
    If user data  updated return status HTTP_200_OK.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # check if number is valid
        mobile_number = request.POST.get('mobile_number')
        if not mobile_number:
            message = _("POST data doesn`t contain mobile_number")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        email = request.POST.get('email')
        if not email:
            message = _("POST data doesn`t contain email")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        # try if Resident with such mobile number exists or already registered
        try:
            user = User.objects.get(mobile_number=mobile_number, is_active=False)
        # except return status.HTTP_404_NOT_FOUND
        except User.DoesNotExist:
            message = _("Resident with such mobile number doesn`t exist or already registered")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        # check if serializer is valid
        if serializer.is_valid():
            serializer.save()
            current_site = get_current_site(request)
            mail_subject = _('Activate your DimOnline account.')
            message = render_to_string('acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),
                'token':account_activation_token.make_token(user),
            })
            send_email.delay(mail_subject, message, to=[user.email])
            return Response(_('User registered'), status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Activate(views.APIView):
    """
    Check actvation url and makes user active.
    If token is valid send HTTP_200_OK and make user active.
    If token is not valid send HTTP_400_BAD_REQUEST.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        # check if number is valid
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response(_('Thank you for your email confirmation. Now you can login your account.'),
                            status=status.HTTP_200_OK)
        else:
            return Response(_('Activation link is invalid!'),
                            status=status.HTTP_400_BAD_REQUEST)
