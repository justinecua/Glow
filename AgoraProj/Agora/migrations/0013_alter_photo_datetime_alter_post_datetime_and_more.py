# Generated by Django 5.0.4 on 2024-05-03 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Agora', '0012_rename_post_id_video_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='dateTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='dateTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='video',
            name='dateTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
