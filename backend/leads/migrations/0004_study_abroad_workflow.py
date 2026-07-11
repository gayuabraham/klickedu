# Study Abroad workflow stages + remap existing lead data

from django.db import migrations, models


def remap_stages(apps, schema_editor):
    Lead = apps.get_model('leads', 'Lead')

    # Old stage/sub_stage → new stage/sub_stage
    mapping = {
        ('New Lead', 'Fresh Lead'): ('New Enquiry', 'Fresh Enquiry'),
        ('New Lead', 'Follow-up Pending'): ('New Enquiry', 'Contact Attempted'),
        ('New Lead', ''): ('New Enquiry', 'Fresh Enquiry'),
        ('Application', 'Documents Pending'): ('Application', 'Documents Pending'),
        ('Application', 'Submitted'): ('Application', 'Application Submitted'),
        ('Application', 'Under Review'): ('Application', 'Under Review'),
        ('Application', 'Offer Letter Received'): ('Offer Letter', 'Conditional Offer'),
        ('Application', ''): ('Application', 'Documents Pending'),
        ('Converted', 'Visa Process'): ('Visa', 'Visa Applied'),
        ('Converted', 'Visa Approved'): ('Visa', 'Visa Approved'),
        ('Converted', 'Enrolled'): ('Enrolled', 'Joined University'),
        ('Converted', ''): ('Enrolled', 'Joined University'),
    }

    for lead in Lead.objects.all():
        key = (lead.stage or '', lead.sub_stage or '')
        if key in mapping:
            lead.stage, lead.sub_stage = mapping[key]
            lead.save(update_fields=['stage', 'sub_stage'])
        elif lead.stage == 'New Lead':
            lead.stage = 'New Enquiry'
            lead.sub_stage = lead.sub_stage or 'Fresh Enquiry'
            lead.save(update_fields=['stage', 'sub_stage'])
        elif lead.stage == 'Converted':
            lead.stage = 'Enrolled'
            lead.sub_stage = 'Joined University'
            lead.save(update_fields=['stage', 'sub_stage'])


def reverse_remap(apps, schema_editor):
    Lead = apps.get_model('leads', 'Lead')

    reverse = {
        ('New Enquiry', 'Fresh Enquiry'): ('New Lead', 'Fresh Lead'),
        ('New Enquiry', 'Contact Attempted'): ('New Lead', 'Follow-up Pending'),
        ('New Enquiry', 'Connected'): ('New Lead', 'Fresh Lead'),
        ('Application', 'Application Submitted'): ('Application', 'Submitted'),
        ('Offer Letter', 'Conditional Offer'): ('Application', 'Offer Letter Received'),
        ('Offer Letter', 'Unconditional Offer'): ('Application', 'Offer Letter Received'),
        ('Visa', 'Visa Applied'): ('Converted', 'Visa Process'),
        ('Visa', 'Visa Approved'): ('Converted', 'Visa Approved'),
        ('Visa', 'Documents Pending'): ('Converted', 'Visa Process'),
        ('Enrolled', 'Joined University'): ('Converted', 'Enrolled'),
        ('Enrolled', 'Orientation Done'): ('Converted', 'Enrolled'),
    }

    for lead in Lead.objects.all():
        key = (lead.stage or '', lead.sub_stage or '')
        if key in reverse:
            lead.stage, lead.sub_stage = reverse[key]
            lead.save(update_fields=['stage', 'sub_stage'])
        elif lead.stage not in ('New Lead', 'Application', 'Converted'):
            lead.stage = 'New Lead'
            lead.sub_stage = 'Fresh Lead'
            lead.save(update_fields=['stage', 'sub_stage'])


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0003_study_abroad_models'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lead',
            name='stage',
            field=models.CharField(
                choices=[
                    ('New Enquiry', 'New Enquiry'),
                    ('Counselling', 'Counselling'),
                    ('Course Selection', 'Course Selection'),
                    ('Application', 'Application'),
                    ('Offer Letter', 'Offer Letter'),
                    ('Financial', 'Financial'),
                    ('Visa', 'Visa'),
                    ('Travel', 'Travel'),
                    ('Enrolled', 'Enrolled'),
                    ('Closed', 'Closed'),
                ],
                default='New Enquiry',
                max_length=50,
            ),
        ),
        migrations.RunPython(remap_stages, reverse_remap),
    ]
