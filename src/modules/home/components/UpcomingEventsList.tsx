import { useNavigate } from 'react-router-dom'
import type { UpcomingEventSummary } from '../../../shared/types'

interface UpcomingEventsListProps {
  events: UpcomingEventSummary[]
  onOpenEvent: (eventId: string) => void
}

const badgeStyles = {
  online: { bg: '#FEF4D6', color: '#D4920A', label: 'Online' },
  offline: { bg: '#FEF4D6', color: '#D4920A', label: 'Offline' },
  retreat: { bg: '#EDE9FE', color: '#5B21B6', label: 'Retreat' },
} as const

const MAX_EVENTS_HOMEPAGE = 3

export function UpcomingEventsList({ events, onOpenEvent }: UpcomingEventsListProps) {
  const navigate = useNavigate()

  // Sort by start_time ascending, lấy tối đa 3 (BE đã limit 3 ở /home/summary
  // nhưng FE giữ cap để dùng được khi nguồn data khác).
  const sorted = [...events]
    .sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    )
    .slice(0, MAX_EVENTS_HOMEPAGE)

  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-display text-[16px] font-semibold text-ink">Sắp tới</h2>
        <button onClick={() => navigate('/schedule')} className="text-[12px] font-medium text-gold-d">
          Xem lịch học của bạn →
        </button>
      </div>

      {sorted.length === 0 ? (
        <div
          className="bg-surface rounded-[14px] px-[14px] py-4 text-center text-[12px] text-i3"
          style={{
            border: '1px solid rgba(26,24,22,0.10)',
          }}
        >
          Không có lịch học nào sắp tới
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => onOpenEvent(event.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function EventCard({
  event,
  onClick,
}: {
  event: UpcomingEventSummary
  onClick: () => void
}) {
  const date = new Date(event.start_time)
  const endDate = new Date(event.end_time)
  const badge = badgeStyles[event.event_type]
  const weekday = date.toLocaleDateString('vi-VN', { weekday: 'short' })

  return (
    <button
      onClick={onClick}
      className="w-full bg-surface rounded-[14px] px-[14px] py-3 flex items-center gap-3 text-left transition-opacity active:opacity-80"
      style={{
        border: `1px solid ${event.event_type === 'retreat' ? 'rgba(91,33,182,0.15)' : 'rgba(26,24,22,0.10)'}`,
        boxShadow: '0 1px 8px rgba(26,24,22,0.05)',
      }}
    >
      <div className="text-center w-11 flex-shrink-0">
        <div className="font-display text-[20px] font-bold text-gold-d leading-none">
          {String(date.getDate()).padStart(2, '0')}
        </div>
        <div
          className="text-[9px] text-i3 uppercase mt-0.5 font-medium"
          style={{ letterSpacing: '0.05em' }}
        >
          Tháng {date.getMonth() + 1}
        </div>
      </div>

      <div className="w-px h-9 bg-border flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-ink truncate">{event.title}</div>
        <div className="text-[11px] text-i3 mt-0.5">
          {weekday}, {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} –{' '}
          {endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
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
  )
}
