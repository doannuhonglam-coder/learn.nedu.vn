import { useState, useEffect } from 'react'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import type { ScheduleEvent } from '../../../shared/types'

function downloadIcs(event: ScheduleEvent) {
  const formatDate = (d: string) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nedu Learn//VI',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.start_time)}`,
    `DTEND:${formatDate(event.end_time)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.course_name} - ${event.instructor_name}`,
    event.location ? `LOCATION:${event.location}` : event.platform ? `LOCATION:${event.platform}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, '_')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

interface EventModalProps {
  event: ScheduleEvent | null
  onClose: () => void
}

export function EventModal({ event, onClose }: EventModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (!event || event.is_joinable || !event.join_available_in_seconds) {
      setCountdown(null)
      return
    }
    setCountdown(event.join_available_in_seconds)
    const interval = setInterval(() => {
      setCountdown((prev) => (prev && prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [event])

  if (!event) return null

  const date = new Date(event.start_time)
  const endDate = new Date(event.end_time)

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
  }

  const eventBadgeVariant = {
    online: 'cohort' as const,
    offline: 'coaching' as const,
    retreat: 'retreat' as const,
  }

  return (
    <BottomSheet open={!!event} onClose={onClose} title={event.title}>
      <div className="space-y-4">
        <Badge variant={eventBadgeVariant[event.event_type]}>
          {event.event_type === 'online' ? '🌐 Online' : event.event_type === 'offline' ? '📍 Offline' : '🌿 Retreat'}
        </Badge>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[11px] text-gray-400">Ngày</p>
            <p className="text-sm font-medium text-brand-dark">
              {date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[11px] text-gray-400">Giờ</p>
            <p className="text-sm font-medium text-brand-dark">
              {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              {' – '}
              {endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {event.course_name && (
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[11px] text-gray-400">Khoá học</p>
            <p className="text-sm font-medium text-brand-dark">{event.course_name}</p>
            <p className="text-xs text-gray-500">{event.instructor_name}</p>
          </div>
        )}

        {event.platform && (
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[11px] text-gray-400">Nền tảng</p>
            <p className="text-sm font-medium text-brand-dark">{event.platform}</p>
          </div>
        )}

        {event.location && (
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[11px] text-gray-400">Địa điểm</p>
            <p className="text-sm font-medium text-brand-dark">{event.location}</p>
          </div>
        )}

        {event.description && (
          <p className="text-sm text-gray-600">{event.description}</p>
        )}

        {/* Join button */}
        {event.event_type === 'online' && (
          <Button
            className="w-full"
            disabled={!event.is_joinable}
            onClick={() => {
              if (event.meeting_url) window.open(event.meeting_url, '_blank')
            }}
          >
            {event.is_joinable
              ? 'Vào lớp →'
              : countdown !== null && countdown > 0
                ? `Mở sau ${formatCountdown(countdown)}`
                : 'Chưa đến giờ'
            }
          </Button>
        )}

        {/* Add to calendar */}
        <button
          onClick={() => downloadIcs(event)}
          className="block w-full text-center py-2.5 text-sm text-brand-gold font-medium hover:underline"
        >
          Thêm vào lịch 📅
        </button>
      </div>
    </BottomSheet>
  )
}
