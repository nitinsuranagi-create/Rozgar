from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0004_profile_is_logged_in"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="location",
            field=models.CharField(blank=True, default="", max_length=120),
        ),
    ]
