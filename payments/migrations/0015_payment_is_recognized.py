# Generated by Django 3.0.7 on 2020-07-31 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0014_auto_20200715_1550'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='is_recognized',
            field=models.BooleanField(default=False, verbose_name='Is recognized'),
        ),
    ]