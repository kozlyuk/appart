# Generated by Django 3.0.7 on 2020-07-09 08:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('condominium', '0009_remove_apartment_area'),
    ]

    operations = [
        migrations.AddField(
            model_name='apartment',
            name='area',
            field=models.FloatField(default=0, verbose_name='Area'),
        ),
    ]
