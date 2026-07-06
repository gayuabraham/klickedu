import { NavLink } from 'react-router-dom';
import KlickEduLogo from '../components/common/KlickEduLogo';

const iconClass = 'h-5 w-5 shrink-0';

const mainNav = [
  { to: '/', label: 'Dashboard', end: true, icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { to: '/leads', label: 'Leads', icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { to: '/employees', label: 'Employees', icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  { to: '/settings', label: 'Settings', icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

const bottomNav = {
  to: '/help',
  label: 'Help & Support',
  icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

function NavItem({ item, onClose }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      title={item.label}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 lg:px-3.5 ${
          isActive
            ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-100'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      {item.icon}
      <span className="hidden lg:inline truncate">{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-16 lg:w-56 xl:w-60 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-center border-b border-slate-100 px-2 pt-4 pb-3 lg:h-16 lg:justify-start lg:px-5 lg:pt-5">
          <KlickEduLogo variant="sidebar" />
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3 lg:px-3">
          {mainNav.map((item) => (
            <NavItem key={item.to} item={item} onClose={onClose} />
          ))}
        </nav>

        <div className="space-y-1 border-t border-slate-100 p-2 lg:p-3">
          <NavItem item={bottomNav} onClose={onClose} />
          <div className="hidden lg:block rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
            <p className="text-xs font-semibold text-slate-700">Need assistance?</p>
            <p className="mt-1 text-xs leading-snug text-slate-500">
              Contact support for lead management help.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
