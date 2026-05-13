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
  online: '#D4920A',
  offline: '#D4920A',
  retreat: '#8B5CF6',
}

export function CalendarMonth({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthProps) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
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

  const monthName = firstDay.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  })

  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div
      className="mx-4 mt-3 rounded-[14px] p-4 bg-surface"
      style={{
        border: '1px solid rgba(26,24,22,0.10)',
        boxShadow: '0 2px 16px rgba(26,24,22,0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-3.5">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[16px]"
          style={{ background: '#F5F3EF' }}
        >
          ‹
        </button>
        <h3 className="font-display font-semibold text-[16px] text-ink capitalize">
          {monthName}
        </h3>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[16px]"
          style={{ background: '#F5F3EF' }}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] text-i3 font-semibold py-1 uppercase"
            style={{ letterSpacing: '0.04em' }}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="aspect-square" />

          const isToday = isCurrentMonth && today.getDate() === day
          const isSelected = selectedDate === day
          const dotTypes = eventsByDay.get(day)

          let bg = 'transparent'
          let color = '#4A4540'
          let fontWeight: number = 500
          if (isSelected) {
            bg = '#FEF4D6'
            color = '#D4920A'
            fontWeight = 700
          } else if (isToday) {
            bg = '#1A1816'
            color = '#F5B731'
            fontWeight = 700
          }

          return (
            <button
              key={day}
              onClick={() => onSelectDate(day)}
              className="relative aspect-square flex flex-col items-center justify-center rounded-full text-[13px] transition-colors"
              style={{ background: bg, color, fontWeight }}
            >
              {day}
              {dotTypes && dotTypes.size > 0 && (
                <span
                  className="absolute bottom-[3px] w-1 h-1 rounded-full"
                  style={{
                    background: isToday
                      ? '#FFFFFF'
                      : eventDotColor[Array.from(dotTypes)[0]] || '#D4920A',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
