from rest_framework import serializers
from messaging.models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
        fields = [
            "title",
            "text",
            "status",
            "created_by",
            "date_created",
            "date_updated"
        ]
