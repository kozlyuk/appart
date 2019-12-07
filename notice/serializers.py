from rest_framework import serializers

from . import models


class ChoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Choice
        fields = [
            "votes",
            "choice_text",
        ]

class NoticeSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Notice
        fields = [
            "actual_to",
            "actual_from",
            "picture",
            "title",
            "notice_type",
            "date_updated",
            "date_created",
            "text",
        ]

class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Question
        fields = [
            "actual_from",
            "actual_to",
            "question_text",
            "date_updated",
            "date_created",
        ]
