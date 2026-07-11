from django.core.exceptions import ValidationError
from django.db import models

from .stage_config import (
    STAGE_CHOICES,
    STAGE_NEW_ENQUIRY,
    get_default_sub_stage,
    is_valid_sub_stage,
)


class Employee(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    employee_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    designation = models.CharField(max_length=100, default='Education Counselor')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f'{self.employee_id} - {self.name}'


class Lead(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    ENGLISH_TEST_CHOICES = [
        ('none', 'None'),
        ('ielts', 'IELTS'),
        ('toefl', 'TOEFL'),
        ('pte', 'PTE'),
        ('duolingo', 'Duolingo'),
        ('other', 'Other'),
    ]

    lead_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    mobile = models.CharField(max_length=15)
    alternate_mobile = models.CharField(max_length=15, blank=True)
    email = models.EmailField()

    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)

    highest_qualification = models.CharField(max_length=150, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    cgpa_percentage = models.CharField(max_length=20, blank=True)
    current_college = models.CharField(max_length=200, blank=True)
    work_experience = models.CharField(max_length=100, blank=True)

    preferred_country = models.CharField(max_length=100, blank=True)
    preferred_city = models.CharField(max_length=100, blank=True)
    preferred_course = models.CharField(max_length=150, blank=True)
    preferred_university = models.CharField(max_length=200, blank=True)
    preferred_intake = models.CharField(max_length=50, blank=True)

    english_test = models.CharField(
        max_length=20,
        choices=ENGLISH_TEST_CHOICES,
        default='none',
        blank=True,
    )
    english_score = models.CharField(max_length=20, blank=True)

    budget = models.CharField(max_length=50, blank=True)
    loan_required = models.BooleanField(default=False)

    passport_available = models.BooleanField(default=False)
    passport_number = models.CharField(max_length=50, blank=True)

    lead_source = models.CharField(max_length=100, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    stage = models.CharField(
        max_length=50,
        choices=STAGE_CHOICES,
        default=STAGE_NEW_ENQUIRY,
    )
    sub_stage = models.CharField(max_length=100, blank=True)

    assigned_employee = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='leads',
    )

    next_followup_date = models.DateField(null=True, blank=True)
    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        """Make sure sub_stage matches the selected stage."""
        super().clean()

        if self.stage and self.sub_stage and not is_valid_sub_stage(self.stage, self.sub_stage):
            raise ValidationError({
                'sub_stage': f'"{self.sub_stage}" is not valid for stage "{self.stage}".'
            })

    def save(self, *args, **kwargs):
        if self.stage and not self.sub_stage:
            self.sub_stage = get_default_sub_stage(self.stage)

        if self.stage and self.sub_stage and not is_valid_sub_stage(self.stage, self.sub_stage):
            self.sub_stage = get_default_sub_stage(self.stage)

        super().save(*args, **kwargs)

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    def __str__(self):
        return f'{self.lead_id} - {self.full_name}'


class LeadNote(models.Model):
    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name='notes',
    )
    note = models.TextField()
    created_by = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notes',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Note for {self.lead.full_name}'


class ActivityLog(models.Model):
    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name='activities',
    )
    activity = models.TextField()
    created_by = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activities',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Activity for {self.lead.full_name}'


class FollowUp(models.Model):
    FOLLOWUP_TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
        ('meeting', 'Meeting'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('missed', 'Missed'),
        ('cancelled', 'Cancelled'),
    ]

    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name='followups',
    )
    followup_date = models.DateField()
    followup_type = models.CharField(
        max_length=20,
        choices=FOLLOWUP_TYPE_CHOICES,
        default='call',
    )
    remarks = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
    )
    created_by = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='followups',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Follow-up for {self.lead.full_name} on {self.followup_date}'
