# Generated by Django 5.0.4 on 2024-05-06 11:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Agora', '0026_friend_date_friend_request_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='frien_request',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Agora.friend'),
        ),
    ]
