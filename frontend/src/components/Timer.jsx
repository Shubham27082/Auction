import { useEffect } from 'react'
import useCountdown from '../hooks/useCountdown'

export default function Timer({ active, onExpire }) {
  const { seconds, running, start, stop } = useCountdown(30)

  useEffect(() => {
    if (active) start(30)
    else stop()
  }, [active])

  useEffect(() => {
    if (running && seconds === 0) onExpire?.()
  }, [seconds, running])

  const pct = (seconds / 30) * 100
  const color = seconds > 15 ? '#22c55e' : seconds > 7 ? '#f59e0b' : '#ef4444'

  if (!active) return null

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#374151" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{seconds}</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 hidden">seconds left</span>
    </div>
  )
}
