import type { ScheduleEvent } from '../../../shared/types'

interface EventTimelineProps {
  events: ScheduleEvent[]
  year: number
  month: number
  selectedDay: number | null
  onSelectEvent: (event: ScheduleEvent) => void
}

const badgeStyles = {
  online: { bg: '#FEF4D6', color: '#D4920A', label: 'Online' },
  offline: { bg: '#FEF4D6', color: '#D4920A', label: 'Offline' },
  retreat: { bg: '#EDE9FE', color: '#5B21B6', label: 'Retreat' },
} as const

export function EventTimeline({
  events,
  year,
  month,
  selectedDay,
  onSelectEvent,
}: EventTimelineProps) {
  // Filter by current month + (optional) selectedDay
  let filtered = events.filter((e) => {
    const d = new Date(e.start_time)
    if (d.getFullYear() !== year || d.getMonth() !== month) return false
    if (selectedDay !== null && d.getDate() !== selectedDay) return false
    return true
  })

  filtered = [...filtered].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )

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

  let lastDateStr = ''

  return (
    <div className="px-4 mt-5 space-y-1">
      <h3
        className="font-display text-[15px] font-semibold text-ink mb-1"
      >
        {selectedDay ? `Ngày ${selectedDay}/${month + 1}` : 'Sự kiện trong tháng'}
      </h3>

      {filtered.map((event) => {
        const date = new Date(event.start_time)
        const endDate = new Date(event.end_time)
        const dateStr = date.toLocaleDateString('vi-VN', {
          weekday: 'short',
          day: 'numeric',
          month: 'numeric',
        })
        const showDateHeader = dateStr !== lastDateStr
        lastDateStr = dateStr
        const badge = badgeStyles[event.event_type]

        return (
          <div key={event.id}>
            {showDateHeader && (
              <p
                className="text-[11px] text-i3 font-medium mt-3 mb-1.5 capitalize"
              >
                {dateStr}
              </p>
            )}
            <button
              onClick={() => onSelectEvent(event)}
              className="w-full bg-surface rounded-[14px] px-[14px] py-3 flex items-center gap-3 text-left transition-opacity active:opacity-80"
              style={{
                border: `1px solid ${event.event_type === 'retreat' ? 'rgba(91,33,182,0.15)' : 'rgba(26,24,22,0.10)'}`,
                boxShadow: '0 1px 8px rgba(26,24,22,0.05)',
              }}
            >
              <div
                className="w-1 h-10 rounded-full flex-shrink-0"
                style={{
                  background:
                    event.event_type === 'retreat'
                      ? 'linear-gradient(180deg, #8B5CF6, rgba(139,92,246,0.3))'
                      : 'linear-gradient(180deg, #F5B731, rgba(245,183,49,0.3))',
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink truncate">
                  {event.title}
                </div>
                <div className="text-[11px] text-i3 mt-0.5">
                  {date.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  –{' '}
                  {endDate.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {event.platform && ` · ${event.platform}`}
                  {event.location && ` · ${event.location}`}
                </div>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-[3px] rounded-full flex-shrink-0"
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
