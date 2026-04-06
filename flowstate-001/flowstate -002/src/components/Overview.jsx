import React from 'react'

const today = new Date().toISOString().slice(0, 10)

export default function Overview({ todos, pomoDone, habits }) {
  const total = todos.length
  const done = todos.filter(t => t.done).length
  const overdue = todos.filter(t => !t.done && t.date && t.date < today)
  const high = todos.filter(t => !t.done && t.prio === 'high')
  const habitsDone = habits.filter(h => h.done).length
  const streak = Math.floor(pomoDone / 4)

  const glanceItems = []
  if (overdue.length)
    glanceItems.push({ color: 'var(--red)', text: `${overdue.length} overdue task${overdue.length > 1 ? 's' : ''} need attention` })
  if (high.length)
    glanceItems.push({ color: 'var(--amber)', text: `${high.length} high-priority task${high.length > 1 ? 's' : ''} pending` })
  if (pomoDone > 0)
    glanceItems.push({ color: 'var(--accent)', text: `${pomoDone} focus session${pomoDone > 1 ? 's' : ''} completed today` })
  if (habitsDone > 0)
    glanceItems.push({ color: 'var(--green)', text: `${habitsDone} of ${habits.length} habits completed` })
  if (done > 0)
    glanceItems.push({ color: 'var(--blue)', text: `${done} task${done > 1 ? 's' : ''} checked off` })
  if (streak > 0)
    glanceItems.push({ color: 'var(--accent2)', text: `${streak} deep work streak${streak > 1 ? 's' : ''} achieved` })

  return (
    <div>
      <div className="stats-grid fade-up">
        <div className="stat-card">
          <div className="stat-num">{total}</div>
          <div className="stat-label">Total tasks</div>
        </div>
        <div className="stat-card fade-up-1">
          <div className="stat-num">{done}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card fade-up-2">
          <div className="stat-num">{pomoDone}</div>
          <div className="stat-label">Pomodoros</div>
        </div>
        <div className="stat-card fade-up-3">
          <div className="stat-num">{habitsDone}/{habits.length}</div>
          <div className="stat-label">Habits today</div>
        </div>
      </div>

      <div className="card fade-up fade-up-2">
        <div className="card-title">Today at a glance</div>
        {glanceItems.length === 0 ? (
          <p className="glance-empty">
            Add tasks, run focus sessions and complete habits —<br />
            your daily progress will appear here.
          </p>
        ) : (
          glanceItems.map((item, i) => (
            <div className="glance-item" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="glance-dot" style={{ background: item.color }} />
              {item.text}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
