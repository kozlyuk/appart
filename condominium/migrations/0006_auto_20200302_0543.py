# Generated by Django 2.2.10 on 2020-03-02 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('condominium', '0005_auto_20200226_1524'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='apartment',
            name='deal_number',
        ),
        migrations.AddField(
            model_name='apartment',
            name='account_number',
            field=models.CharField(default=111, max_length=30, verbose_name='Deal number'),
            preserve_default=False,
        ),
    ]
