import React from 'react'

export default function Notes({ notes, setNotes }) {
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0

  return (
    <div className="fade-up">
      <div className="card">
        <div className="card-title">Quick notes</div>
        <textarea
          className="notes-area"
          placeholder={`Stream of consciousness, links, ideas, reminders...\n\nThis is your scratchpad. Nothing is too small to note.`}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <div className="notes-footer">
          <span className="notes-count">{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
          <button className="btn" onClick={() => setNotes('')}>Clear</button>
        </div>
      </div>
    </div>
  )
}
