# Generated by Django 5.0.4 on 2024-05-01 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Agora', '0007_account_age_account_birthday_account_uiappearance_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Audience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('audience', models.CharField(max_length=150)),
                ('description', models.CharField(max_length=255)),
            ],
        ),
    ]
