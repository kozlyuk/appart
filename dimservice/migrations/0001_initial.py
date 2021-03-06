# Generated by Django 2.2.10 on 2020-03-06 17:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('condominium', '0006_auto_20200302_0543'),
    ]

    operations = [
        migrations.CreateModel(
            name='Execution',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('scheduled_time', models.DateTimeField(verbose_name='Scheduled time')),
                ('exec_status', models.CharField(choices=[('SC', 'Scheduled'), ('DO', 'Done'), ('TR', 'Troubled')], default='SC', max_length=2, verbose_name='Execution status')),
                ('executor', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Executor')),
            ],
            options={
                'verbose_name': 'Executor',
                'verbose_name_plural': 'Executors',
            },
        ),
        migrations.CreateModel(
            name='Work',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, verbose_name='Work name')),
                ('price_code', models.CharField(max_length=10, unique=True, verbose_name='Price code')),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=8, verbose_name='Price')),
                ('description', models.TextField(blank=True, verbose_name='Description')),
                ('active', models.BooleanField(default=True, verbose_name='Active')),
            ],
            options={
                'verbose_name': 'Work',
                'verbose_name_plural': 'Works',
                'ordering': ['-price_code'],
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exec_status', models.CharField(choices=[('NE', 'New'), ('SC', 'Scheduled'), ('CA', 'Cancelled'), ('DO', 'Done'), ('TR', 'Troubled')], default='NE', max_length=2, verbose_name='Execution status')),
                ('pay_status', models.CharField(choices=[('NP', 'Not paid'), ('AP', 'Advance paid'), ('PU', 'Paid up')], default='NP', max_length=2, verbose_name='Pay status')),
                ('information', models.CharField(blank=True, max_length=255, verbose_name='Information')),
                ('warning', models.CharField(blank=True, max_length=255, verbose_name='Warning')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date created')),
                ('date_updated', models.DateTimeField(auto_now=True, db_index=True, verbose_name='Date updated')),
                ('date_closed', models.DateTimeField(blank=True, null=True, verbose_name='Date closed')),
                ('apartment', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='condominium.Apartment', verbose_name='Apartment')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
                ('executors', models.ManyToManyField(blank=True, related_name='orders', through='dimservice.Execution', to=settings.AUTH_USER_MODEL, verbose_name='Goods')),
                ('work', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='dimservice.Work', verbose_name='Work')),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
                'ordering': ['-date_created'],
            },
        ),
        migrations.AddField(
            model_name='execution',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dimservice.Order', verbose_name='Order'),
        ),
    ]
