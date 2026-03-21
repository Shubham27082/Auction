import { useState, useEffect, useRef, useCallback } from 'react'

export default function useCountdown(initial = 30) {
  const [seconds, setSeconds] = useState(initial)
  const [running, setRunning] = useState(false)
  const timer = useRef(null)

  const start = useCallback((from = initial) => {
    setSeconds(from)
    setRunning(true)
  }, [initial])

  const stop  = useCallback(() => { setRunning(false); clearInterval(timer.current) }, [])
  const reset = useCallback(() => { stop(); setSeconds(initial) }, [initial, stop])

  useEffect(() => {
    if (!running) return
    timer.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(timer.current); setRunning(false); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer.current)
  }, [running])

  return { seconds, running, start, stop, reset }
}
