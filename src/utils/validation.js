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
