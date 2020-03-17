import re
from django.utils.translation import ugettext_lazy as _
from django.db.models import Q
from rest_framework import viewsets, views, status
from rest_framework.response import Response

from accounts.serializers import UserSerializer, GetUserSerializer
from accounts.models import User


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
            message = _("Resident with such email doesn`t exists")
            return Response(message, status=status.HTTP_404_NOT_FOUND)
        # return user serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
