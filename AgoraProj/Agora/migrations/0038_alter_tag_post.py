# Generated by Django 5.0.4 on 2024-05-12 01:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Agora', '0037_remove_tag_posts_tag_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='post',
            field=models.ManyToManyField(related_name='tags', to='Agora.post'),
        ),
    ]
