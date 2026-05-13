interface WelcomeHeaderProps {
  fullName: string
  activeCourses: number
  completionPercent: number
}

export function WelcomeHeader({ fullName, activeCourses, completionPercent }: WelcomeHeaderProps) {
  const today = new Date()
  const weekday = today.toLocaleDateString('vi-VN', { weekday: 'long' }).toUpperCase()
  const dateStr = `${weekday} · ${String(today.getDate()).padStart(2, '0')} THÁNG ${today.getMonth() + 1}, ${today.getFullYear()}`

  // Use last word of full name as personal name (Vietnamese given name)
  const personalName = fullName.trim().split(/\s+/).pop() || fullName

  return (
    <div className="px-4 pt-5 pb-3">
      <div
        className="font-mono text-[11px] uppercase text-i3 mb-1.5"
        style={{ letterSpacing: '0.06em' }}
      >
        {dateStr}
      </div>
      <h1 className="font-display text-[24px] font-semibold text-ink leading-tight mb-1">
        Chào {personalName} 👋
      </h1>
      <div className="text-[13px] text-i3">
        <span className="text-gold-d font-semibold">{activeCourses} khoá</span> đang học
        {' · '}
        Tiến trình chung <span className="text-gold-d font-semibold">{completionPercent}%</span>
      </div>
    </div>
  )
}
