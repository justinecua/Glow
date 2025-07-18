# Generated by Django 5.0.6 on 2024-11-15 06:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Agora', '0051_rename_age_account_age_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='account',
            old_name='Age',
            new_name='age',
        ),
        migrations.RenameField(
            model_name='account',
            old_name='Birthday',
            new_name='birthday',
        ),
        migrations.RenameField(
            model_name='account',
            old_name='UIAppearance',
            new_name='ui_appearance',
        ),
        migrations.AlterField(
            model_name='post',
            name='dateTime',
            field=models.DateTimeField(max_length=75, null=True),
        ),
    ]
