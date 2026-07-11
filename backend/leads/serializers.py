from rest_framework import serializers

from .models import Employee, Lead, LeadNote, ActivityLog, FollowUp


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class LeadNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadNote
        fields = '__all__'
        read_only_fields = ['created_at']


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'
        read_only_fields = ['created_at']


class FollowUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowUp
        fields = '__all__'
        read_only_fields = ['created_at']
