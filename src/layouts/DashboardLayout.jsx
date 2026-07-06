import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { LeadsProvider, useLeadsContext } from '../context/LeadsContext';

function LayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pageTitle, searchValue, onSearchChange, isSignedIn } = useLeadsContext();

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          title={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <LeadsProvider>
      <LayoutContent />
    </LeadsProvider>
  );
}
