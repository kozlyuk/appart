# Generated by Django 2.2.7 on 2019-11-13 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('condominium', '0002_apartment_resident'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apartment',
            name='number',
            field=models.PositiveSmallIntegerField(verbose_name='Apartment Number'),
        ),
    ]