from rest_framework import viewsets

from . import serializers
from . import models


class ChoiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Choice class"""

    queryset = models.Choice.objects.all()
    serializer_class = serializers.ChoiceSerializer


class NoticeViewSet(viewsets.ModelViewSet):
    """ViewSet for the Notice class"""

    queryset = models.Notice.objects.all()
    serializer_class = serializers.NoticeSerializer

class NewsViewSet(viewsets.ModelViewSet):
    """ViewSet for the News class"""

    queryset = models.News.objects.all()
    serializer_class = serializers.NewsSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Question class"""

    queryset = models.Question.objects.all()
    serializer_class = serializers.QuestionSerializer
