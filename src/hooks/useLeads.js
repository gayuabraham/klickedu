import { useState, useEffect } from 'react';
import { fetchLeads } from '../services/leadService';

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function loadLeads() {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchLeads();
      setLeads(data.leads);
      setEmployees(data.employees);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  function updateLead(updatedLead) {
    setLeads((prev) => prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)));
  }

  function addNote(leadId, note) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, notes: [...(lead.notes || []), note] } : lead
      )
    );
  }

  function updateNote(leadId, noteId, updatedNote) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              notes: lead.notes.map((note) =>
                note.id === noteId ? { ...note, ...updatedNote } : note
              ),
            }
          : lead
      )
    );
  }

  function deleteNote(leadId, noteId) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, notes: lead.notes.filter((note) => note.id !== noteId) }
          : lead
      )
    );
  }

  return {
    leads,
    employees,
    loading,
    error,
    lastUpdated,
    reload: loadLeads,
    updateLead,
    addNote,
    updateNote,
    deleteNote,
  };
}
