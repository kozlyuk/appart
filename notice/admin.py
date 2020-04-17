from django.contrib import admin

from . import models


@admin.register(models.Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "apartment",
        "actual_to",
        "actual_from",
        "text",
    ]


@admin.register(models.News)
class NewsAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "news_status",
        "text",
        "actual_to",
        "actual_from",
    ]


@admin.register(models.Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "question_text",
        "actual_from",
        "actual_to",
    ]


@admin.register(models.Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = [
        "question",
        "choice_text",
        "votes",
    ]
