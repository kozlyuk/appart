from rest_framework import serializers

from . import models


class ChoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Choice
        fields = [
            "pk",
            "votes",
            "choice_text",
        ]

class NoticeSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Notice
        fields = [
            "actual_to",
            "actual_from",
            "title",
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

class NewsSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.News
        fields = [
            "houses",
            "title",
            "text",
            "news_status",
            "actual_from",
            "actual_to",
            "picture",
            "created_by",
            "date_created",
            "date_updated"
        ]