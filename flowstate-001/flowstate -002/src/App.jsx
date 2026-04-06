import React, { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Overview from './components/Overview'
import Tasks from './components/Tasks'
import Focus from './components/Focus'
import Habits from './components/Habits'
import Notes from './components/Notes'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks',    label: 'Tasks' },
  { id: 'focus',    label: 'Focus' },
  { id: 'habits',   label: 'Habits' },
  { id: 'notes',    label: 'Notes' },
]

function exportCSV(todos, habits, pomoDone, notes) {
  const today = new Date().toISOString().slice(0, 10)
  let csv = 'Type,Name,Priority,Due Date,Status\n'
  todos.forEach(t =>
    csv += `Task,"${t.text}",${t.prio},${t.date || ''},${t.done ? 'Done' : 'Active'}\n`
  )
  habits.forEach(h =>
    csv += `Habit,"${h.name}",,,"${h.done ? 'Done today' : 'Pending'} (streak: ${h.streak})"\n`
  )
  csv += `\nPomodoro sessions,${pomoDone},,,\n`
  csv += `Export date,${today},,,\n`
  if (notes) csv += `\nNotes,"${notes.replace(/"/g, '""')}"\n`

  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = `flowstate-${today}.csv`
  a.click()
}

export default function App() {
  const [tab, setTab] = useState('overview')
  const [light, setLight] = useLocalStorage('fs-theme', false)
  const [todos, setTodos] = useLocalStorage('fs-todos', [])
  const [habits, setHabits] = useLocalStorage('fs-habits', [])
  const [notes, setNotes] = useLocalStorage('fs-notes', '')
  const [pomoDone, setPomoDone] = useLocalStorage('fs-pomos', 0)

  const activeTasks = todos.filter(t => !t.done).length
  const habitsDone = habits.filter(h => h.done).length

  const badgeFor = (id) => {
    if (id === 'tasks' && activeTasks > 0) return activeTasks
    if (id === 'habits' && habits.length > 0) return `${habitsDone}/${habits.length}`
    if (id === 'focus' && pomoDone > 0) return pomoDone
    return null
  }

  return (
    <div className={light ? 'light' : ''}>
      <div className="app-wrap">
        <header className="app-header">
          <div className="logo">flow<em>state</em></div>
          <div className="header-right">
            <button className="icon-btn" onClick={() => setLight(l => !l)} title="Toggle theme">
              {light ? '🌙' : '☀️'}
            </button>
            <button
              className="export-btn"
              onClick={() => exportCSV(todos, habits, pomoDone, notes)}
            >
              Export CSV
            </button>
          </div>
        </header>

        <nav className="tabs">
          {TABS.map(t => {
            const badge = badgeFor(t.id)
            return (
              <button
                key={t.id}
                className={`tab${tab === t.id ? ' active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {badge !== null && <span className="tab-badge">{badge}</span>}
              </button>
            )
          })}
        </nav>

        <main>
          {tab === 'overview' && (
            <Overview todos={todos} pomoDone={pomoDone} habits={habits} />
          )}
          {tab === 'tasks' && (
            <Tasks todos={todos} setTodos={setTodos} />
          )}
          {tab === 'focus' && (
            <Focus pomoDone={pomoDone} setPomoDone={setPomoDone} />
          )}
          {tab === 'habits' && (
            <Habits habits={habits} setHabits={setHabits} />
          )}
          {tab === 'notes' && (
            <Notes notes={notes} setNotes={setNotes} />
          )}
        </main>
      </div>
    </div>
  )
}
