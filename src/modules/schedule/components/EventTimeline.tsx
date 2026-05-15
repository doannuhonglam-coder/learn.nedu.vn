import type { ScheduleEvent } from '../../../shared/types'
import { getEventStatus } from '../lib/event-status'

interface EventTimelineProps {
  events: ScheduleEvent[]
  year: number
  month: number
  selectedDay: number | null
  onSelectEvent: (event: ScheduleEvent) => void
}

export function EventTimeline({
  events,
  year,
  month,
  selectedDay,
  onSelectEvent,
}: EventTimelineProps) {
  let filtered = events.filter((e) => {
    const d = new Date(e.start_time)
    if (d.getFullYear() !== year || d.getMonth() !== month) return false
    if (selectedDay !== null && d.getDate() !== selectedDay) return false
    return true
  })

  filtered = [...filtered].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  )

  const monthName = new Date(year, month, 1).toLocaleDateString('vi-VN', { month: 'long' })

  if (filtered.length === 0) {
    return (
      <div className="px-4 mt-5 text-center py-10">
        <p className="text-[40px] mb-2">📅</p>
        <p className="text-sm text-i3">
          {selectedDay
            ? 'Không có sự kiện trong ngày này'
            : 'Không có sự kiện trong tháng này'}
        </p>
      </div>
    )
  }

  const now = Date.now()

  return (
    <div className="px-4 mt-5 space-y-2">
      <h3 className="font-display text-[15px] font-semibold text-ink mb-1 capitalize">
        {selectedDay ? `Ngày ${selectedDay}/${month + 1}` : `Sự kiện ${monthName}`}
      </h3>

      {filtered.map((event) => {
        const date = new Date(event.start_time)
        const info = getEventStatus(event, now)

        return (
          <button
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="w-full bg-surface rounded-[14px] px-3.5 py-3 flex items-center gap-3 text-left transition-opacity active:opacity-80"
            style={{
              border: info.status === 'live'
                ? `1.5px solid ${info.color}`
                : '1px solid rgba(26,24,22,0.10)',
              boxShadow: '0 1px 8px rgba(26,24,22,0.05)',
            }}
          >
            {/* Date column */}
            <div className="text-center w-10 flex-shrink-0">
              <div className="font-display text-[20px] font-bold text-gold-d leading-none">
                {String(date.getDate()).padStart(2, '0')}
              </div>
              <div
                className="text-[9px] text-i3 uppercase mt-0.5 font-medium"
                style={{ letterSpacing: '0.05em' }}
              >
                T{date.getMonth() + 1}
              </div>
            </div>

            <div className="w-px h-9 bg-border flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink truncate leading-tight">
                {event.title}
              </div>
              <div
                className="text-[11px] mt-0.5 truncate"
                style={{
                  color:
                    info.status === 'done' ? '#16A34A'
                    : info.status === 'live' ? '#C0392B'
                    : info.status === 'soon' ? '#D4920A'
                    : info.status === 'missed' ? '#C0392B'
                    : '#8A8480',
                }}
              >
                {info.subtitle(event)}
              </div>
            </div>

            {/* Status pill */}
            <span
              className="text-[9px] font-bold px-2 py-1 rounded-md flex-shrink-0"
              style={{
                background: info.bg,
                color: info.color,
                letterSpacing: '0.05em',
              }}
            >
              {info.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
