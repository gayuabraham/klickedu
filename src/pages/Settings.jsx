import { useEffect, useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import EditProfileModal from '../components/common/EditProfileModal';
import { loadSettings, saveSettings } from '../utils/settings';

function Switch({ checked, onChange, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:ring-offset-2 ${
        checked ? 'bg-violet-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-slate-100 py-4 last:border-0 last:pb-0 first:pt-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Card({ title, subtitle, icon, children, className = '' }) {
  return (
    <div className={`card-elevated flex flex-col ${className}`}>
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 px-5 py-4 sm:px-6 sm:py-5">{children}</div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

const icons = {
  user: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  display: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  bell: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  database: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  ),
};

export default function Settings() {
  const { setNavbar, reload, refreshSettings, leads, lastUpdated, currentUser, updateUserProfile } = useLeadsContext();
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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

  const formattedUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
          <p className="mt-0.5 text-xs text-slate-500">Manage your account, notifications, and application preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-400" />
        <div className="p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={currentUser.name} size="xl" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{currentUser.name}</h3>
                <p className="text-sm text-slate-500">{currentUser.role}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                  {currentUser.department}
                </span>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit profile
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Email" value={currentUser.email} />
            <InfoItem label="Phone" value={currentUser.phone} />
            <InfoItem label="Member since" value="Jan 2024" />
          </div>
        </div>
      </div>

      <EditProfileModal
        user={currentUser}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={updateUserProfile}
      />

      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        <Card title="Display" subtitle="Table and list preferences" icon={icons.display} className="lg:col-span-1">
          <SettingRow label="Leads per page" description="Number of rows shown on the leads table">
            <select
              value={settings.pageSize}
              onChange={(e) => updateSetting('pageSize', Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/15"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </SettingRow>
          <SettingRow label="Default view" description="Landing page after sign in">
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">
              Dashboard
            </span>
          </SettingRow>
        </Card>

        <Card title="Notifications" subtitle="How you receive updates" icon={icons.bell} className="lg:col-span-1">
          <SettingRow label="Email notifications" description="Alerts when new leads are assigned to you">
            <Switch
              checked={settings.emailNotifications}
              onChange={(value) => updateSetting('emailNotifications', value)}
            />
          </SettingRow>
          <SettingRow label="Desktop notifications" description="In-app badge for lead activity">
            <Switch
              checked={settings.desktopNotifications}
              onChange={(value) => updateSetting('desktopNotifications', value)}
            />
          </SettingRow>
        </Card>

        <Card title="Data & sync" subtitle="Lead records and refresh" icon={icons.database} className="lg:col-span-1">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-violet-50/50 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-violet-700">{leads.length}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">Total leads</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-slate-700">{formattedUpdated}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">Last synced</p>
            </div>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-slate-500">
            Reload lead data from the server to pick up the latest assignments and status changes.
          </p>
          <Button variant="secondary" size="sm" onClick={reload} className="w-full sm:w-auto">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh leads
          </Button>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <Card title="Security" subtitle="Account protection" icon={icons.user}>
          <SettingRow label="Password" description="Last changed 3 months ago">
            <Button variant="secondary" size="sm" disabled>
              Change password
            </Button>
          </SettingRow>
          <SettingRow label="Two-factor authentication" description="Add an extra layer of security">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Coming soon
            </span>
          </SettingRow>
        </Card>

        <Card title="Workspace" subtitle="Organization details" icon={icons.display}>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem label="Organization" value="KlickEdu" />
            <InfoItem label="Plan" value="Sales CRM" />
            <InfoItem label="Region" value="Tamil Nadu, India" />
            <InfoItem label="Timezone" value="IST (UTC+5:30)" />
          </div>
        </Card>
      </div>
    </div>
  );
}
