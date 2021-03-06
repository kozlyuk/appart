import re
import pyotp
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from django.db.models import Q
from django.template.loader import render_to_string
from django.contrib.auth.models import Group
from rest_framework import viewsets, views, status, permissions
from rest_framework.response import Response
from messaging.tasks import send_email, send_sms

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


class UserWithoutPagination(UserViewSet):
    """ViewSet for the User class
    Without pagination
    """
    pagination_class = None


class GetUser(views.APIView):
    """
    Return current authentificated User
    """
    queryset = User.objects.none()

    def get(self, request):
        serializer = GetUserSerializer(request.user, context={"request":request})
        return Response(serializer.data)


class GetByNumber(views.APIView):
    """
    Return User object by given in URL mobile_number
    or return status.HTTP_404_NOT_FOUND if it isn`t exist.
    """
    queryset = User.objects.none()

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
    queryset = User.objects.none()

    def get(self, request, mobile_number):
        # try if Resident with such mobile_number exists
        try:
            user = User.objects.get(mobile_number=mobile_number, is_registered=False)
            serializer = UserSerializer(user)
        # except return status.HTTP_404_NOT_FOUND
        except User.DoesNotExist:
            message = _("Resident with such mobile number doesn`t exist or already registered")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        # return user serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)


class Register(views.APIView):
    """
    Check if resident mobile number exists in DB.
    If post_data valid - updates user data and
    sends confirmation email with token and sms with otp.
    If resident don`t exists return status HTTP_404_NOT_FOUND.
    If post_data not valid return status HTTP_400_BAD_REQUEST.
    If user data  updated return status HTTP_200_OK.
    """
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.none()

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
            user = User.objects.get(mobile_number=mobile_number, is_registered=False)
        # except return status.HTTP_404_NOT_FOUND
        except User.DoesNotExist:
            message = _("Resident with such mobile number doesn`t exist or already registered")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        # check if serializer is valid
        if serializer.is_valid():
            serializer.save()
            # send activation email with token
            mail_subject = _('Activate your DimOnline account.')
            domain = settings.FRONT_SITE_URL
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = account_activation_token.make_token(user)
            message = render_to_string('email/account_activation_email.txt', {
                'first_name': user.first_name,
                'account_activation_url': f"{domain}/registration/{uid}/{token}/",
            })
            send_email(mail_subject, message, to=[user.email]) # TODO add delay
            # send activation sms with otp
            hotp = pyotp.HOTP(settings.OTP_SECRET)
            mobile_number_international = '38' + mobile_number
            otp = hotp.at(user.pk)
            send_sms([mobile_number_international], otp) # TODO add delay
            message = _('User registered. Please activate your account from email link or enter OTP code from sms:')
            return Response(message, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateEmail(views.APIView):
    """
    Check actvation url and makes user active.
    If token is valid send HTTP_200_OK and make user active.
    If token is not valid send HTTP_400_BAD_REQUEST.
    """
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.none()

    def get(self, request, uidb64, token):
        # check if number is valid
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_registered = True
            user.is_active = True
            user.save()
            return Response(_('Thank you for your email confirmation. Now you can login your account.'),
                            status=status.HTTP_200_OK)
        return Response(_('Activation link is invalid!'),
                        status=status.HTTP_400_BAD_REQUEST)


class ActivateSMS(views.APIView):
    """
    Check actvation url and makes user active.
    If token is valid send HTTP_200_OK and make user active.
    If token is not valid send HTTP_400_BAD_REQUEST.
    """
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.none()

    def get(self, request, mobile_number, otp):
        # check if otp code is valid
        try:
            user = User.objects.get(mobile_number=mobile_number)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        hotp = pyotp.HOTP(settings.OTP_SECRET)
        if user is not None and hotp.verify(otp, user.pk):
            user.is_registered = True
            user.is_active = True
            user.save()
            return Response(_('Thank you for your otp confirmation. Now you can login your account.'),
                            status=status.HTTP_200_OK)
        return Response(_('OTP code is invalid!'),
                        status=status.HTTP_400_BAD_REQUEST)


class GetACL(views.APIView):
    """
    Sending JSON list of user permissions per objects
    """
    queryset = User.objects.none()

    def get(self, request):
        json_data = {}
        perms = request.user.get_all_permissions()
        object_list = list(set([perm.split('.')[1].split('_')[1] for perm in perms]))
        for perm in object_list:
            json_data[perm] = [p.split('.')[1].split('_')[0] for p in perms if p.endswith('_'+perm)]
        return Response(json_data, status=status.HTTP_200_OK)


class SetLang(views.APIView):
    """
    Sets current logged user lang.
    """
    queryset = User.objects.none()

    def get(self, request, lang):
        # create list of lang_choices
        lang_list = []
        for key, value in User.LANG_CHOICES:
            lang_list.append(key)
        # if lang in lang_list change user lang
        if lang in lang_list:
            request.user.lang = lang
            request.user.save()
            message = _('Inteface language changed to ') + lang
            return Response(message, status=status.HTTP_200_OK)
        return Response(_('Wrong data'), status=status.HTTP_400_BAD_REQUEST)


class GroupChoices(views.APIView):
    """
    Send JSON list of User groups
    """
    queryset = User.objects.none()

    def get(self, request):
        # Sending JSON list EXEC_STATUS_CHOICES
        json_data = [Group.objects.values_list('pk', 'name')]
        return Response(json_data, status=status.HTTP_200_OK)
