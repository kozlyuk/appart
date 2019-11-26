from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response


from . import serializers
from .models import User


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for the User class"""

    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GetByNumber(generics.ListAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        """
        This view return User object by given in URL mobile_number
        or if it isn`t exist create ones.
        """
        mobile_number = self.kwargs['mobile_number']
        user, created = User.objects.get_or_create(mobile_number=mobile_number, defaults={'is_staff': False})
        serializer = self.get_serializer(user)
        return Response(serializer.data)
