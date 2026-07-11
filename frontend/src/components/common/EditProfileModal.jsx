import { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Avatar from './Avatar';
import { FormField, fieldClass } from './FormField';
import { validateProfileForm } from '../../utils/validation';

export default function EditProfileModal({ user, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen || !user) return;
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
    });
    setErrors({});
  }, [isOpen, user]);

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

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProfileForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave(form);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" subtitle="Update your account details" size="lg">
      <div className="mb-5 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
        <Avatar name={form.name || user?.name} size="lg" />
        <div>
          <p className="text-sm font-medium text-slate-900">{form.name || 'Your name'}</p>
          <p className="text-xs text-slate-500">{form.role || 'Role'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Full Name" required error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={fieldClass(errors.name)}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Email" required error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={fieldClass(errors.email)}
            />
          </FormField>
          <FormField label="Phone" required error={errors.phone}>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={fieldClass(errors.phone)}
              placeholder="10-digit number"
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Role" required error={errors.role}>
            <input
              type="text"
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className={fieldClass(errors.role)}
            />
          </FormField>
          <FormField label="Department" required error={errors.department}>
            <input
              type="text"
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className={fieldClass(errors.department)}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 max-md:flex-col-reverse">
          <Button type="button" variant="secondary" onClick={onClose} className="max-md:min-h-11 max-md:w-full">
            Cancel
          </Button>
          <Button type="submit" className="max-md:min-h-11 max-md:w-full">Save profile</Button>
        </div>
      </form>
    </Modal>
  );
}
