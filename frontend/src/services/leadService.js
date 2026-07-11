import api from './api';
import { getErrorMessage } from '../utils/errors';
import { buildLeadQueryParams } from '../utils/leadFilters';
import { PRIORITIES } from '../constants/options';
import { getStatusFromStage, getStageFromStatus } from '../constants/leadStatus';
// Cache employees so we can map names <-> database IDs
let employeeCache = [];

function toDateString(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function getEmployeePkByName(name) {
  const employee = employeeCache.find((item) => item.name === name);
  return employee ? employee.id : null;
}

function getEmployeeNameByPk(id) {
  const employee = employeeCache.find((item) => item.id === id);
  return employee ? employee.name : '';
}

/** Build a display name from first + last name */
function buildFullName(lead) {
  return `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
}

/** Split a UI full name into first_name / last_name for the API */
function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { first_name: 'Unknown', last_name: '' };
  }
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(' '),
  };
}

function mapNoteToUi(note) {
  return {
    id: String(note.id),
    text: note.note,
    createdDate: toDateString(note.created_at),
    createdBy: getEmployeeNameByPk(note.created_by) || 'Unknown',
  };
}

/** Map Django Lead JSON → shape expected by existing React UI */
function mapLeadToUi(lead, notes = []) {
  const stage = lead.stage || 'New Enquiry';
  const subStage = lead.sub_stage || '';
  const preferredCountry = lead.preferred_country || '';
  const preferredCourse = lead.preferred_course || '';

  return {
    id: String(lead.id),
    leadId: lead.lead_id || '',
    name: buildFullName(lead),
    firstName: lead.first_name || '',
    lastName: lead.last_name || '',
    gender: lead.gender || '',
    dateOfBirth: toDateString(lead.date_of_birth),
    mobile: lead.mobile || '',
    alternateMobile: lead.alternate_mobile || '',
    email: lead.email || '',
    address: lead.address || '',
    city: lead.city || '',
    district: lead.district || '',
    state: lead.state || '',
    homeCountry: lead.country || '',
    // Preferred destination (used by filters / edit dropdowns)
    country: preferredCountry,
    preferredCountry,
    preferredCity: lead.preferred_city || '',
    preferredCourse,
    preferredUniversity: lead.preferred_university || '',
    preferredIntake: lead.preferred_intake || '',
    highestQualification: lead.highest_qualification || '',
    graduationYear: lead.graduation_year ? String(lead.graduation_year) : '',
    cgpaPercentage: lead.cgpa_percentage || '',
    currentCollege: lead.current_college || '',
    workExperience: lead.work_experience || '',
    englishTest: lead.english_test || 'none',
    englishScore: lead.english_score || '',
    budget: lead.budget || '',
    loanRequired: Boolean(lead.loan_required),
    passportAvailable: Boolean(lead.passport_available),
    passportNumber: lead.passport_number || '',
    leadSource: lead.lead_source || 'Website',
    assignedEmployee: getEmployeeNameByPk(lead.assigned_employee),
    status: getStatusFromStage(stage, subStage),
    priority: lead.priority || 'medium',
    stage,
    subStage,
    remarks: lead.remarks || '',
    nextFollowupDate: toDateString(lead.next_followup_date),
    createdDate: toDateString(lead.created_at),
    notes: notes.map(mapNoteToUi),
  };
}

/** Map UI lead form/object → Django Lead payload */
function mapLeadToApi(leadData) {
  const names = leadData.firstName || leadData.lastName
    ? {
        first_name: (leadData.firstName || '').trim() || 'Unknown',
        last_name: (leadData.lastName || '').trim(),
      }
    : splitName(leadData.name);

  // Prefer explicit stage/subStage from the form; status is only a fallback
  const fromStatus = getStageFromStatus(leadData.status);
  const stage = leadData.stage || fromStatus.stage;
  const subStage = leadData.subStage || fromStatus.subStage;
  const preferredCountry = leadData.preferredCountry || leadData.country || '';
  const preferredCourse = leadData.preferredCourse || '';

  const payload = {
    first_name: names.first_name,
    last_name: names.last_name,
    gender: leadData.gender || '',
    date_of_birth: leadData.dateOfBirth || null,
    mobile: leadData.mobile,
    alternate_mobile: leadData.alternateMobile || '',
    email: leadData.email,
    address: leadData.address || '',
    city: leadData.city || '',
    district: leadData.district || '',
    state: leadData.state || '',
    country: leadData.homeCountry || '',
    highest_qualification: leadData.highestQualification || '',
    graduation_year: leadData.graduationYear ? Number(leadData.graduationYear) : null,
    cgpa_percentage: leadData.cgpaPercentage || '',
    current_college: leadData.currentCollege || '',
    work_experience: leadData.workExperience || '',
    preferred_country: preferredCountry,
    preferred_city: leadData.preferredCity || '',
    preferred_course: preferredCourse,
    preferred_university: leadData.preferredUniversity || '',
    preferred_intake: leadData.preferredIntake || '',
    english_test: leadData.englishTest || 'none',
    english_score: leadData.englishScore || '',
    budget: leadData.budget || '',
    loan_required: Boolean(leadData.loanRequired),
    passport_available: Boolean(leadData.passportAvailable),
    passport_number: leadData.passportNumber || '',
    lead_source: leadData.leadSource || 'Website',
    assigned_employee: getEmployeePkByName(leadData.assignedEmployee),
    priority: (leadData.priority || 'medium').toLowerCase(),
    stage,
    sub_stage: subStage,
    next_followup_date: leadData.followupDate || leadData.nextFollowupDate || null,
    remarks: leadData.remarks || '',
  };

  if (leadData.leadId) {
    payload.lead_id = leadData.leadId;
  }

  return payload;
}

async function ensureEmployeeCache() {
  if (employeeCache.length > 0) return;
  const response = await api.get('/employees/');
  employeeCache = response.data;
}

/** Fetch employees, leads, and notes from Django — return UI-shaped data */export async function fetchLeads(filters = {}) {
  try {
    const params = buildLeadQueryParams(filters);

    const [employeesRes, leadsRes, notesRes] = await Promise.all([
      api.get('/employees/'),
      api.get('/leads/', { params }),
      api.get('/lead-notes/'),
    ]);

    employeeCache = employeesRes.data;

    const notesByLeadId = {};
    for (const note of notesRes.data) {
      const leadId = note.lead;
      if (!notesByLeadId[leadId]) notesByLeadId[leadId] = [];
      notesByLeadId[leadId].push(note);
    }

    const leads = leadsRes.data.map((lead) =>
      mapLeadToUi(lead, notesByLeadId[lead.id] || [])
    );

    const employees = employeeCache
      .filter((employee) => employee.status !== 'inactive')
      .map((employee) => employee.name);

    return { leads, employees };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Build filter dropdown options from Django */
export async function fetchFilterOptions() {
  try {
    const response = await api.get('/leads/filter-options/');
    const data = response.data;

    return {
      courses: data.courses || data.preferred_courses || [],
      countries: data.countries || data.preferred_countries || [],
      intakes: data.preferred_intakes || [],
      lead_sources: data.lead_sources || [],
      priorities: data.priorities?.length ? data.priorities : PRIORITIES,
      stages: data.stages || [],
      sub_stages: data.sub_stages || {},
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Create a new lead (and optional follow-up) */
export async function createLead(leadData) {
  try {
    await ensureEmployeeCache();

    const payload = mapLeadToApi(leadData);
    payload.lead_id = leadData.leadId || `LEAD${Date.now().toString().slice(-8)}`;
    // Round Robin on the backend assigns the counselor
    payload.assigned_employee = null;

    const response = await api.post('/leads/', payload);
    const createdLead = response.data;

    // Create follow-up if the form provided a date
    if (leadData.followupDate) {
      await api.post('/followups/', {
        lead: createdLead.id,
        followup_date: leadData.followupDate,
        followup_type: leadData.followupType || 'call',
        remarks: leadData.followupRemarks || '',
        status: leadData.followupStatus || 'pending',
        created_by: createdLead.assigned_employee,
      });
    }

    return mapLeadToUi(createdLead, []);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Update an existing lead */
export async function updateLeadOnServer(leadData) {
  try {
    await ensureEmployeeCache();

    const payload = mapLeadToApi(leadData);
    if (leadData.leadId) {
      payload.lead_id = leadData.leadId;
    }

    const response = await api.patch(`/leads/${leadData.id}/`, payload);
    const mapped = mapLeadToUi(response.data, []);
    mapped.notes = leadData.notes || [];
    return mapped;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Create a note for a lead */
export async function createNote(leadId, noteData) {
  try {
    await ensureEmployeeCache();

    const payload = {
      lead: Number(leadId),
      note: noteData.text,
      created_by: getEmployeePkByName(noteData.createdBy),
    };
    const response = await api.post('/lead-notes/', payload);
    return mapNoteToUi(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Update a note */
export async function updateNoteOnServer(noteId, text) {
  try {
    await ensureEmployeeCache();
    const response = await api.patch(`/lead-notes/${noteId}/`, { note: text });
    return mapNoteToUi(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Delete a note */
export async function deleteNoteOnServer(noteId) {
  try {
    await api.delete(`/lead-notes/${noteId}/`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

function mapFollowUpToUi(followup) {
  return {
    id: String(followup.id),
    leadId: String(followup.lead),
    followupDate: toDateString(followup.followup_date),
    followupType: followup.followup_type || 'call',
    remarks: followup.remarks || '',
    status: followup.status || 'pending',
    createdBy: getEmployeeNameByPk(followup.created_by) || 'Unknown',
    createdAt: followup.created_at || '',
  };
}

function mapActivityToUi(activity) {
  return {
    id: String(activity.id),
    leadId: String(activity.lead),
    activity: activity.activity || '',
    createdBy: getEmployeeNameByPk(activity.created_by) || 'System',
    createdAt: activity.created_at || '',
  };
}

/** Fetch timeline activities for a student */
export async function fetchTimeline(leadId) {
  try {
    await ensureEmployeeCache();
    const response = await api.get('/activity-logs/', {
      params: { lead: leadId },
    });
    return response.data.map(mapActivityToUi);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Fetch follow-ups for a student */
export async function fetchFollowUps(leadId) {
  try {
    await ensureEmployeeCache();
    const response = await api.get('/followups/', {
      params: { lead: leadId },
    });
    return response.data.map(mapFollowUpToUi);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Schedule a follow-up */
export async function createFollowUp(leadId, followupData) {
  try {
    await ensureEmployeeCache();
    const payload = {
      lead: Number(leadId),
      followup_date: followupData.followupDate,
      followup_type: followupData.followupType || 'call',
      remarks: followupData.remarks || '',
      status: followupData.status || 'pending',
      created_by: getEmployeePkByName(followupData.createdBy),
    };
    const response = await api.post('/followups/', payload);
    return mapFollowUpToUi(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Mark a follow-up as completed */
export async function completeFollowUp(followupId) {
  try {
    const response = await api.patch(`/followups/${followupId}/`, {
      status: 'completed',
    });
    return mapFollowUpToUi(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
