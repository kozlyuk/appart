import re
from django.utils.translation import ugettext_lazy as _
from rest_framework import viewsets, views, status
from rest_framework.response import Response

from accounts.serializers import UserSerializer, GetUserSerializer
from accounts.models import User


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for the User class"""

    queryset = User.objects.all()
    serializer_class = UserSerializer


class GetUser(views.APIView):
    """
    Return current authentificated User pk and is_staff fields
    """

    def get(self, request):
        serializer = GetUserSerializer(request.user)
        return Response(serializer.data)


class GetByNumber(views.APIView):
    """
    Return User object by given in URL mobile_number
    or create ones if it isn`t exist.
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
            message = _("Resident with such email doesn`t exists")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        # return user serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
