# Generated by Django 5.0.4 on 2024-05-08 12:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Agora', '0031_alter_notification_friend_request'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=255)),
                ('dateTime', models.CharField(max_length=100)),
                ('account', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Agora.account')),
                ('post', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Agora.post')),
            ],
        ),
    ]
