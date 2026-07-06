const STORAGE_KEY = 'klickedu-settings';

export const DEFAULT_SETTINGS = {
  pageSize: 10,
  emailNotifications: true,
  desktopNotifications: true,
};

export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
