export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateMobile(mobile) {
  const digits = mobile.replace(/\D/g, '');
  return digits.length === 10;
}

export function validateLeadForm({ name, email, mobile }) {
  const errors = {};

  if (!name?.trim()) {
    errors.name = 'Name is required';
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
