# Generated by Django 2.2.10 on 2020-05-13 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dimservice', '0004_remove_order_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='work',
            name='basic',
            field=models.BooleanField(default=True, verbose_name='Basic'),
        ),
    ]