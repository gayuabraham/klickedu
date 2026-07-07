import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import NotesSection from './NotesSection';
import { useLeadsContext } from '../../context/LeadsContext';
import { LEAD_STATUSES } from '../../constants/leadStatus';
import { validateLeadForm } from '../../utils/validation';

const LEAD_SOURCES = ['Website', 'Instagram', 'Facebook', 'Google Ads', 'Webinar', 'Referral', 'Walk-in'];

function FormField({ label, required, error, children }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 border-b border-slate-50 py-3.5 last:border-0 sm:grid-cols-3 sm:gap-4 sm:items-start">
      <label className="pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="sm:col-span-2">
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

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

function fieldClass(hasError) {
  return `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
    hasError ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-violet-400'
  }`;
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
}) {
  const { currentUser } = useLeadsContext();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen || !lead) return;

    setForm({
      name: lead.name,
      email: lead.email,
      mobile: lead.mobile,
      address: lead.address || '',
      courseInterested: lead.courseInterested || '',
      leadSource: lead.leadSource || 'Website',
      assignedEmployee: lead.assignedEmployee,
      status: lead.status,
      createdDate: lead.createdDate,
    });
    setErrors({});
  }, [lead, isOpen]);

  if (!lead) return null;

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAddNote(text) {
    onAddNote(lead.id, {
      id: `n${lead.id}-${Date.now()}`,
      text,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: currentUser.name,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLeadForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave({ ...lead, ...form });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" subtitle={form.name || lead.name} size="xl">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
          <div className="flex items-start gap-4">
            <Avatar name={form.name || lead.name} size="xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <SummaryField label="Name" required error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={fieldClass(errors.name)}
                />
              </SummaryField>
              <SummaryField label="Email" required error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={fieldClass(errors.email)}
                />
              </SummaryField>
              <SummaryField label="Status">
                <select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
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
          <FormField label="Mobile" required error={errors.mobile}>
            <input
              type="text"
              value={form.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              className={fieldClass(errors.mobile)}
              placeholder="10-digit number"
            />
          </FormField>
          <FormField label="Address">
            <textarea
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className={`${fieldClass(false)} resize-none`}
            />
          </FormField>
          <FormField label="Interested Course">
            <input
              type="text"
              value={form.courseInterested}
              onChange={(e) => handleChange('courseInterested', e.target.value)}
              className={fieldClass(false)}
            />
          </FormField>
          <FormField label="Lead Source">
            <select
              value={form.leadSource}
              onChange={(e) => handleChange('leadSource', e.target.value)}
              className={fieldClass(false)}
            >
              {LEAD_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Assigned Employee">
            <select
              value={form.assignedEmployee}
              onChange={(e) => handleChange('assignedEmployee', e.target.value)}
              className={fieldClass(false)}
            >
              {employees.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Created Date">
            <input
              type="date"
              value={form.createdDate}
              onChange={(e) => handleChange('createdDate', e.target.value)}
              className={fieldClass(false)}
            />
          </FormField>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 max-md:flex-col-reverse">
          <Button type="button" variant="secondary" onClick={onClose} className="max-md:min-h-11 max-md:w-full">
            Cancel
          </Button>
          <Button type="submit" className="max-md:min-h-11 max-md:w-full">
            Save Changes
          </Button>
        </div>
      </form>

      <NotesSection
        notes={lead.notes || []}
        onAdd={handleAddNote}
        onUpdate={(noteId, text) => onUpdateNote(lead.id, noteId, { text })}
        onDelete={(noteId) => onDeleteNote(lead.id, noteId)}
      />
    </Modal>
  );
}
