# Generated by Django 3.0.7 on 2020-07-06 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('condominium', '0006_auto_20200302_0543'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='service_email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='Service email address'),
        ),
    ]