from rest_framework import viewsets, permissions, generics

from . import serializers
from .models import User


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for the User class"""

    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GetByNumber(generics.ListAPIView):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        """
        This view return User object by given in URL mobile_number.
        """
        mobile_number = self.kwargs['mobile_number']
        return User.objects.filter(mobile_number=mobile_number)
