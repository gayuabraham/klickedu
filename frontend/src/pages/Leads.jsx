import { useEffect, useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { useLeadFilters } from '../hooks/useLeadFilters';
import { exportLeadsToCsv } from '../utils/exportLeads';
import LeadsToolbar from '../components/leads/LeadsToolbar';
import LeadFilters from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import LeadPagination from '../components/leads/LeadPagination';
import LeadDetailsModal from '../components/leads/LeadDetailsModal';
import StudentFormModal from '../components/leads/StudentFormModal';
import { TableSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

export default function Leads() {
  const {
    leads,
    employees,
    updateLead,
    addLead,
    addNote,
    updateNote,
    deleteNote,
    scheduleFollowUp,
    markFollowUpCompleted,
    setNavbar,
    searchValue,
    onSearchChange,
    reload: reloadAllLeads,
  } = useLeadsContext();

  const {
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
    reload: reloadFilteredLeads,
  } = useLeadFilters(searchValue);

  const [viewLeadId, setViewLeadId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    setNavbar({ title: 'Leads', search: filters.search });
    if (searchValue !== filters.search) {
      onSearchChange(filters.search);
    }
  }, [filters.search, searchValue, setNavbar, onSearchChange]);

  const viewLead = filteredLeads.find((lead) => lead.id === viewLeadId)
    || leads.find((lead) => lead.id === viewLeadId)
    || null;

  function openStudent(lead) {
    setViewLeadId(lead.id);
  }

  async function handleExport() {
    try {
      await exportLeadsToCsv();
    } catch (err) {
      alert(err.message || 'Failed to export leads. Please try again.');
    }
  }

  async function handleAddLead(leadData) {
    await addLead(leadData);
    setAddOpen(false);
    reloadFilteredLeads();
    reloadAllLeads();
  }

  async function handleUpdateLead(updatedLead) {
    await updateLead(updatedLead);
    reloadFilteredLeads();
  }

  async function handleAddNote(leadId, noteData) {
    await addNote(leadId, noteData);
    reloadFilteredLeads();
  }

  async function handleUpdateNote(leadId, noteId, updatedNote) {
    await updateNote(leadId, noteId, updatedNote);
    reloadFilteredLeads();
  }

  async function handleDeleteNote(leadId, noteId) {
    await deleteNote(leadId, noteId);
    reloadFilteredLeads();
  }

  async function handleScheduleFollowUp(leadId, followupData) {
    await scheduleFollowUp(leadId, followupData);
  }

  async function handleCompleteFollowUp(leadId, followupId) {
    await markFollowUpCompleted(leadId, followupId);
  }

  function handleRetry() {
    reloadFilteredLeads();
    reloadAllLeads();
  }

  if (loading && filteredLeads.length === 0) {
    return (
      <div className="w-full space-y-4">
        <TableSkeleton />
      </div>
    );
  }

  if (error && filteredLeads.length === 0) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="mx-auto w-full space-y-4 sm:space-y-5 max-md:space-y-3">
      <LeadsToolbar
        totalCount={leads.length}
        filteredCount={filteredLeads.length}
        onExport={handleExport}
        onAddLead={() => setAddOpen(true)}
      />

      <LeadFilters
        filters={filters}
        employees={employees}
        filterOptions={filterOptions}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        onSearchChange={onSearchChange}
        onExport={handleExport}
        onAddLead={() => setAddOpen(true)}
        exportDisabled={leads.length === 0}
      />

      {filteredLeads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <LeadTable
            leads={paginatedLeads}
            sort={sort}
            onSort={updateSort}
            onView={openStudent}
            onEdit={openStudent}
          />
          <LeadPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredLeads.length}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
          />
        </>
      )}

      <LeadDetailsModal
        lead={viewLead}
        employees={employees}
        isOpen={!!viewLeadId}
        onClose={() => setViewLeadId(null)}
        onSave={handleUpdateLead}
        onAddNote={handleAddNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        onScheduleFollowUp={handleScheduleFollowUp}
        onCompleteFollowUp={handleCompleteFollowUp}
      />

      <StudentFormModal
        employees={employees}
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddLead}
      />
    </div>
  );
}
