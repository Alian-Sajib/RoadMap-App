# Generated by Django 5.1.1 on 2025-06-22 17:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='productitems',
            options={'verbose_name_plural': 'Product Items'},
        ),
        migrations.RemoveField(
            model_name='productitems',
            name='upvote',
        ),
        migrations.AddField(
            model_name='productitems',
            name='upvotes',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='productitems',
            name='description',
            field=models.TextField(max_length=400),
        ),
        migrations.AlterField(
            model_name='productitems',
            name='status',
            field=models.CharField(choices=[('1', 'In Progress'), ('2', 'In Review'), ('3', 'Completed')], default='1', max_length=50),
        ),
        migrations.CreateModel(
            name='Upvote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.productitems')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'item')},
            },
        ),
    ]
