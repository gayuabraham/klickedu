from django.contrib import admin

from .models import Employee, Lead, LeadNote, ActivityLog, FollowUp


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'name', 'email', 'designation', 'status')
    search_fields = ('name', 'email', 'employee_id')


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('lead_id', 'first_name', 'last_name', 'email', 'stage', 'assigned_employee')
    list_filter = ('stage', 'priority', 'lead_source')
    search_fields = ('first_name', 'last_name', 'email', 'mobile', 'lead_id')


@admin.register(LeadNote)
class LeadNoteAdmin(admin.ModelAdmin):
    list_display = ('lead', 'created_by', 'created_at')


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('lead', 'activity', 'created_by', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(FollowUp)
class FollowUpAdmin(admin.ModelAdmin):
    list_display = ('lead', 'followup_date', 'followup_type', 'status', 'created_by')
    list_filter = ('status', 'followup_type')
