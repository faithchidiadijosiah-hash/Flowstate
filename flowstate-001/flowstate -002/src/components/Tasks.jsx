import React, { useState } from 'react'

const today = new Date().toISOString().slice(0, 10)

export default function Tasks({ todos, setTodos }) {
  const [text, setText] = useState('')
  const [prio, setPrio] = useState('med')
  const [date, setDate] = useState('')
  const [filter, setFilter] = useState('all')
  let nextId = React.useRef(Date.now())

  const add = () => {
    if (!text.trim()) return
    setTodos(prev => [...prev, { id: nextId.current++, text: text.trim(), prio, date, done: false }])
    setText('')
  }

  const toggle = (id) => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const remove = (id) => setTodos(prev => prev.filter(t => t.id !== id))

  const filtered = todos
    .filter(t => {
      if (filter === 'active') return !t.done
      if (filter === 'done') return t.done
      if (filter === 'high') return t.prio === 'high' && !t.done
      if (filter === 'overdue') return !t.done && t.date && t.date < today
      return true
    })
    .sort((a, b) => ({ high: 0, med: 1, low: 2 }[a.prio] - { high: 0, med: 1, low: 2 }[b.prio]))

  const filters = ['all', 'active', 'done', 'high', 'overdue']

  return (
    <div className="fade-up">
      <div className="card">
        <div className="card-title">Add task</div>
        <div className="input-row">
          <input
            className="inp-grow"
            type="text"
            placeholder="What needs to get done?"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <select value={prio} onChange={e => setPrio(e.target.value)}>
            <option value="high">High</option>
            <option value="med">Med</option>
            <option value="low">Low</option>
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 150 }} />
          <button className="btn btn-accent" onClick={add}>Add</button>
        </div>

        <div className="filter-chips">
          {filters.map(f => (
            <button key={f} className={`chip${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text3)', padding: '12px 0' }}>
            {filter === 'all' ? 'No tasks yet — add one above.' : `No ${filter} tasks.`}
          </p>
        ) : (
          <ul className="task-list">
            {filtered.map((t, i) => {
              const od = !t.done && t.date && t.date < today
              return (
                <li key={t.id} className={`task-item${t.done ? ' done' : ''}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <input
                    type="checkbox"
                    className="chk"
                    checked={t.done}
                    onChange={() => toggle(t.id)}
                  />
                  <span className="task-text">{t.text}</span>
                  <span className={`badge badge-${t.prio}`}>{t.prio}</span>
                  {t.date && (
                    <span className={`task-date${od ? ' overdue' : ''}`}>
                      {od ? 'Overdue · ' : ''}{t.date}
                    </span>
                  )}
                  <button className="task-del" onClick={() => remove(t.id)}>×</button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
