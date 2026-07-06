import { CURRENT_USER as DEFAULT_USER } from '../constants/appUser';

const STORAGE_KEY = 'klickedu-user-profile';

function withFirstName(user) {
  const firstName = user.name?.trim().split(/\s+/)[0] || user.firstName || '';
  return { ...user, firstName };
}

export function loadUserProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return withFirstName({ ...DEFAULT_USER, ...saved });
  } catch {
    return withFirstName({ ...DEFAULT_USER });
  }
}

export function saveUserProfile(profile) {
  const normalized = withFirstName(profile);
  const { firstName, ...toSave } = normalized;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  return normalized;
}
