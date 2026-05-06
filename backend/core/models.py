from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    ROLE_CHOICES = (
        ("user", "User"),
        ("admin", "Admin"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    location = models.CharField(max_length=120, blank=True, default="")
    age = models.PositiveIntegerField(null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    experience = models.CharField(max_length=255, blank=True, default="")
    skills = models.JSONField(default=list, blank=True)
    is_logged_in = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} ({self.role})"


class Job(models.Model):
    TYPE_CHOICES = (
        ("Full-time", "Full-time"),
        ("Part-time", "Part-time"),
        ("Contract", "Contract"),
        ("Daily", "Daily"),
    )

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=120)
    location = models.CharField(max_length=120, blank=True, default="")
    pay = models.CharField(max_length=120, blank=True, default="")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="Full-time")
    posted_by = models.CharField(max_length=120, default="Admin")
    description = models.TextField(blank=True, default="")
    skills = models.JSONField(default=list, blank=True)
    applicants = models.PositiveIntegerField(default=0)
    trending = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Application(models.Model):
    STATUS_CHOICES = (
        ("Pending", "Pending"),
        ("Pass", "Pass"),
        ("Fail", "Fail"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    )

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    user_id = models.CharField(max_length=64)
    user_name = models.CharField(max_length=255)
    user_email = models.EmailField()
    user_role = models.CharField(max_length=20, default="user")
    user_age = models.PositiveIntegerField(null=True, blank=True)
    user_dob = models.CharField(max_length=32, blank=True, default="")
    user_experience = models.CharField(max_length=255, blank=True, default="")
    user_skills = models.JSONField(default=list, blank=True)
    phone = models.CharField(max_length=32, blank=True, default="")
    village = models.CharField(max_length=120, blank=True, default="")
    note = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    score = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user_name} - {self.job.title}"
