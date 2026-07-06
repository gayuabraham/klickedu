import { useState } from 'react';
import Button from '../common/Button';
import { formatDate } from '../../utils/dateUtils';

export default function NotesSection({ notes = [], onAdd, onUpdate, onDelete }) {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  function handleAdd() {
    if (!newNote.trim()) return;
    onAdd(newNote.trim());
    setNewNote('');
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <h3 className="text-sm font-semibold text-slate-900">Notes</h3>

      <div className="mt-4 flex gap-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          rows={2}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        <Button size="sm" onClick={handleAdd} disabled={!newNote.trim()} className="self-end">
          Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
          No notes yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              {editingId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { onUpdate(note.id, editText.trim()); setEditingId(null); }}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-slate-700">{note.text}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {formatDate(note.createdDate)} · {note.createdBy}
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => { setEditingId(note.id); setEditText(note.text); }}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-violet-600 hover:bg-violet-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(note.id)}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
