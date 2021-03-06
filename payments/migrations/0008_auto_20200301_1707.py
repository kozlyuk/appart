# Generated by Django 2.2.10 on 2020-03-01 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0007_auto_20200228_1454'),
    ]

    operations = [
        migrations.AddField(
            model_name='bill',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Is active'),
        ),
        migrations.AlterField(
            model_name='billline',
            name='previous_debt',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=8, verbose_name='Debt value'),
        ),
    ]
