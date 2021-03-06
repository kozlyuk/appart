# Generated by Django 3.0.7 on 2020-07-20 12:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('condominium', '0013_remove_house_apartments_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='house',
            name='company',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='condominium.Company', verbose_name='Company'),
            preserve_default=False,
        ),
    ]
