from rest_framework import viewsets, permissions, views
from rest_framework.response import Response


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
        user, created = User.objects.get_or_create(mobile_number=mobile_number, defaults={'is_staff': False})
        serializer = UserSerializer(user)
        return Response(serializer.data)
