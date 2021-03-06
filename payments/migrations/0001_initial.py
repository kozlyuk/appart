# Generated by Django 2.2.8 on 2019-12-19 12:53

import appart.formatChecker
import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import payments.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('condominium', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.CharField(max_length=32, verbose_name='Bill number')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Bill amount')),
                ('date', models.DateField(default=datetime.date.today, verbose_name='Bill date')),
                ('pdf_copy', appart.formatChecker.ContentTypeRestrictedFileField(blank=True, null=True, verbose_name='Electronic copy')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date created')),
                ('date_updated', models.DateTimeField(auto_now=True, db_index=True, verbose_name='Date updated')),
                ('apartment', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='condominium.Apartment', verbose_name='Apartment')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
            ],
            options={
                'verbose_name': 'Bill',
                'verbose_name_plural': 'Bills',
            },
        ),
        migrations.CreateModel(
            name='BillPayment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Payment amount')),
                ('bill', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payments.Bill', verbose_name='Bill')),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Name')),
                ('description', models.CharField(blank=True, max_length=255, verbose_name='Description')),
            ],
            options={
                'verbose_name': 'Service',
                'verbose_name_plural': 'Services',
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('BP', 'Bank payment'), ('LP', 'LiqPay payment')], default='BP', max_length=2, verbose_name='Payment type')),
                ('action', models.CharField(choices=[('PY', 'pay')], default='PY', max_length=2, verbose_name='Payment action')),
                ('date', models.DateField(default=datetime.date.today, verbose_name='Payment date')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Payment amount')),
                ('description', models.CharField(blank=True, max_length=255, verbose_name='Payment description')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date created')),
                ('date_updated', models.DateTimeField(auto_now=True, db_index=True, verbose_name='Date updated')),
                ('bill', models.ManyToManyField(through='payments.BillPayment', to='payments.Bill', verbose_name='Bill')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
            ],
            options={
                'verbose_name': 'Payment',
                'verbose_name_plural': 'Payments',
            },
        ),
        migrations.AddField(
            model_name='billpayment',
            name='payment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payments.Payment', verbose_name='Payment'),
        ),
        migrations.AddField(
            model_name='bill',
            name='service',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payments.Service', verbose_name='Service'),
        ),
        migrations.AlterUniqueTogether(
            name='bill',
            unique_together={('service', 'apartment', 'number')},
        ),
    ]
