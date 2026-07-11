import {
  PREFERRED_COUNTRIES,
  PREFERRED_INTAKES,
  LEAD_SOURCES,
  PRIORITIES,
} from '../constants/options';
import { LEAD_STAGES, getSubStages } from '../constants/leadStages';

/** Default empty filter values (also used for Reset). */
export const EMPTY_FILTERS = {
  search: '',
  stage: '',
  subStage: '',
  employee: '',
  leadSource: '',
  priority: '',
  course: '',
  country: '',
  preferredIntake: '',
  startDate: '',
  endDate: '',
  status: '',
};

export const DEFAULT_SORT = {
  sort: 'created_date',
  order: 'desc',
};

/** Fallback dropdown options when the API has not loaded yet. */
export function getDefaultFilterOptions() {
  return {
    courses: [],
    countries: PREFERRED_COUNTRIES,
    intakes: PREFERRED_INTAKES,
    lead_sources: LEAD_SOURCES,
    priorities: PRIORITIES,
    stages: LEAD_STAGES,
    sub_stages: {},
  };
}

/** Merge API filter-options with local defaults. */
export function mergeFilterOptions(apiOptions = {}) {
  const defaults = getDefaultFilterOptions();

  return {
    courses: apiOptions.courses?.length ? apiOptions.courses : defaults.courses,
    countries: apiOptions.countries?.length ? apiOptions.countries : defaults.countries,
    intakes: apiOptions.intakes?.length ? apiOptions.intakes : defaults.intakes,
    lead_sources: apiOptions.lead_sources?.length
      ? apiOptions.lead_sources
      : defaults.lead_sources,
    priorities: apiOptions.priorities?.length ? apiOptions.priorities : defaults.priorities,
    stages: apiOptions.stages?.length ? apiOptions.stages : defaults.stages,
    sub_stages: apiOptions.sub_stages || {},
  };
}

/** Read filters from the URL search params. */
export function filtersFromSearchParams(searchParams, navbarSearch = '') {
  return {
    search: searchParams.get('search') || navbarSearch || '',
    stage: searchParams.get('stage') || '',
    subStage: searchParams.get('subStage') || '',
    employee: searchParams.get('employee') || '',
    leadSource: searchParams.get('leadSource') || '',
    priority: searchParams.get('priority') || '',
    course: searchParams.get('course') || '',
    country: searchParams.get('country') || '',
    preferredIntake: searchParams.get('preferredIntake') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    status: searchParams.get('status') || '',
  };
}

/** Build URL search params from the current filters + sort. */
export function filtersToUrlParams(filters, sort = DEFAULT_SORT) {
  const params = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });

  if (sort.sort) params.sort = sort.sort;
  if (sort.order) params.order = sort.order;

  return params;
}

export function filtersEqual(a, b) {
  return Object.keys(EMPTY_FILTERS).every((key) => a[key] === b[key]);
}

export function hasActiveFilters(filters) {
  return Object.entries(filters).some(([key, value]) => {
    if (key === 'status') return false;
    return Boolean(value);
  });
}

/** Sub-stage options for the selected stage (empty when no stage). */
export function getSubStageFilterOptions(stage) {
  return stage ? getSubStages(stage) : [];
}

/**
 * Map UI filter keys → Django query params.
 * Used by the leads API and kept in one place so URL + API stay aligned.
 */
export function buildLeadQueryParams(filters = {}) {
  const mapping = {
    search: filters.search,
    stage: filters.stage,
    sub_stage: filters.subStage,
    country: filters.country,
    course: filters.course,
    preferred_intake: filters.preferredIntake || filters.intake,
    lead_source: filters.leadSource,
    employee: filters.employee,
    priority: filters.priority,
    start_date: filters.startDate,
    end_date: filters.endDate,
    status: filters.status,
    sort: filters.sort,
    order: filters.order,
  };

  const params = {};
  Object.entries(mapping).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      params[key] = value;
    }
  });

  return params;
}
