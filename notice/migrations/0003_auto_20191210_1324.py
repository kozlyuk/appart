# Generated by Django 2.2.8 on 2019-12-10 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notice', '0002_notice_notice_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='choice_text',
            field=models.CharField(max_length=255, verbose_name='Choise text'),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_text',
            field=models.TextField(verbose_name='Question text'),
        ),
    ]