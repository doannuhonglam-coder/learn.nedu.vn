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

  // Sort + cap 3 (BE đã limit, FE giữ cap defensive). Pattern + session_number
  // đã được BE compute — FE chỉ render khác nhau theo schedule_pattern.
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

function formatDay(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function EventCard({
  event,
  onClick,
}: {
  event: UpcomingEventSummary
  onClick: () => void
}) {
  const date = new Date(event.start_time)
  const endDate = event.end_time ? new Date(event.end_time) : null
  const badge = badgeStyles[event.event_type]
  const weekday = date.toLocaleDateString('vi-VN', { weekday: 'short' })

  // Buổi N/Total — học viên thấy progress trong khoá ngay lập tức.
  const sessionLabel = `Buổi ${event.session_number}/${event.sessions_total}`

  // Context line khác nhau theo schedule_pattern:
  //   - continuous: "Khoá {N} ngày · DD/MM → DD/MM" (retreat / intensive)
  //   - discrete: "Còn N buổi · Kết thúc DD/MM" (cohort weekly schedule)
  let contextLine = ''
  if (event.schedule_pattern === 'continuous') {
    const startStr = event.run_start_date ? formatDay(event.run_start_date) : null
    const endStr = event.run_end_date ? formatDay(event.run_end_date) : null
    if (startStr && endStr) {
      contextLine = `Khoá liên tục ${startStr} → ${endStr}`
    } else {
      contextLine = `${event.sessions_total} buổi liên tiếp`
    }
  } else {
    const remaining = event.sessions_total - event.session_number
    if (remaining > 0) {
      const endStr = event.run_end_date ? formatDay(event.run_end_date) : null
      contextLine = endStr
        ? `Còn ${remaining} buổi · Kết thúc ${endStr}`
        : `Còn ${remaining} buổi`
    } else {
      contextLine = 'Buổi cuối cùng'
    }
  }

  return (
    <button
      onClick={onClick}
      className="w-full bg-surface rounded-[14px] px-[14px] py-3 flex items-stretch gap-3 text-left transition-opacity active:opacity-80"
      style={{
        border: `1px solid ${event.event_type === 'retreat' ? 'rgba(91,33,182,0.15)' : 'rgba(26,24,22,0.10)'}`,
        boxShadow: '0 1px 8px rgba(26,24,22,0.05)',
      }}
    >
      <div className="text-center w-11 flex-shrink-0 flex flex-col items-center justify-center">
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

      <div className="w-px bg-border flex-shrink-0" />

      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-i2 truncate">
            {event.course_name}
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-[1px] rounded flex-shrink-0"
            style={{ background: '#FEF4D6', color: '#8B5A15' }}
          >
            {sessionLabel}
          </span>
        </div>
        <div className="text-[13px] font-semibold text-ink truncate mb-0.5">
          {event.title}
        </div>
        <div className="text-[11px] text-i3 mb-0.5">
          {weekday}, {formatTime(event.start_time)}
          {endDate && ` – ${formatTime(event.end_time!)}`}
          {event.platform && ` · ${event.platform}`}
          {event.location && ` · ${event.location}`}
        </div>
        <div className="text-[10px] text-i3 italic">{contextLine}</div>
      </div>

      <span
        className="text-[10px] font-semibold px-2 py-[3px] rounded-full flex-shrink-0 self-start"
        style={{ background: badge.bg, color: badge.color }}
      >
        {badge.label}
      </span>
    </button>
  )
}
