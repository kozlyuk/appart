from datetime import date
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from rest_framework.serializers import ValidationError

from notice.serializers import NoticeSerializer, NewsSerializer, \
                               ChoiceSerializer, QuestionSerializer
from notice.models import Notice, News, Choice, Question
from condominium.models import Apartment


class NoticeViewSet(viewsets.ModelViewSet):
    """ViewSet for the Notice class"""

    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer

class NewsViewSet(viewsets.ModelViewSet):
    """ViewSet for the News class"""

    queryset = News.objects.all()
    serializer_class = NewsSerializer

class ChoiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Choice class"""

    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Question class"""

    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class NoticeListView(ListAPIView):
    """
    View all actual notice of apartment.

    * Requires parameters: apartment.
    * Only apartment owner has permission to notices.
    * Return error HTTP_400_BAD_REQUEST if apartment does not exist
    """

    serializer_class = NoticeSerializer

    def get_queryset(self):
        apartment_pk = self.kwargs['apartment']
        # get the apartment
        try:
            apartment = Apartment.objects.get(pk=apartment_pk)
        # return error HTTP_400_BAD_REQUEST if apartment does not exist
        except Apartment.DoesNotExist:
            raise ValidationError({_('error'): [_('Apartment with such id does not exist')]})
        # get bills for apartment
        queryset = apartment.notice_set.filter(Q(actual_from=None, actual_to=None) |
                                               Q(actual_from__lte=date.today(), actual_to=None) |
                                               Q(actual_from=None, actual_to__gte=date.today()) |
                                               Q(actual_from__lte=date.today(), actual_to__gte=date.today()))

        return queryset.order_by('-notice_status', '-date_created')
