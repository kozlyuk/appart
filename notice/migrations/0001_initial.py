# Generated by Django 2.2.8 on 2019-12-19 12:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('condominium', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.TextField(verbose_name='Question text')),
                ('actual_from', models.DateField(blank=True, null=True, verbose_name='Actual from')),
                ('actual_to', models.DateField(blank=True, null=True, verbose_name='Actual to')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date created')),
                ('date_updated', models.DateTimeField(auto_now=True, db_index=True, verbose_name='Date updated')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
            ],
            options={
                'verbose_name': 'Poll',
                'verbose_name_plural': 'Polls',
                'ordering': ['-date_created'],
            },
        ),
        migrations.CreateModel(
            name='Notice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='News title')),
                ('text', models.TextField(verbose_name='News text')),
                ('notice_status', models.CharField(choices=[('WA', 'Warning'), ('IN', 'Info')], default='IN', max_length=2, verbose_name='News status')),
                ('actual_from', models.DateField(blank=True, null=True, verbose_name='Actual from')),
                ('actual_to', models.DateField(blank=True, null=True, verbose_name='Actual to')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date created')),
                ('date_updated', models.DateTimeField(auto_now=True, db_index=True, verbose_name='Date updated')),
                ('apartment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='condominium.Apartment', verbose_name='Apartment')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
            ],
            options={
                'verbose_name': 'Notice',
                'verbose_name_plural': 'Notices',
                'ordering': ['-date_created'],
            },
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='News title')),
                ('text', models.TextField(verbose_name='News text')),
                ('news_status', models.CharField(choices=[('WA', 'Warning'), ('IN', 'Info')], default='IN', max_length=2, verbose_name='News status')),
                ('actual_from', models.DateField(blank=True, null=True, verbose_name='Actual from')),
                ('actual_to', models.DateField(blank=True, null=True, verbose_name='Actual to')),
                ('picture', models.ImageField(blank=True, null=True, upload_to='notice/', verbose_name='Picture')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date created')),
                ('date_updated', models.DateTimeField(auto_now=True, db_index=True, verbose_name='Date updated')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
                ('houses', models.ManyToManyField(blank=True, to='condominium.House', verbose_name='Houses')),
            ],
            options={
                'verbose_name': 'News',
                'ordering': ['-news_status', '-date_created'],
            },
        ),
        migrations.CreateModel(
            name='Choice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('choice_text', models.CharField(max_length=255, verbose_name='Choise text')),
                ('votes', models.IntegerField(default=0, verbose_name='Votes')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='notice.Question', verbose_name='Question')),
                ('user', models.ManyToManyField(to=settings.AUTH_USER_MODEL, verbose_name='Users')),
            ],
            options={
                'verbose_name': 'Choice',
                'verbose_name_plural': 'Choices',
            },
        ),
    ]
