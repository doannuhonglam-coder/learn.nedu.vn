import { useNavigate } from 'react-router-dom'
import type { UpcomingEventSummary } from '../../../shared/types'
import { Badge } from '../../../shared/components/ui/Badge'

interface UpcomingEventsListProps {
  events: UpcomingEventSummary[]
}

const eventBadgeVariant = {
  online: 'cohort' as const,
  offline: 'coaching' as const,
  retreat: 'retreat' as const,
}

export function UpcomingEventsList({ events }: UpcomingEventsListProps) {
  const navigate = useNavigate()

  if (events.length === 0) return null

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-base text-brand-dark">Lịch Sắp Tới</h3>
        <button onClick={() => navigate('/schedule')} className="text-xs text-brand-gold font-medium">
          Xem tất cả →
        </button>
      </div>
      <div className="space-y-2">
        {events.slice(0, 3).map((event) => {
          const date = new Date(event.start_time)
          return (
            <button
              key={event.id}
              onClick={() => navigate('/schedule')}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors"
            >
              <div className="text-center min-w-[40px]">
                <p className="text-lg font-bold text-brand-dark">{date.getDate()}</p>
                <p className="text-[10px] text-gray-500">Th{date.getMonth() + 1}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-dark truncate">{event.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  {event.platform && ` · ${event.platform}`}
                  {event.location && ` · ${event.location}`}
                </p>
              </div>
              <Badge variant={eventBadgeVariant[event.event_type]}>
                {event.event_type === 'online' ? 'Online' : event.event_type === 'offline' ? 'Offline' : 'Retreat'}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}
