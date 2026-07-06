import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeadsProvider } from './context/LeadsContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Employees from './pages/Employees';
import Settings from './pages/Settings';
import Login from './pages/Login';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <LeadsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="employees" element={<Employees />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<PlaceholderPage title="Help & Support" />} />
          </Route>
        </Routes>
      </LeadsProvider>
    </BrowserRouter>
  );
}
