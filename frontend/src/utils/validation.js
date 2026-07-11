export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateMobile(mobile) {
  const digits = String(mobile || '').replace(/\D/g, '');
  return digits.length === 10;
}

export function validateLeadForm({ name, email, mobile, firstName, lastName }) {
  const errors = {};
  const displayName = name || `${firstName || ''} ${lastName || ''}`.trim();

  if (!displayName) {
    errors.name = 'Name is required';
    if (!firstName?.trim()) errors.firstName = 'First name is required';
  }

  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!mobile?.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!validateMobile(mobile)) {
    errors.mobile = 'Mobile must contain exactly 10 digits';
  }

  return errors;
}

/** Validate one step of the Study Abroad student form */
export function validateStudentStep(step, form) {
  const errors = {};

  if (step === 0) {
    if (!form.firstName?.trim()) errors.firstName = 'First name is required';
    if (!form.lastName?.trim()) errors.lastName = 'Last name is required';

    if (!form.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!form.mobile?.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!validateMobile(form.mobile)) {
      errors.mobile = 'Mobile must contain exactly 10 digits';
    }

    if (form.alternateMobile?.trim() && !validateMobile(form.alternateMobile)) {
      errors.alternateMobile = 'Alternate mobile must contain exactly 10 digits';
    }
  }

  if (step === 1) {
    if (form.graduationYear) {
      const year = Number(form.graduationYear);
      const currentYear = new Date().getFullYear();
      if (Number.isNaN(year) || year < 1980 || year > currentYear + 5) {
        errors.graduationYear = 'Enter a valid graduation year';
      }
    }
  }

  if (step === 2) {
    if (!form.preferredCountry?.trim()) {
      errors.preferredCountry = 'Preferred country is required';
    }
    if (!form.preferredCourse?.trim()) {
      errors.preferredCourse = 'Preferred course is required';
    }
  }

  if (step === 4) {
    if (form.passportAvailable && !form.passportNumber?.trim()) {
      errors.passportNumber = 'Passport number is required when passport is available';
    }
  }

  if (step === 5) {
    if (form.followupDate) {
      const selected = new Date(form.followupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors.followupDate = 'Follow-up date cannot be in the past';
      }
    }
  }

  return errors;
}

export function validateProfileForm({ name, email, phone, role, department }) {
  const errors = {};

  if (!name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (!validateMobile(phone)) {
    errors.phone = 'Phone must contain exactly 10 digits';
  }

  if (!role?.trim()) {
    errors.role = 'Role is required';
  }

  if (!department?.trim()) {
    errors.department = 'Department is required';
  }

  return errors;
}
