from rest_framework import viewsets, permissions, views, status
from rest_framework.response import Response
import re

from .serializers import UserSerializer
from .models import User


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for the User class"""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GetByNumber(views.APIView):
    """
    This view return User object by given in URL mobile_number
    or if it isn`t exist create ones.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, mobile_number):
        message = "Mobile number must contain 10 digits"
        if not re.match(r'^\d{10}$', mobile_number):
            return Response(message, status=status.HTTP_412_PRECONDITION_FAILED)
        user, created = User.objects.get_or_create(mobile_number=mobile_number, defaults={'is_staff': False})
        serializer = UserSerializer(user)
        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_200_OK)
