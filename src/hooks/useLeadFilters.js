import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isDateInRange } from '../utils/dateUtils';
import { loadSettings } from '../utils/settings';

const EMPTY_FILTERS = {
  search: '',
  status: '',
  employee: '',
  startDate: '',
  endDate: '',
};

export function useLeadFilters(leads, navbarSearch = '') {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    status: searchParams.get('status') || '',
    employee: searchParams.get('employee') || '',
    search: searchParams.get('search') || navbarSearch || '',
  }));
  const [pageSize, setPageSize] = useState(() => loadSettings().pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const status = searchParams.get('status') || '';
    const employee = searchParams.get('employee') || '';
    const search = searchParams.get('search') || navbarSearch || '';

    setFilters((prev) => {
      if (prev.status === status && prev.employee === employee && prev.search === search) {
        return prev;
      }
      return { ...prev, status, employee, search };
    });
    setCurrentPage(1);
  }, [searchParams, navbarSearch]);

  const filteredLeads = useMemo(() => {
    const search = filters.search.toLowerCase().trim();

    return leads.filter((lead) => {
      if (search) {
        const matchesSearch =
          lead.name.toLowerCase().includes(search) ||
          lead.mobile.includes(search) ||
          lead.email.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      if (filters.status && lead.status !== filters.status) return false;
      if (filters.employee && lead.assignedEmployee !== filters.employee) return false;
      if (!isDateInRange(lead.createdDate, filters.startDate, filters.endDate)) return false;

      return true;
    });
  }, [leads, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));

  const paginatedLeads = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize, totalPages]);

  function syncUrl(nextFilters) {
    const params = {};
    if (nextFilters.status) params.status = nextFilters.status;
    if (nextFilters.employee) params.employee = nextFilters.employee;
    if (nextFilters.search) params.search = nextFilters.search;
    setSearchParams(params, { replace: true });
  }

  function updateFilter(key, value) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'status' || key === 'search' || key === 'employee') {
        syncUrl(next);
      }
      return next;
    });
    setCurrentPage(1);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  }

  function changePageSize(size) {
    setPageSize(size);
    setCurrentPage(1);
  }

  function goToPage(page) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }

  return {
    filters,
    filteredLeads,
    paginatedLeads,
    currentPage,
    pageSize,
    totalPages,
    updateFilter,
    resetFilters,
    changePageSize,
    goToPage,
  };
}
