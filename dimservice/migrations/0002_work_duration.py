# Generated by Django 2.2.10 on 2020-03-07 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dimservice', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='work',
            name='duration',
            field=models.DurationField(blank=True, null=True, verbose_name='Duration'),
        ),
    ]
