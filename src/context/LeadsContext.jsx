import { createContext, useContext, useState, useCallback } from 'react';
import { useLeads } from '../hooks/useLeads';

const AUTH_KEY = 'klickedu-auth';

const LeadsContext = createContext(null);

function readAuthState() {
  return sessionStorage.getItem(AUTH_KEY) !== 'false';
}

export function LeadsProvider({ children }) {
  const leadsState = useLeads();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [searchValue, setSearchValue] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(readAuthState);
  const [settingsVersion, setSettingsVersion] = useState(0);

  const setNavbar = useCallback(({ title, search }) => {
    setPageTitle(title);
    if (search !== undefined) setSearchValue(search);
  }, []);

  const onSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const signIn = useCallback(() => {
    sessionStorage.setItem(AUTH_KEY, 'true');
    setIsSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.setItem(AUTH_KEY, 'false');
    setIsSignedIn(false);
    setSearchValue('');
  }, []);

  const refreshSettings = useCallback(() => {
    setSettingsVersion((v) => v + 1);
  }, []);

  return (
    <LeadsContext.Provider
      value={{
        ...leadsState,
        pageTitle,
        searchValue,
        onSearchChange,
        setNavbar,
        isSignedIn,
        signIn,
        signOut,
        settingsVersion,
        refreshSettings,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeadsContext() {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeadsContext must be used within LeadsProvider');
  }
  return context;
}
