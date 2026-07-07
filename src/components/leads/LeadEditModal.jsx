import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { LEAD_STATUSES } from '../../constants/leadStatus';
import { validateLeadForm } from '../../utils/validation';

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function fieldClass(hasError) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 max-md:min-h-11 ${
    hasError ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-violet-400'
  }`;
}

const EMPTY_FORM = {
  name: '',
  mobile: '',
  email: '',
  courseInterested: '',
  status: 'New',
  assignedEmployee: '',
};

export default function LeadEditModal({
  lead,
  employees,
  isOpen,
  onClose,
  onSave,
  mode = 'edit',
}) {
  const isCreate = mode === 'create';
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (isCreate) {
      setForm({
        ...EMPTY_FORM,
        assignedEmployee: employees[0] || '',
      });
    } else if (lead) {
      setForm({
        name: lead.name,
        mobile: lead.mobile,
        email: lead.email,
        courseInterested: lead.courseInterested || '',
        status: lead.status,
        assignedEmployee: lead.assignedEmployee,
      });
    }
    setErrors({});
  }, [lead, isOpen, isCreate, employees]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLeadForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (isCreate) {
      onSave(form);
    } else {
      onSave({ ...lead, ...form });
    }
    onClose();
  }

  if (!isCreate && !lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreate ? 'Add Lead' : 'Edit Lead'}
      subtitle={isCreate ? 'Create a new lead in the pipeline' : lead.name}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Full Name" required error={errors.name}>
          <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={fieldClass(errors.name)} />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Mobile" required error={errors.mobile}>
            <input type="text" value={form.mobile} onChange={(e) => handleChange('mobile', e.target.value)} className={fieldClass(errors.mobile)} placeholder="10-digit number" />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={fieldClass(errors.email)} />
          </FormField>
        </div>

        <FormField label="Course Interested">
          <input type="text" value={form.courseInterested} onChange={(e) => handleChange('courseInterested', e.target.value)} className={fieldClass(false)} placeholder="e.g. Full Stack Development" />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Status">
            <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className={fieldClass(false)}>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Assigned Employee">
            <select value={form.assignedEmployee} onChange={(e) => handleChange('assignedEmployee', e.target.value)} className={fieldClass(false)}>
              {employees.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 max-md:flex-col-reverse">
          <Button type="button" variant="secondary" onClick={onClose} className="max-md:min-h-11 max-md:w-full">Cancel</Button>
          <Button type="submit" className="max-md:min-h-11 max-md:w-full">
            {isCreate ? 'Add Lead' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
