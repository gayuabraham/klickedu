"""
Create demo counselors (and sample students if the database is empty).
Run: python manage.py seed_demo_data
"""

from django.core.management.base import BaseCommand

from leads.models import Employee, Lead
from leads.stage_config import STAGE_SUB_STAGES


DEMO_EMPLOYEES = [
    {
        'employee_id': 'EMP001',
        'name': 'Arun Moorthy',
        'email': 'arun.moorthy@klickedu.com',
        'phone': '9876543210',
        'designation': 'Education Counselor',
    },
    {
        'employee_id': 'EMP002',
        'name': 'Priya Nair',
        'email': 'priya.nair@klickedu.com',
        'phone': '9876543211',
        'designation': 'Senior Counselor',
    },
    {
        'employee_id': 'EMP003',
        'name': 'Karthik Rajan',
        'email': 'karthik.rajan@klickedu.com',
        'phone': '9876543212',
        'designation': 'Education Counselor',
    },
]


class Command(BaseCommand):
    help = 'Seed demo employees and a few sample students if missing'

    def handle(self, *args, **options):
        created_employees = 0

        for data in DEMO_EMPLOYEES:
            _, was_created = Employee.objects.get_or_create(
                employee_id=data['employee_id'],
                defaults={
                    'name': data['name'],
                    'email': data['email'],
                    'phone': data['phone'],
                    'designation': data['designation'],
                    'status': 'active',
                },
            )
            if was_created:
                created_employees += 1

        employees = list(Employee.objects.filter(status='active').order_by('id'))
        self.stdout.write(f'Employees ready: {len(employees)} (new: {created_employees})')

        if Lead.objects.exists():
            self.stdout.write('Leads already exist — skipping sample students.')
            return

        if not employees:
            self.stderr.write('No employees available to assign sample students.')
            return

        sample_students = [
            ('Ananya', 'Krishnan', 'Canada', 'Data Science', 'January 2026', 'Website', 'New Enquiry'),
            ('Rohan', 'Menon', 'Australia', 'MBA', 'May 2026', 'Instagram', 'Counselling'),
            ('Meera', 'Iyer', 'United Kingdom', 'Computer Science', 'September 2026', 'Referral', 'Application'),
            ('Vikram', 'Suresh', 'Germany', 'Artificial Intelligence', 'January 2027', 'Google Ads', 'Offer Letter'),
            ('Divya', 'Raj', 'USA', 'Cyber Security', 'May 2026', 'WhatsApp', 'Visa'),
        ]

        for index, (first, last, country, course, intake, source, stage) in enumerate(sample_students):
            sub_stages = STAGE_SUB_STAGES.get(stage, [''])
            Lead.objects.create(
                lead_id=f'LEAD{index + 1:04d}',
                first_name=first,
                last_name=last,
                mobile=f'9{800000000 + index}',
                email=f'{first.lower()}.{last.lower()}@email.com',
                preferred_country=country,
                preferred_course=course,
                preferred_intake=intake,
                lead_source=source,
                priority='medium',
                stage=stage,
                sub_stage=sub_stages[0],
                assigned_employee=employees[index % len(employees)],
            )

        self.stdout.write(self.style.SUCCESS(
            f'Created {len(sample_students)} sample students.'
        ))
