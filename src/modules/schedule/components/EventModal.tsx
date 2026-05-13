import { useState, useEffect } from 'react'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { toast } from '../../../shared/components/ui/Toast'
import type { ScheduleEvent } from '../../../shared/types'

// ── Calendar helpers ──────────────────────────────────────────────

function toIcsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function buildGoogleCalendarUrl(event: ScheduleEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toIcsDate(event.start_time)}/${toIcsDate(event.end_time)}`,
    details: `${event.course_name} · ${event.instructor_name}${event.description ? '\n\n' + event.description : ''}${event.meeting_url ? '\n\nLink: ' + event.meeting_url : ''}`,
    location: event.location || event.platform || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function buildOutlookCalendarUrl(event: ScheduleEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.start_time,
    enddt: event.end_time,
    body: `${event.course_name} · ${event.instructor_name}${event.description ? '\n\n' + event.description : ''}`,
    location: event.location || event.platform || '',
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

function downloadIcs(event: ScheduleEvent) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nedu Learn//VI',
    'BEGIN:VEVENT',
    `UID:${event.id}@nedu.vn`,
    `DTSTART:${toIcsDate(event.start_time)}`,
    `DTEND:${toIcsDate(event.end_time)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.course_name} - ${event.instructor_name}${event.description ? ' - ' + event.description : ''}`,
    event.location
      ? `LOCATION:${event.location}`
      : event.platform
        ? `LOCATION:${event.platform}`
        : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, '_')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

async function copyToClipboard(event: ScheduleEvent) {
  const date = new Date(event.start_time)
  const endDate = new Date(event.end_time)
  const text = [
    `📅 ${event.title}`,
    `⏰ ${date.toLocaleString('vi-VN')} – ${endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
    event.location ? `📍 ${event.location}` : event.platform ? `🌐 ${event.platform}` : '',
    event.course_name ? `📚 ${event.course_name} · ${event.instructor_name}` : '',
    event.meeting_url ? `🔗 ${event.meeting_url}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  await navigator.clipboard.writeText(text)
}

// ── Add to Calendar Picker ────────────────────────────────────────

interface AddToCalendarPickerProps {
  open: boolean
  event: ScheduleEvent
  onClose: () => void
}

function AddToCalendarPicker({ open, event, onClose }: AddToCalendarPickerProps) {
  if (!open) return null

  const handleGoogle = () => {
    window.open(buildGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer')
    toast('📅 Mở Google Calendar...', 'success')
    onClose()
  }

  const handleOutlook = () => {
    window.open(buildOutlookCalendarUrl(event), '_blank', 'noopener,noreferrer')
    toast('📅 Mở Outlook Calendar...', 'success')
    onClose()
  }

  const handleIcs = () => {
    downloadIcs(event)
    toast('📥 Đã tải file .ics — mở để thêm vào Apple Calendar', 'success')
    onClose()
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(event)
      toast('📋 Đã sao chép thông tin sự kiện', 'success')
      onClose()
    } catch {
      toast('Không thể sao chép', 'error')
    }
  }

  const options = [
    {
      onClick: handleGoogle,
      iconBg: '#fff',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill="#fff" d="M20 4v16H4V4z" />
          <path fill="#EA4335" d="M20 4v6h-3.4l-2.6-6z" />
          <path fill="#34A853" d="M20 20v-6h-3.4l-2.6 6z" />
          <path fill="#4285F4" d="M4 20h6v-3.4l-6-2.6z" />
          <path fill="#FBBC05" d="M4 4h6v3.4L4 10z" />
          <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4285F4">28</text>
        </svg>
      ),
      title: 'Google Calendar',
      sub: 'Mở để thêm sự kiện (đã điền sẵn)',
    },
    {
      onClick: handleOutlook,
      iconBg: '#0078D4',
      icon: <span className="text-white text-[18px] font-bold">O</span>,
      title: 'Outlook Calendar',
      sub: 'Mở Outlook web để thêm',
    },
    {
      onClick: handleIcs,
      iconBg: '#000',
      icon: <span className="text-white text-[16px]">🍎</span>,
      title: 'Apple Calendar (.ics)',
      sub: 'Tải file để thêm vào Apple/Outlook desktop',
    },
    {
      onClick: handleCopy,
      iconBg: '#F5F3EF',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4A4540" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Sao chép thông tin',
      sub: 'Paste vào tin nhắn, ghi chú...',
    },
  ]

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(26,24,22,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[420px] bg-surface rounded-t-[20px] overflow-hidden"
        style={{
          maxHeight: '80vh',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
          animation: 'slideUp 0.3s cubic-bezier(.25,.46,.45,.94)',
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(26,24,22,0.10)' }} />
        </div>

        <div className="px-5 pt-3 pb-2">
          <h3 className="font-display text-[16px] font-semibold text-ink">
            Thêm vào lịch
          </h3>
          <p className="text-[11px] text-i3 mt-0.5">
            Chọn ứng dụng lịch bạn muốn dùng
          </p>
        </div>

        <div className="px-3 py-2 space-y-1">
          {options.map((opt) => (
            <button
              key={opt.title}
              onClick={opt.onClick}
              className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-s2 transition-colors text-left"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: opt.iconBg, border: '1px solid rgba(26,24,22,0.08)' }}
              >
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink">{opt.title}</div>
                <div className="text-[11px] text-i3 mt-px">{opt.sub}</div>
              </div>
              <span className="text-i3 text-[16px]">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Event Modal ───────────────────────────────────────────────────

interface EventModalProps {
  event: ScheduleEvent | null
  onClose: () => void
}

export function EventModal({ event, onClose }: EventModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

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

  const badgeStyle =
    event.event_type === 'retreat'
      ? { bg: '#EDE9FE', color: '#5B21B6', label: '🌿 Retreat' }
      : event.event_type === 'offline'
        ? { bg: '#FEF4D6', color: '#D4920A', label: '📍 Offline' }
        : { bg: '#FEF4D6', color: '#D4920A', label: '🌐 Online' }

  return (
    <BottomSheet open={!!event} onClose={onClose} title={event.title}>
      <div className="space-y-3">
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{ background: badgeStyle.bg, color: badgeStyle.color }}
        >
          {badgeStyle.label}
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl px-3 py-2.5" style={{ background: '#F5F3EF' }}>
            <div
              className="font-mono text-[10px] font-semibold uppercase text-i3 mb-0.5"
              style={{ letterSpacing: '0.05em' }}
            >
              Ngày
            </div>
            <div className="text-[13px] font-semibold text-ink capitalize">
              {date.toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: 'numeric',
                month: 'numeric',
              })}
            </div>
          </div>
          <div className="rounded-xl px-3 py-2.5" style={{ background: '#F5F3EF' }}>
            <div
              className="font-mono text-[10px] font-semibold uppercase text-i3 mb-0.5"
              style={{ letterSpacing: '0.05em' }}
            >
              Giờ
            </div>
            <div className="text-[13px] font-semibold text-ink">
              {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              {' – '}
              {endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {event.course_name && (
          <div className="rounded-xl px-3 py-2.5" style={{ background: '#F5F3EF' }}>
            <div
              className="font-mono text-[10px] font-semibold uppercase text-i3 mb-0.5"
              style={{ letterSpacing: '0.05em' }}
            >
              Khoá học
            </div>
            <div className="text-[13px] font-semibold text-ink">{event.course_name}</div>
            <div className="text-[11px] text-i3 mt-0.5">{event.instructor_name}</div>
          </div>
        )}

        {(event.platform || event.location) && (
          <div className="rounded-xl px-3 py-2.5" style={{ background: '#F5F3EF' }}>
            <div
              className="font-mono text-[10px] font-semibold uppercase text-i3 mb-0.5"
              style={{ letterSpacing: '0.05em' }}
            >
              {event.location ? 'Địa điểm' : 'Nền tảng'}
            </div>
            <div className="text-[13px] font-semibold text-ink">
              {event.location || event.platform}
            </div>
          </div>
        )}

        {event.description && (
          <p className="text-[13px] text-i2 leading-relaxed">{event.description}</p>
        )}

        {/* Join button (online events) */}
        {event.event_type === 'online' && (
          <button
            onClick={() => {
              if (event.is_joinable && event.meeting_url) {
                window.open(event.meeting_url, '_blank', 'noopener,noreferrer')
              } else if (!event.is_joinable) {
                toast('Sự kiện chưa bắt đầu', 'info')
              }
            }}
            disabled={!event.is_joinable}
            className="w-full py-3 rounded-xl text-[14px] font-semibold transition-opacity disabled:opacity-60"
            style={{
              background: event.is_joinable ? '#1A1816' : '#F5B731',
              color: event.is_joinable ? '#F5B731' : '#1A1816',
            }}
          >
            {event.is_joinable
              ? 'Vào lớp →'
              : countdown !== null && countdown > 0
                ? `Mở sau ${formatCountdown(countdown)}`
                : 'Chưa đến giờ'}
          </button>
        )}

        {/* Add to calendar */}
        <button
          onClick={() => setPickerOpen(true)}
          className="w-full py-3 rounded-xl text-[14px] font-semibold transition-colors flex items-center justify-center gap-2"
          style={{
            background: 'transparent',
            color: '#1A1816',
            border: '1.5px solid #1A1816',
          }}
        >
          <span>📅</span>
          Thêm vào lịch
        </button>

        <p className="text-[10px] text-i3 text-center px-2 leading-relaxed">
          Đồng bộ với Google Calendar, Apple Calendar, Outlook để nhận nhắc nhở tự động
        </p>
      </div>

      <AddToCalendarPicker
        open={pickerOpen}
        event={event}
        onClose={() => setPickerOpen(false)}
      />
    </BottomSheet>
  )
}
