"""
Fill all leads with realistic Study Abroad mock values.
Run: python manage.py update_study_abroad_data
"""

from django.core.management.base import BaseCommand

from leads.models import Employee, Lead
from leads.stage_config import STAGE_SUB_STAGES

COUNTRIES = [
    'Canada',
    'Australia',
    'United Kingdom',
    'USA',
    'Germany',
    'Ireland',
    'New Zealand',
]

COURSES = [
    'Data Science',
    'Artificial Intelligence',
    'Cyber Security',
    'Computer Science',
    'Business Analytics',
    'MBA',
    'UI/UX Design',
    'Digital Marketing',
    'Full Stack Development',
]

INTAKES = [
    'January 2026',
    'May 2026',
    'September 2026',
    'January 2027',
]

LEAD_SOURCES = [
    'Website',
    'Instagram',
    'Facebook',
    'Google Ads',
    'Referral',
    'Walk-In',
    'Education Fair',
    'WhatsApp',
]

PRIORITIES = ['high', 'medium', 'low']

# Spread students across the workflow so dashboard cards look real
STAGE_WEIGHTS = [
    ('New Enquiry', 10),
    ('Counselling', 8),
    ('Course Selection', 6),
    ('Application', 9),
    ('Offer Letter', 5),
    ('Financial', 4),
    ('Visa', 6),
    ('Travel', 3),
    ('Enrolled', 3),
    ('Closed', 1),
]


def build_stage_list(total):
    stages = []
    for stage, count in STAGE_WEIGHTS:
        stages.extend([stage] * count)
    # Pad or trim to match lead count
    while len(stages) < total:
        stages.append('New Enquiry')
    return stages[:total]


class Command(BaseCommand):
    help = 'Update all leads with realistic Study Abroad mock data'

    def handle(self, *args, **options):
        employees = list(Employee.objects.filter(status='active').order_by('id'))
        if not employees:
            self.stderr.write('No active employees found.')
            return

        leads = list(Lead.objects.order_by('id'))
        if not leads:
            self.stderr.write('No leads found.')
            return

        stages = build_stage_list(len(leads))

        for index, lead in enumerate(leads):
            stage = stages[index]
            sub_stages = STAGE_SUB_STAGES.get(stage, [''])
            sub_stage = sub_stages[index % len(sub_stages)]

            lead.preferred_country = COUNTRIES[index % len(COUNTRIES)]
            lead.preferred_course = COURSES[index % len(COURSES)]
            lead.preferred_intake = INTAKES[index % len(INTAKES)]
            lead.lead_source = LEAD_SOURCES[index % len(LEAD_SOURCES)]
            lead.priority = PRIORITIES[index % len(PRIORITIES)]
            lead.stage = stage
            lead.sub_stage = sub_stage
            lead.assigned_employee = employees[index % len(employees)]
            lead.save()

        self.stdout.write(self.style.SUCCESS(
            f'Updated {len(leads)} students with Study Abroad mock data.'
        ))
