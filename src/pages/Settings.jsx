import { useEffect, useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { CURRENT_USER } from '../constants/appUser';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { loadSettings, saveSettings } from '../utils/settings';

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/25"
      />
    </label>
  );
}

function Section({ title, children }) {
  return (
    <div className="card-elevated p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { setNavbar, reload, refreshSettings } = useLeadsContext();
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNavbar({ title: 'Settings' });
  }, [setNavbar]);

  function updateSetting(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(settings);
    refreshSettings();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
        <p className="mt-0.5 text-xs text-slate-500">Manage your account and app preferences</p>
      </div>

      <Section title="Account">
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
          <Avatar name={CURRENT_USER.name} size="lg" />
          <div>
            <p className="font-medium text-slate-900">{CURRENT_USER.name}</p>
            <p className="text-xs text-slate-500">{CURRENT_USER.role}</p>
          </div>
        </div>
      </Section>

      <Section title="Preferences">
        <div id="preferences">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">Leads per page</label>
          <select
            value={settings.pageSize}
            onChange={(e) => updateSetting('pageSize', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/15"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
          </select>
        </div>

        <Toggle
          label="Email notifications"
          description="Get alerts when new leads are assigned"
          checked={settings.emailNotifications}
          onChange={(value) => updateSetting('emailNotifications', value)}
        />

        <Toggle
          label="Desktop notifications"
          description="Show in-app notification badge for updates"
          checked={settings.desktopNotifications}
          onChange={(value) => updateSetting('desktopNotifications', value)}
        />
      </Section>

      <Section title="Data">
        <p className="text-xs text-slate-500">Reload lead data from the server.</p>
        <Button variant="secondary" size="sm" onClick={reload}>
          Refresh leads
        </Button>
      </Section>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save changes</Button>
        {saved && <span className="text-xs font-medium text-emerald-600">Settings saved</span>}
      </div>
    </div>
  );
}
