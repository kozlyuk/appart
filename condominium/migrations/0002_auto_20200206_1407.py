# Generated by Django 2.2.9 on 2020-02-06 14:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('condominium', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='house',
            options={'ordering': ['name'], 'verbose_name': 'House', 'verbose_name_plural': 'Houses'},
        ),
    ]
