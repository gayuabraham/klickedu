import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadSettings } from '../utils/settings';
import { fetchLeads, fetchFilterOptions } from '../services/leadService';
import {
  EMPTY_FILTERS,
  DEFAULT_SORT,
  getDefaultFilterOptions,
  mergeFilterOptions,
  filtersFromSearchParams,
  filtersToUrlParams,
  filtersEqual,
} from '../utils/leadFilters';

export function useLeadFilters(navbarSearch = '') {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() =>
    filtersFromSearchParams(searchParams, navbarSearch)
  );
  const [sort, setSort] = useState(() => ({
    sort: searchParams.get('sort') || DEFAULT_SORT.sort,
    order: searchParams.get('order') || DEFAULT_SORT.order,
  }));
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filterOptions, setFilterOptions] = useState(getDefaultFilterOptions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(() => loadSettings().pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  // Keep filters in sync with the URL
  useEffect(() => {
    const next = filtersFromSearchParams(searchParams, navbarSearch);
    setFilters((prev) => (filtersEqual(prev, next) ? prev : next));
    setCurrentPage(1);
  }, [searchParams, navbarSearch]);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const options = await fetchFilterOptions();
        if (!cancelled) {
          setFilterOptions(mergeFilterOptions(options));
        }
      } catch {
        if (!cancelled) {
          setFilterOptions(getDefaultFilterOptions());
        }
      }
    }

    loadOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadFilteredLeads = useCallback(async (activeFilters, activeSort) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchLeads({
        ...activeFilters,
        sort: activeSort.sort,
        order: activeSort.order,
      });
      setFilteredLeads(data.leads);
    } catch (err) {
      setError(err.message || 'Failed to filter leads');
      setFilteredLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = filters.search ? 300 : 0;
    const timer = setTimeout(() => {
      loadFilteredLeads(filters, sort);
    }, delay);

    return () => clearTimeout(timer);
  }, [filters, sort, loadFilteredLeads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));

  const paginatedLeads = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize, totalPages]);

  function syncUrl(nextFilters, nextSort = sort) {
    setSearchParams(filtersToUrlParams(nextFilters, nextSort), { replace: true });
  }

  function updateFilter(key, value) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'stage') {
        next.subStage = '';
      }
      syncUrl(next, sort);
      return next;
    });
    setCurrentPage(1);
  }

  function updateSort(sortKey) {
    setSort((prev) => {
      const next = {
        sort: sortKey,
        order: prev.sort === sortKey && prev.order === 'asc' ? 'desc' : 'asc',
      };
      if (sortKey === 'created_date' && prev.sort !== sortKey) {
        next.order = 'desc';
      }
      syncUrl(filters, next);
      return next;
    });
    setCurrentPage(1);
  }

  function resetFilters() {
    setFilters({ ...EMPTY_FILTERS });
    setSort({ ...DEFAULT_SORT });
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
    filterOptions,
    sort,
    filteredLeads,
    paginatedLeads,
    currentPage,
    pageSize,
    totalPages,
    loading,
    error,
    updateFilter,
    updateSort,
    resetFilters,
    changePageSize,
    goToPage,
    reload: () => loadFilteredLeads(filters, sort),
  };
}
