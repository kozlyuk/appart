from django.contrib import admin

from . import models


@admin.register(models.Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "text",
        "status",
        "created_by",
        "date_created",
        "date_updated",
    ]
