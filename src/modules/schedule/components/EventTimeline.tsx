import type { ScheduleEvent } from '../../../shared/types'
import { Badge } from '../../../shared/components/ui/Badge'

interface EventTimelineProps {
  events: ScheduleEvent[]
  selectedDay: number | null
  onSelectEvent: (event: ScheduleEvent) => void
}

const eventBadgeVariant = {
  online: 'cohort' as const,
  offline: 'coaching' as const,
  retreat: 'retreat' as const,
}

export function EventTimeline({ events, selectedDay, onSelectEvent }: EventTimelineProps) {
  let filtered = [...events].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )

  if (selectedDay !== null) {
    filtered = filtered.filter((e) => new Date(e.start_time).getDate() === selectedDay)
  }

  if (filtered.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm text-gray-400">
          {selectedDay ? 'Không có sự kiện trong ngày này' : 'Không có sự kiện trong tháng này'}
        </p>
      </div>
    )
  }

  let lastDateStr = ''

  return (
    <div className="px-4 space-y-2">
      {filtered.map((event) => {
        const date = new Date(event.start_time)
        const dateStr = date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })
        const showDateHeader = dateStr !== lastDateStr
        lastDateStr = dateStr

        return (
          <div key={event.id}>
            {showDateHeader && (
              <p className="text-[11px] text-gray-400 font-medium mt-3 mb-1">{dateStr}</p>
            )}
            <button
              onClick={() => onSelectEvent(event)}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow text-left"
            >
              <div className="w-1 h-10 rounded-full bg-gradient-to-b from-brand-gold to-brand-gold/30 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-dark truncate">{event.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  {' – '}
                  {new Date(event.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  {event.platform && ` · ${event.platform}`}
                  {event.location && ` · ${event.location}`}
                </p>
              </div>
              <Badge variant={eventBadgeVariant[event.event_type]}>
                {event.event_type === 'online' ? 'Online' : event.event_type === 'offline' ? 'Offline' : 'Retreat'}
              </Badge>
            </button>
          </div>
        )
      })}
    </div>
  )
}
