from rest_framework import viewsets, permissions

from . import serializers
from . import models


class ChoiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Choice class"""

    queryset = models.Choice.objects.all()
    serializer_class = serializers.ChoiceSerializer
#     permission_classes = [permissions.IsAuthenticated]


class NoticeViewSet(viewsets.ModelViewSet):
    """ViewSet for the Notice class"""

    queryset = models.Notice.objects.all()
    serializer_class = serializers.NoticeSerializer
#     permission_classes = [permissions.IsAuthenticated]

class NewsViewSet(viewsets.ModelViewSet):
    """ViewSet for the News class"""

    queryset = models.News.objects.all()
    serializer_class = serializers.NewsSerializer
#     permission_classes = [permissions.IsAuthenticated]


class QuestionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Question class"""

    queryset = models.Question.objects.all()
    serializer_class = serializers.QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
