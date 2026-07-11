import django.db.models.deletion
from django.db import migrations, models


def fill_employee_ids(apps, schema_editor):
    Employee = apps.get_model('leads', 'Employee')
    for index, employee in enumerate(Employee.objects.order_by('id'), start=1):
        employee.employee_id = f'EMP{index:03d}'
        employee.save(update_fields=['employee_id'])


def fill_lead_ids_and_names(apps, schema_editor):
    Lead = apps.get_model('leads', 'Lead')
    for index, lead in enumerate(Lead.objects.order_by('id'), start=1):
        lead.lead_id = f'LEAD{index:04d}'

        # Split old full_name into first_name / last_name
        full_name = (getattr(lead, 'full_name', '') or '').strip()
        if full_name:
            parts = full_name.split(' ', 1)
            lead.first_name = parts[0][:100]
            lead.last_name = (parts[1] if len(parts) > 1 else '')[:100]
        else:
            lead.first_name = 'Unknown'
            lead.last_name = ''

        # Move old course into preferred_course when present
        old_course = getattr(lead, 'course_interested', '') or ''
        if old_course and not lead.preferred_course:
            lead.preferred_course = old_course

        lead.save()


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0002_update_stage_choices'),
    ]

    operations = [
        # --- Employee updates ---
        migrations.AddField(
            model_name='employee',
            name='employee_id',
            field=models.CharField(max_length=20, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='employee',
            name='status',
            field=models.CharField(
                choices=[('active', 'Active'), ('inactive', 'Inactive')],
                default='active',
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name='employee',
            name='designation',
            field=models.CharField(default='Education Counselor', max_length=100),
        ),
        migrations.RunPython(fill_employee_ids, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='employee',
            name='employee_id',
            field=models.CharField(max_length=20, unique=True),
        ),

        # --- Lead: add new fields (nullable / with defaults first) ---
        migrations.AddField(
            model_name='lead',
            name='lead_id',
            field=models.CharField(max_length=20, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='lead',
            name='first_name',
            field=models.CharField(default='Unknown', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lead',
            name='last_name',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lead',
            name='gender',
            field=models.CharField(
                blank=True,
                choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')],
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='lead',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='lead',
            name='alternate_mobile',
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AddField(
            model_name='lead',
            name='highest_qualification',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AddField(
            model_name='lead',
            name='graduation_year',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='lead',
            name='cgpa_percentage',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name='lead',
            name='current_college',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='lead',
            name='work_experience',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='lead',
            name='preferred_country',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='lead',
            name='preferred_city',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='lead',
            name='preferred_course',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AddField(
            model_name='lead',
            name='preferred_university',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='lead',
            name='preferred_intake',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='lead',
            name='english_test',
            field=models.CharField(
                blank=True,
                choices=[
                    ('none', 'None'),
                    ('ielts', 'IELTS'),
                    ('toefl', 'TOEFL'),
                    ('pte', 'PTE'),
                    ('duolingo', 'Duolingo'),
                    ('other', 'Other'),
                ],
                default='none',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='lead',
            name='english_score',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name='lead',
            name='budget',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='lead',
            name='loan_required',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='lead',
            name='passport_available',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='lead',
            name='passport_number',
            field=models.CharField(blank=True, max_length=50),
        ),

        # Backfill lead_id, names, preferred_course from old data
        migrations.RunPython(fill_lead_ids_and_names, migrations.RunPython.noop),

        migrations.AlterField(
            model_name='lead',
            name='lead_id',
            field=models.CharField(max_length=20, unique=True),
        ),

        # Remove old Lead fields
        migrations.RemoveField(
            model_name='lead',
            name='full_name',
        ),
        migrations.RemoveField(
            model_name='lead',
            name='course_interested',
        ),
        migrations.RemoveField(
            model_name='lead',
            name='status',
        ),

        # Rename Note -> LeadNote
        migrations.RenameModel(
            old_name='Note',
            new_name='LeadNote',
        ),

        # Create FollowUp
        migrations.CreateModel(
            name='FollowUp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('followup_date', models.DateField()),
                ('followup_type', models.CharField(
                    choices=[
                        ('call', 'Call'),
                        ('email', 'Email'),
                        ('whatsapp', 'WhatsApp'),
                        ('meeting', 'Meeting'),
                        ('other', 'Other'),
                    ],
                    default='call',
                    max_length=20,
                )),
                ('remarks', models.TextField(blank=True)),
                ('status', models.CharField(
                    choices=[
                        ('pending', 'Pending'),
                        ('completed', 'Completed'),
                        ('missed', 'Missed'),
                        ('cancelled', 'Cancelled'),
                    ],
                    default='pending',
                    max_length=20,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='followups',
                    to='leads.employee',
                )),
                ('lead', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='followups',
                    to='leads.lead',
                )),
            ],
        ),
    ]
