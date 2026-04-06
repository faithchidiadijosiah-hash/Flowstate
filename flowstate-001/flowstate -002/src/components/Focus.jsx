import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSound } from '../hooks/useSound'

const CIRC = 2 * Math.PI * 70

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function Focus({ pomoDone, setPomoDone }) {
  const [focusMins, setFocusMins] = useState(25)
  const [breakMins, setBreakMins] = useState(5)
  const [volume, setVolume] = useState(0.5)
  const [mode, setMode] = useState('focus')
  const [sec, setSec] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const { playDone, playTick } = useSound()
  const intervalRef = useRef(null)

  const focusSec = focusMins * 60
  const breakSec = breakMins * 60
  const totalSec = mode === 'focus' ? focusSec : breakSec
  const frac = sec / totalSec
  const offset = CIRC * (1 - frac)

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSec(prev => {
        if (prev <= 1) {
          stop()
          playDone(volume)
          setMode(m => {
            const next = m === 'focus' ? 'break' : 'focus'
            setSec(next === 'focus' ? focusSec : breakSec)
            if (m === 'focus') setPomoDone(d => d + 1)
            return next
          })
          return 0
        }
        if (prev % 60 === 0) playTick(volume)
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, focusSec, breakSec, volume, stop, playDone, playTick, setPomoDone])

  const handleStartPause = () => {
    if (running) stop()
    else setRunning(true)
  }

  const handleReset = () => {
    stop()
    setSec(mode === 'focus' ? focusSec : breakSec)
  }

  const handleSkip = () => {
    stop()
    const next = mode === 'focus' ? 'break' : 'focus'
    setMode(next)
    setSec(next === 'focus' ? focusSec : breakSec)
  }

  const handleFocusChange = (v) => {
    setFocusMins(v)
    if (mode === 'focus' && !running) setSec(v * 60)
  }
  const handleBreakChange = (v) => {
    setBreakMins(v)
    if (mode === 'break' && !running) setSec(v * 60)
  }

  const streak = Math.floor(pomoDone / 4)
  const dots = Array.from({ length: Math.min(pomoDone + 4, 16) }, (_, i) => i < pomoDone)

  return (
    <div className="fade-up">
      <div className="card">
        <div className="card-title">Pomodoro focus</div>
        <div className="pomo-layout">
          <div className="pomo-center">
            <div className={`ring-wrap${running ? ' ring-running' : ''}`}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="70" fill="none" stroke="var(--surface3)" strokeWidth="8" />
                <circle
                  cx="90" cy="90" r="70" fill="none"
                  stroke={mode === 'focus' ? 'var(--accent)' : 'var(--green)'}
                  strokeWidth="8"
                  strokeDasharray={CIRC}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s' }}
                />
              </svg>
              <div className="ring-inner">
                <div className="ring-time">{fmt(sec)}</div>
                <div className="ring-mode">{mode === 'focus' ? 'Focus' : 'Break'}</div>
              </div>
            </div>

            <div className="pomo-btns">
              <button className="btn btn-accent" onClick={handleStartPause}>
                {running ? 'Pause' : 'Start'}
              </button>
              <button className="btn" onClick={handleReset}>Reset</button>
              <button className="btn" onClick={handleSkip}>Skip</button>
            </div>

            <div className="session-dots">
              {dots.map((d, i) => <div key={i} className={`sdot${d ? ' done' : ''}`} />)}
            </div>
          </div>

          <div className="pomo-settings">
            <div className="card-title">Timer settings</div>

            <div className="setting-row">
              <span className="setting-label">Focus</span>
              <div className="setting-controls">
                <input type="range" min="5" max="60" step="5" value={focusMins}
                  onChange={e => handleFocusChange(+e.target.value)} style={{ width: 90 }} />
                <span className="setting-val">{focusMins} min</span>
              </div>
            </div>

            <div className="setting-row">
              <span className="setting-label">Break</span>
              <div className="setting-controls">
                <input type="range" min="1" max="30" step="1" value={breakMins}
                  onChange={e => handleBreakChange(+e.target.value)} style={{ width: 90 }} />
                <span className="setting-val">{breakMins} min</span>
              </div>
            </div>

            <div className="divider" />

            <div className="setting-row">
              <span className="setting-label">Volume</span>
              <div className="setting-controls">
                <input type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={e => setVolume(+e.target.value)} style={{ width: 90 }} />
                <span className="setting-val">{Math.round(volume * 100)}%</span>
              </div>
            </div>

            <div className="divider" />

            <div className="pomo-stat-label">Sessions completed</div>
            <div className="pomo-stat-num">{pomoDone}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
              Deep work streaks:{' '}
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>{streak}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
