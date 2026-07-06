import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import ProfileModal from '../components/common/ProfileModal';
import { useLeadsContext } from '../context/LeadsContext';
import { loadSettings } from '../utils/settings';

export default function Navbar({ title, onMenuClick, searchValue, onSearchChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, settingsVersion, currentUser } = useLeadsContext();

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('[data-profile-menu]')) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchChange(value) {
    onSearchChange(value);
    if (location.pathname !== '/leads' && value.trim()) {
      navigate(`/leads?search=${encodeURIComponent(value.trim())}`);
    }
  }

  function closeMenu() {
    setDropdownOpen(false);
  }

  function openProfile() {
    closeMenu();
    setProfileOpen(true);
  }

  function openSettings() {
    closeMenu();
    navigate('/settings');
  }

  function handleSignOut() {
    closeMenu();
    signOut();
    navigate('/login');
  }

  const showNotifications = loadSettings().desktopNotifications;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-md lg:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="truncate text-base font-semibold text-slate-900 lg:text-lg">{title}</h1>

        <div className="hidden flex-1 md:flex md:max-w-md lg:max-w-lg xl:max-w-xl md:mx-4">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/15"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            className="relative rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            onClick={() => navigate('/leads')}
            title="View leads"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {showNotifications && settingsVersion >= 0 && (
              <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-600 text-[8px] font-bold text-white">3</span>
            )}
          </button>

          <div className="relative" data-profile-menu>
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1 pl-1 pr-2 transition-colors hover:border-slate-300"
            >
              <Avatar name={currentUser.name} size="sm" />
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
                <p className="text-xs text-slate-500 leading-tight">{currentUser.role}</p>
              </div>
              <svg className={`hidden h-3 w-3 text-slate-400 transition-transform sm:block ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg animate-dropdown">
                <button type="button" onClick={openProfile} className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">
                  My Profile
                </button>
                <button type="button" onClick={openSettings} className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">
                  Account Settings
                </button>
                <hr className="my-1 border-slate-100" />
                <button type="button" onClick={handleSignOut} className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
