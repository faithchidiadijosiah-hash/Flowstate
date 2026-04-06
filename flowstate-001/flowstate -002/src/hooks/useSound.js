import { useRef, useCallback } from 'react'

export function useSound() {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  const playBeep = useCallback((freq, duration, volume) => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch (e) {}
  }, [getCtx])

  const playDone = useCallback((volume) => {
    if (!volume) return
    playBeep(880, 0.3, volume)
    setTimeout(() => playBeep(1100, 0.3, volume), 180)
    setTimeout(() => playBeep(1320, 0.4, volume), 360)
  }, [playBeep])

  const playTick = useCallback((volume) => {
    if (!volume) return
    playBeep(600, 0.06, volume * 0.25)
  }, [playBeep])

  return { playDone, playTick }
}
