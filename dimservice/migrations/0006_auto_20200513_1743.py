# Generated by Django 2.2.10 on 2020-05-13 17:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dimservice', '0005_work_basic'),
    ]

    operations = [
        migrations.RenameField(
            model_name='work',
            old_name='basic',
            new_name='is_basic',
        ),
    ]
