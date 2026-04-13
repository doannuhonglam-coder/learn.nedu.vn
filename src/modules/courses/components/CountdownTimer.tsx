import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string
  className?: string
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => calcRemaining(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calcRemaining(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (remaining.total <= 0) {
    return <span className={`text-sm font-medium text-brand-green ${className}`}>Đã đến!</span>
  }

  return (
    <span className={`text-sm font-medium text-brand-dark ${className}`}>
      {remaining.days > 0 && `${remaining.days} ngày `}
      {String(remaining.hours).padStart(2, '0')} giờ {String(remaining.minutes).padStart(2, '0')} phút
    </span>
  )
}

function calcRemaining(targetDate: string) {
  const total = new Date(targetDate).getTime() - Date.now()
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0 }
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
  }
}
