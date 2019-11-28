# Generated by Django 2.2.7 on 2019-11-25 14:45

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='mobile_number',
            field=models.CharField(max_length=10, unique=True, validators=[django.core.validators.RegexValidator(message='Mobile number must contain 10 digits.', regex='^\\d{10}$')], verbose_name='Mobile number'),
        ),
    ]