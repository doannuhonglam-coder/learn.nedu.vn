import type { ScheduleEvent } from '../../../shared/types'

interface CalendarMonthProps {
  year: number
  month: number
  events: ScheduleEvent[]
  selectedDate: number | null
  onSelectDate: (day: number) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const eventDotColor: Record<string, string> = {
  online: 'bg-cohort',
  offline: 'bg-coaching',
  retreat: 'bg-retreat',
}

export function CalendarMonth({ year, month, events, selectedDate, onSelectDate, onPrevMonth, onNextMonth }: CalendarMonthProps) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  const eventsByDay = new Map<number, Set<string>>()
  events.forEach((evt) => {
    const d = new Date(evt.start_time)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventsByDay.has(day)) eventsByDay.set(day, new Set())
      eventsByDay.get(day)!.add(evt.event_type)
    }
  })

  const monthName = firstDay.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="p-1.5 text-gray-400 hover:text-gray-600">‹</button>
        <h3 className="font-display font-semibold text-sm text-brand-dark capitalize">{monthName}</h3>
        <button onClick={onNextMonth} className="p-1.5 text-gray-400 hover:text-gray-600">›</button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />

          const isToday = isCurrentMonth && today.getDate() === day
          const isSelected = selectedDate === day
          const dotTypes = eventsByDay.get(day)

          return (
            <button
              key={day}
              onClick={() => onSelectDate(day)}
              className={`relative flex flex-col items-center py-1.5 rounded-lg text-xs transition-colors
                ${isSelected ? 'bg-brand-gold text-white' : isToday ? 'bg-amber-50 text-brand-gold font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {day}
              {dotTypes && dotTypes.size > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from(dotTypes).map((type) => (
                    <span key={type} className={`w-1 h-1 rounded-full ${eventDotColor[type] || 'bg-gray-400'}`} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
