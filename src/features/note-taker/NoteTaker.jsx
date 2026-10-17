import { useState } from 'react'
import './NoteTaker.css'

const STORAGE_KEY = 'portfolio-notes'
const MAX_TITLE_LENGTH = 60

function readSavedNotes() {
  try {
    const savedNotes = localStorage.getItem(STORAGE_KEY)
    if (!savedNotes) return { notes: [], message: '' }

    const parsedNotes = JSON.parse(savedNotes)
    if (!Array.isArray(parsedNotes)) throw new Error('Saved notes have an invalid format.')

    const validNotes = parsedNotes.every((note) => (
      note
      && typeof note.id === 'string'
      && typeof note.title === 'string'
      && typeof note.text === 'string'
      && typeof note.updatedAt === 'string'
    ))
    if (!validNotes) throw new Error('Saved notes have an invalid format.')

    return { notes: parsedNotes, message: '' }
  } catch (error) {
    return {
      notes: [],
      message: error instanceof Error
        ? `Saved notes could not be loaded: ${error.message}`
        : 'Saved notes could not be loaded.',
    }
  }
}

function createNoteId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function formatUpdatedAt(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Saved note'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)
}

function NoteTaker() {
  const [stored, setStored] = useState(readSavedNotes)
  const [activeId, setActiveId] = useState('')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(stored.message)

  const activeNote = stored.notes.find((note) => note.id === activeId)
  const hasContent = Boolean(title.trim() || text.trim())
  const isDirty = activeNote
    ? title !== activeNote.title || text !== activeNote.text
    : hasContent
  const visibleNotes = stored.notes
    .filter((note) => `${note.title} ${note.text}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))

  function startNewNote() {
    if (isDirty) {
      setMessage('Save or discard your current changes before starting a new note.')
      return
    }
    setActiveId('')
    setTitle('')
    setText('')
    setMessage('')
  }

  function openNote(note) {
    if (isDirty && note.id !== activeId) {
      setMessage('Save or discard your current changes before opening another note.')
      return
    }
    setActiveId(note.id)
    setTitle(note.title)
    setText(note.text)
    setMessage('')
  }

  function discardChanges() {
    if (activeNote) {
      setTitle(activeNote.title)
      setText(activeNote.text)
    } else {
      setTitle('')
      setText('')
    }
    setMessage('')
  }

  function persistNotes(nextNotes, successMessage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextNotes))
      setStored({ notes: nextNotes, message: '' })
      setMessage(successMessage)
      return true
    } catch {
      setMessage('Your changes could not be saved in this browser. Check available storage and try again.')
      return false
    }
  }

  function saveNote(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    const cleanText = text.trim()

    if (!cleanTitle || !cleanText) {
      setMessage('Add both a title and some note text before saving.')
      return
    }

    const savedNote = {
      id: activeId || createNoteId(),
      title: cleanTitle,
      text: cleanText,
      updatedAt: new Date().toISOString(),
    }
    const nextNotes = activeId
      ? stored.notes.map((note) => (note.id === activeId ? savedNote : note))
      : [...stored.notes, savedNote]

    if (persistNotes(nextNotes, 'Note saved in this browser.')) {
      setActiveId(savedNote.id)
      setTitle(savedNote.title)
      setText(savedNote.text)
    }
  }

  function deleteNote() {
    if (!activeNote) return
    const nextNotes = stored.notes.filter((note) => note.id !== activeId)
    if (persistNotes(nextNotes, 'Note deleted.')) {
      setActiveId('')
      setTitle('')
      setText('')
    }
  }

  return (
    <section className="note-taker" aria-label="Note taker">
      <aside className="notes-sidebar">
        <div className="notes-sidebar-heading">
          <div>
            <h2>Your notes</h2>
            <p>{stored.notes.length} {stored.notes.length === 1 ? 'note' : 'notes'}</p>
          </div>
          <button className="note-new-button" type="button" onClick={startNewNote} aria-label="Create a new note">
            <span aria-hidden="true">+</span> New
          </button>
        </div>

        <label className="notes-search">
          <span className="visually-hidden">Search notes</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your notes"
          />
        </label>

        <ul className="notes-list">
          {visibleNotes.map((note) => (
            <li key={note.id}>
              <button
                className={`note-list-item${activeId === note.id ? ' is-active' : ''}`}
                type="button"
                onClick={() => openNote(note)}
                aria-current={activeId === note.id ? 'true' : undefined}
              >
                <span className="note-list-item-heading">
                  <strong>{note.title}</strong>
                  <time dateTime={note.updatedAt}>{formatUpdatedAt(note.updatedAt)}</time>
                </span>
                <span className="note-list-preview">{note.text}</span>
              </button>
            </li>
          ))}
        </ul>
        {visibleNotes.length === 0 && (
          <p className="notes-list-empty">
            {search ? 'No notes match your search.' : 'No notes yet. Create one to get started.'}
          </p>
        )}
      </aside>

      <form className="note-editor" onSubmit={saveNote}>
        <div className="note-editor-toolbar">
          <p>{activeNote ? `LAST SAVED ${formatUpdatedAt(activeNote.updatedAt).toUpperCase()}` : 'NEW NOTE'}</p>
          <div>
            {isDirty && (
              <button className="note-discard-button" type="button" onClick={discardChanges}>Discard</button>
            )}
            {activeNote && (
              <button className="note-delete-button" type="button" onClick={deleteNote}>Delete</button>
            )}
            <button className="note-save-button" type="submit" disabled={!isDirty}>Save note</button>
          </div>
        </div>
        <label className="visually-hidden" htmlFor="note-title">Note title</label>
        <input
          id="note-title"
          className="note-title-input"
          type="text"
          maxLength={MAX_TITLE_LENGTH}
          placeholder="Untitled note"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <label className="visually-hidden" htmlFor="note-text">Note text</label>
        <textarea
          id="note-text"
          className="note-text-input"
          placeholder="Start writing..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="note-editor-footer">
          <span>{text.length} characters</span>
          {message && <p role="status">{message}</p>}
        </div>
      </form>
    </section>
  )
}

export default NoteTaker
