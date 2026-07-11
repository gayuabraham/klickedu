import { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { InlineFormField, fieldClass } from '../common/FormField';
import NotesSection from './NotesSection';
import FollowUpSection from './FollowUpSection';
import StudentTimeline from './StudentTimeline';
import { useLeadsContext } from '../../context/LeadsContext';
import { LEAD_STATUSES, getStatusFromStage, getStageFromStatus } from '../../constants/leadStatus';
import { LEAD_STAGES, getSubStages, getDefaultSubStage, DEFAULT_STAGE } from '../../constants/leadStages';
import {
  LEAD_SOURCES,
  PREFERRED_COUNTRIES,
  PREFERRED_INTAKES,
  PREFERRED_COURSES,
  PRIORITIES,
  withCurrentOption,
} from '../../constants/options';
import { validateLeadForm } from '../../utils/validation';
import { fetchTimeline, fetchFollowUps } from '../../services/leadService';

function SummaryField({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function buildFormFromLead(lead) {
  const stage = lead.stage || DEFAULT_STAGE;
  const subStages = getSubStages(stage);
  const preferredCountry = lead.preferredCountry || lead.country || '';
  const preferredCourse = lead.preferredCourse || '';

  return {
    ...lead,
    stage,
    subStage:
      lead.subStage && subStages.includes(lead.subStage)
        ? lead.subStage
        : getDefaultSubStage(stage),
    preferredCountry,
    preferredCourse,
    preferredIntake: lead.preferredIntake || '',
    leadSource: lead.leadSource || 'Website',
    priority: (lead.priority || 'medium').toLowerCase(),
    assignedEmployee: lead.assignedEmployee || '',
    status: lead.status || 'New',
    createdDate: lead.createdDate || '',
  };
}

export default function LeadDetailsModal({
  lead,
  employees,
  isOpen,
  onClose,
  onSave,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onScheduleFollowUp,
  onCompleteFollowUp,
}) {
  const { currentUser } = useLeadsContext();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [sideLoading, setSideLoading] = useState(false);

  const loadSideData = useCallback(async (leadId) => {
    setSideLoading(true);
    try {
      const [activities, followUpList] = await Promise.all([
        fetchTimeline(leadId),
        fetchFollowUps(leadId),
      ]);
      setTimeline(activities);
      setFollowups(followUpList);
    } catch {
      setTimeline([]);
      setFollowups([]);
    } finally {
      setSideLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !lead) return;

    setForm(buildFormFromLead(lead));
    setErrors({});
    setSaving(false);
    loadSideData(lead.id);
  }, [lead, isOpen, loadSideData]);

  if (!lead) return null;

  const subStageOptions = getSubStages(form.stage);
  const countryOptions = withCurrentOption(PREFERRED_COUNTRIES, form.preferredCountry);
  const intakeOptions = withCurrentOption(PREFERRED_INTAKES, form.preferredIntake);
  const courseOptions = withCurrentOption(PREFERRED_COURSES, form.preferredCourse);
  const sourceOptions = withCurrentOption(LEAD_SOURCES, form.leadSource);
  const employeeOptions = withCurrentOption(employees, form.assignedEmployee);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  // Status and Stage stay in sync so either field can be saved alone
  function handleStatusChange(status) {
    const { stage, subStage } = getStageFromStatus(status);
    setForm((prev) => ({
      ...prev,
      status,
      stage,
      subStage,
    }));
  }

  function handleStageChange(stage) {
    const subStage = getDefaultSubStage(stage);
    setForm((prev) => ({
      ...prev,
      stage,
      subStage,
      status: getStatusFromStage(stage, subStage),
    }));
  }

  async function handleAddNote(text) {
    await onAddNote(lead.id, {
      text,
      createdBy: currentUser.name,
    });
    await loadSideData(lead.id);
  }

  async function handleUpdateNote(noteId, text) {
    await onUpdateNote(lead.id, noteId, { text });
    await loadSideData(lead.id);
  }

  async function handleDeleteNote(noteId) {
    await onDeleteNote(lead.id, noteId);
    await loadSideData(lead.id);
  }

  async function handleScheduleFollowUp(followupData) {
    await onScheduleFollowUp(lead.id, {
      ...followupData,
      createdBy: currentUser.name,
    });
    await loadSideData(lead.id);
  }

  async function handleCompleteFollowUp(followupId) {
    await onCompleteFollowUp(lead.id, followupId);
    await loadSideData(lead.id);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLeadForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    try {
      await onSave({
        ...lead,
        ...form,
        country: form.preferredCountry,
        preferredCountry: form.preferredCountry,
        preferredCourse: form.preferredCourse,
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Details"
      subtitle={form.name || lead.name}
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
          <div className="flex items-start gap-4">
            <Avatar name={form.name || lead.name} size="xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <SummaryField label="Name" required error={errors.name}>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={fieldClass(errors.name)}
                />
              </SummaryField>
              <SummaryField label="Email" required error={errors.email}>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={fieldClass(errors.email)}
                />
              </SummaryField>
              <SummaryField label="Status">
                <select
                  value={form.status || ''}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={fieldClass(false)}
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </SummaryField>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-5">
          <InlineFormField label="Mobile" required error={errors.mobile}>
            <input
              type="text"
              value={form.mobile || ''}
              onChange={(e) => handleChange('mobile', e.target.value)}
              className={fieldClass(errors.mobile)}
              placeholder="10-digit number"
            />
          </InlineFormField>
          <InlineFormField label="Address">
            <textarea
              value={form.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className={`${fieldClass(false)} resize-none`}
            />
          </InlineFormField>
          <InlineFormField label="Preferred Country">
            <select
              value={form.preferredCountry || ''}
              onChange={(e) => handleChange('preferredCountry', e.target.value)}
              className={fieldClass(false)}
            >
              <option value="">Select country</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </InlineFormField>
          <InlineFormField label="Preferred Course">
            <select
              value={form.preferredCourse || ''}
              onChange={(e) => handleChange('preferredCourse', e.target.value)}
              className={fieldClass(false)}
            >
              <option value="">Select course</option>
              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </InlineFormField>
          <InlineFormField label="Preferred Intake">
            <select
              value={form.preferredIntake || ''}
              onChange={(e) => handleChange('preferredIntake', e.target.value)}
              className={fieldClass(false)}
            >
              <option value="">Select intake</option>
              {intakeOptions.map((intake) => (
                <option key={intake} value={intake}>
                  {intake}
                </option>
              ))}
            </select>
          </InlineFormField>
          <InlineFormField label="Lead Source">
            <select
              value={form.leadSource || ''}
              onChange={(e) => handleChange('leadSource', e.target.value)}
              className={fieldClass(false)}
            >
              {sourceOptions.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </InlineFormField>
          <InlineFormField label="Priority">
            <select
              value={form.priority || 'medium'}
              onChange={(e) => handleChange('priority', e.target.value)}
              className={fieldClass(false)}
            >
              {PRIORITIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </InlineFormField>
          <InlineFormField label="Stage">
            <select
              value={form.stage || DEFAULT_STAGE}
              onChange={(e) => handleStageChange(e.target.value)}
              className={fieldClass(false)}
            >
              {LEAD_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </InlineFormField>
          <InlineFormField label="Sub Stage">
            <select
              value={form.subStage || ''}
              onChange={(e) => handleChange('subStage', e.target.value)}
              className={fieldClass(false)}
            >
              {subStageOptions.map((subStage) => (
                <option key={subStage} value={subStage}>
                  {subStage}
                </option>
              ))}
            </select>
          </InlineFormField>
          <InlineFormField label="Assigned Employee">
            <select
              value={form.assignedEmployee || ''}
              onChange={(e) => handleChange('assignedEmployee', e.target.value)}
              className={fieldClass(false)}
            >
              <option value="">Unassigned</option>
              {employeeOptions.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </InlineFormField>
          <InlineFormField label="Created Date">
            <input
              type="date"
              value={form.createdDate || ''}
              onChange={(e) => handleChange('createdDate', e.target.value)}
              className={fieldClass(false)}
            />
          </InlineFormField>
        </div>

        {errors.form && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.form}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 max-md:flex-col-reverse">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving} className="max-md:min-h-11 max-md:w-full">
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="max-md:min-h-11 max-md:w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      <NotesSection
        notes={lead.notes || []}
        onAdd={handleAddNote}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
      />

      <FollowUpSection
        followups={followups}
        loading={sideLoading}
        onSchedule={handleScheduleFollowUp}
        onComplete={handleCompleteFollowUp}
      />

      <StudentTimeline activities={timeline} loading={sideLoading} />
    </Modal>
  );
}
