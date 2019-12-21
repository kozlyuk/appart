# Generated by Django 2.2.8 on 2019-12-18 09:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('condominium', '0004_apartment_deal_number'),
        ('notice', '0005_auto_20191216_2140'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='notice',
            options={'ordering': ['-date_created'], 'verbose_name': 'Notice', 'verbose_name_plural': 'Notices'},
        ),
        migrations.RemoveField(
            model_name='notice',
            name='house',
        ),
        migrations.RemoveField(
            model_name='notice',
            name='notice_type',
        ),
        migrations.RemoveField(
            model_name='notice',
            name='picture',
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='News title')),
                ('text', models.TextField(verbose_name='News text')),
                ('notice_type', models.CharField(choices=[('CO', 'About company'), ('HO', 'About house')], default='HO', max_length=2, verbose_name='News type')),
                ('notice_status', models.CharField(choices=[('WA', 'Warning'), ('IN', 'Info')], default='IN', max_length=2, verbose_name='News status')),
                ('actual_from', models.DateField(blank=True, null=True, verbose_name='Actual from')),
                ('actual_to', models.DateField(blank=True, null=True, verbose_name='Actual to')),
                ('picture', models.ImageField(blank=True, null=True, upload_to='notice/', verbose_name='Picture')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date created')),
                ('date_updated', models.DateTimeField(auto_now=True, db_index=True, verbose_name='Date updated')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
                ('house', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='condominium.House', verbose_name='House')),
            ],
            options={
                'verbose_name': 'News',
                'ordering': ['-date_created'],
            },
        ),
    ]