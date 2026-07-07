import { useEffect, useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { useLeadFilters } from '../hooks/useLeadFilters';
import { exportLeadsToCsv } from '../utils/exportLeads';
import LeadsToolbar from '../components/leads/LeadsToolbar';
import LeadFilters from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import LeadPagination from '../components/leads/LeadPagination';
import LeadDetailsModal from '../components/leads/LeadDetailsModal';
import LeadEditModal from '../components/leads/LeadEditModal';
import { TableSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

export default function Leads() {
  const {
    leads,
    employees,
    loading,
    error,
    reload,
    updateLead,
    addLead,
    addNote,
    updateNote,
    deleteNote,
    setNavbar,
    searchValue,
    onSearchChange,
  } = useLeadsContext();

  const {
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
  } = useLeadFilters(leads, searchValue);

  const [viewLeadId, setViewLeadId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    setNavbar({ title: 'Leads', search: filters.search });
    if (searchValue !== filters.search) {
      onSearchChange(filters.search);
    }
  }, [filters.search, searchValue, setNavbar, onSearchChange]);

  const viewLead = leads.find((lead) => lead.id === viewLeadId) || null;

  function handleExport() {
    if (filteredLeads.length === 0) return;
    exportLeadsToCsv(filteredLeads);
  }

  function handleAddLead(leadData) {
    addLead(leadData);
    setAddOpen(false);
  }

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <TableSkeleton />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={reload} />;

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
        onFilterChange={updateFilter}
        onReset={resetFilters}
        onSearchChange={onSearchChange}
        onExport={handleExport}
        onAddLead={() => setAddOpen(true)}
        exportDisabled={filteredLeads.length === 0}
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
            onView={(lead) => setViewLeadId(lead.id)}
            onEdit={(lead) => setViewLeadId(lead.id)}
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
        onSave={updateLead}
        onAddNote={addNote}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
      />

      <LeadEditModal
        mode="create"
        lead={null}
        employees={employees}
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddLead}
      />
    </div>
  );
}
