import { useState, useEffect } from 'react';
import {
  fetchLeads,
  createLead,
  updateLeadOnServer,
  createNote,
  updateNoteOnServer,
  deleteNoteOnServer,
  createFollowUp,
  completeFollowUp,
} from '../services/leadService';

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
      throw err;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads().catch(() => {});
  }, []);

  async function updateLead(updatedLead) {
    setError(null);
    try {
      const saved = await updateLeadOnServer(updatedLead);
      setLeads((prev) => prev.map((lead) => (lead.id === saved.id ? saved : lead)));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to update lead');
      throw err;
    }
  }

  async function addLead(leadData) {
    setError(null);
    try {
      const saved = await createLead(leadData);
      setLeads((prev) => [saved, ...prev]);
      setLastUpdated(new Date());
      return saved;
    } catch (err) {
      setError(err.message || 'Failed to create lead');
      throw err;
    }
  }

  async function addNote(leadId, noteData) {
    setError(null);
    try {
      const savedNote = await createNote(leadId, noteData);
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === String(leadId)
            ? { ...lead, notes: [...(lead.notes || []), savedNote] }
            : lead
        )
      );
      setLastUpdated(new Date());
      return savedNote;
    } catch (err) {
      setError(err.message || 'Failed to add note');
      throw err;
    }
  }

  async function updateNote(leadId, noteId, updatedNote) {
    setError(null);
    try {
      const savedNote = await updateNoteOnServer(noteId, updatedNote.text);
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === String(leadId)
            ? {
                ...lead,
                notes: lead.notes.map((note) =>
                  note.id === String(noteId) ? savedNote : note
                ),
              }
            : lead
        )
      );
      setLastUpdated(new Date());
      return savedNote;
    } catch (err) {
      setError(err.message || 'Failed to update note');
      throw err;
    }
  }

  async function deleteNote(leadId, noteId) {
    setError(null);
    try {
      await deleteNoteOnServer(noteId);
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === String(leadId)
            ? { ...lead, notes: lead.notes.filter((note) => note.id !== String(noteId)) }
            : lead
        )
      );
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to delete note');
      throw err;
    }
  }

  async function scheduleFollowUp(leadId, followupData) {
    setError(null);
    try {
      const saved = await createFollowUp(leadId, followupData);
      setLastUpdated(new Date());
      return saved;
    } catch (err) {
      setError(err.message || 'Failed to schedule follow-up');
      throw err;
    }
  }

  async function markFollowUpCompleted(leadId, followupId) {
    setError(null);
    try {
      const saved = await completeFollowUp(followupId);
      setLastUpdated(new Date());
      return saved;
    } catch (err) {
      setError(err.message || 'Failed to complete follow-up');
      throw err;
    }
  }

  return {
    leads,
    employees,
    loading,
    error,
    lastUpdated,
    reload: loadLeads,
    updateLead,
    addLead,
    addNote,
    updateNote,
    deleteNote,
    scheduleFollowUp,
    markFollowUpCompleted,
  };
}
