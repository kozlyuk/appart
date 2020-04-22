from rest_framework import serializers
from appart.utils import ChoicesField

from notice.models import Notice, News, Question, Choice


class NoticeSerializer(serializers.ModelSerializer):
    notice_status = ChoicesField(choices=Notice.STATUS_CHOICES,
                                 required=False)

    class Meta:
        model = Notice
        fields = [
            "pk",
            "title",
            "apartment",
            "notice_status",
            "actual_to",
            "actual_from",
            "text",
        ]


class NewsSerializer(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = [
            "pk",
            "title",
            "news_status",
            "text",
            "actual_to",
            "actual_from",
        ]


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = [
            "pk",
            "title",
            "question_text",
            "actual_from",
            "actual_to",
        ]

class ChoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = [
            "pk",
            "question",
            "choice_text",
            "votes",
        ]
