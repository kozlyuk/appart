from rest_framework import viewsets

from messaging.models import Feedback
from messaging import serializers

class FeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet for the Service class"""

    serializer_class = serializers.FeedbackSerializer
    queryset = Feedback.objects.all()
    pagination_class = None
