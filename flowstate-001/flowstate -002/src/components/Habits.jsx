import React, { useState } from 'react'

const DEFAULT_HABITS = ['Exercise', 'Read 30 min', 'Meditate', 'Drink water', 'No screens 9pm']

export default function Habits({ habits, setHabits }) {
  const [input, setInput] = useState('')
  let nextId = React.useRef(Date.now())

  React.useEffect(() => {
    if (habits.length === 0) {
      setHabits(DEFAULT_HABITS.map(name => ({
        id: nextId.current++,
        name,
        streak: 0,
        done: false,
        week: Array(7).fill(false)
      })))
    }
  }, [])

  const add = () => {
    if (!input.trim()) return
    setHabits(prev => [...prev, {
      id: nextId.current++,
      name: input.trim(),
      streak: 0,
      done: false,
      week: Array(7).fill(false)
    }])
    setInput('')
  }

  const toggle = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const done = !h.done
      const week = [...h.week]
      week[0] = done
      return { ...h, done, streak: done ? h.streak + 1 : Math.max(0, h.streak - 1), week }
    }))
  }

  const remove = (id) => setHabits(prev => prev.filter(h => h.id !== id))

  return (
    <div className="fade-up">
      <div className="card">
        <div className="card-title">Daily habits</div>
        <div className="input-row" style={{ marginBottom: 18 }}>
          <input
            className="inp-grow"
            type="text"
            placeholder="Add a new habit..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <button className="btn btn-accent" onClick={add}>Add habit</button>
        </div>
        {habits.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>No habits yet — add one above.</p>
        ) : (
          <div className="habits-grid">
            {habits.map((h, i) => (
              <div
                key={h.id}
                className={`habit-card${h.done ? ' done' : ''} fade-up`}
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => toggle(h.id)}
              >
                <button className="habit-del" onClick={e => { e.stopPropagation(); remove(h.id) }}>×</button>
                <div className="habit-name">{h.name}</div>
                <div className="habit-streak">{h.streak} day streak</div>
                <div className="week-dots">
                  {[...h.week].reverse().map((d, j) => (
                    <div key={j} className={`wd${d ? ' on' : ''}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
