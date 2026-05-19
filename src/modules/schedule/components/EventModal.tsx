import { useState, useEffect } from 'react'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { toast } from '../../../shared/components/ui/Toast'
import { getEventStatus } from '../lib/event-status'
import type { ScheduleEvent } from '../../../shared/types'

// ── Calendar helpers ──────────────────────────────────────────────

function toIcsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function buildGoogleCalendarUrl(event: ScheduleEvent): string {
  const instructorLabel = event.instructor_name ?? 'Nedu'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toIcsDate(event.start_time)}/${toIcsDate(event.end_time)}`,
    details: `${event.course_name} · ${instructorLabel}${event.description ? '\n\n' + event.description : ''}${event.meeting_url ? '\n\nLink: ' + event.meeting_url : ''}`,
    location: event.location || event.platform || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function downloadIcs(event: ScheduleEvent) {
  const instructorLabel = event.instructor_name ?? 'Nedu'
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nedu Learn//VI',
    'BEGIN:VEVENT', `UID:${event.id}@nedu.vn`,
    `DTSTART:${toIcsDate(event.start_time)}`,
    `DTEND:${toIcsDate(event.end_time)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.course_name} - ${instructorLabel}`,
    event.location ? `LOCATION:${event.location}` : event.platform ? `LOCATION:${event.platform}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, '_')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Event Modal ───────────────────────────────────────────────────

interface EventModalProps {
  event: ScheduleEvent | null
  onClose: () => void
}

const REMINDER_OPTIONS = [
  { key: 'night_before', label: 'Tối hôm trước', offset: '20:00' },
  { key: '1h_before', label: 'Trước buổi 1 giờ', offset: '-1 giờ' },
  { key: '10m_before', label: 'Trước buổi 10 phút', offset: '-10 phút' },
  { key: 'at_start', label: 'Khi buổi bắt đầu', offset: '0 phút' },
] as const

export function EventModal({ event, onClose }: EventModalProps) {
  const [now, setNow] = useState(() => Date.now())
  const [prepChecked, setPrepChecked] = useState<Set<number>>(new Set())
  const [pushOn, setPushOn] = useState(true)
  const [enabledReminders, setEnabledReminders] = useState<Set<string>>(
    new Set(['night_before', '1h_before', '10m_before']),
  )

  useEffect(() => {
    if (!event) return
    const interval = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(interval)
  }, [event])

  if (!event) return null

  const statusInfo = getEventStatus(event, now)
  const isLive = statusInfo.status === 'live'
  const isSoon = statusInfo.status === 'soon'
  const isFuture = statusInfo.status === 'future'
  const isDone = statusInfo.status === 'done'
  const isMissed = statusInfo.status === 'missed'
  const isPast = isDone || isMissed

  const date = new Date(event.start_time)
  const endDate = new Date(event.end_time)

  const typeBadge =
    event.event_type === 'retreat'
      ? { bg: '#EDE9FE', color: '#5B21B6', label: 'Retreat' }
      : event.event_type === 'offline'
        ? { bg: '#FEF4D6', color: '#D4920A', label: 'Offline' }
        : { bg: '#FEF4D6', color: '#D4920A', label: 'Online' }

  const togglePrep = (i: number) => {
    setPrepChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const toggleReminder = (key: string) => {
    setEnabledReminders((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handlePrimaryAction = () => {
    if (isLive || isSoon) {
      if (event.meeting_url) {
        window.open(event.meeting_url, '_blank', 'noopener,noreferrer')
      }
    } else if (isFuture) {
      window.open(buildGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer')
      toast('📅 Mở Google Calendar...', 'success')
    } else if (isDone && event.recording_url) {
      window.open(event.recording_url, '_blank', 'noopener,noreferrer')
    } else if (isMissed) {
      toast('Sẽ thông báo khi có recording', 'info')
    }
  }

  const prepDone = prepChecked.size
  const prepTotal = event.prep_items?.length || 0

  return (
    <BottomSheet open={!!event} onClose={onClose} title={event.title}>
      <div className="space-y-3">
        {/* Status pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center text-[11px] font-bold uppercase px-3 py-1 rounded-full"
            style={{
              background: statusInfo.bg,
              color: statusInfo.color,
              letterSpacing: '0.05em',
            }}
          >
            {statusInfo.longLabel}
          </span>
          <span
            className="inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: typeBadge.bg, color: typeBadge.color }}
          >
            {typeBadge.label}
          </span>
        </div>

        {/* Course pills */}
        {event.course_name && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-i2">{event.course_name}</span>
            {event.module_title && (
              <>
                <span className="text-i3 text-[10px]">·</span>
                <span className="text-[11px] font-medium text-gold-d">
                  {event.module_title}
                </span>
              </>
            )}
          </div>
        )}

        {/* 3 quick info rows */}
        <div className="space-y-1.5">
          {/* Date + time */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#F5F3EF' }}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px] flex-shrink-0"
              style={{ background: '#FEF4D6' }}
            >
              📅
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink capitalize">
                {isPast || isFuture
                  ? date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                  : `Hôm nay · ${date.toLocaleDateString('vi-VN', { weekday: 'long' })}`}
              </div>
              <div className="text-[11px] text-i3">
                {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                {' – '}
                {endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Platform / Location */}
          {(event.platform || event.location) && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#F5F3EF' }}>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px] flex-shrink-0"
                style={{ background: event.event_type === 'online' ? '#DBEAFE' : '#FEF4D6' }}
              >
                {event.event_type === 'online' ? '🎥' : '📍'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink truncate">
                  {event.platform || event.location}
                </div>
                <div className="text-[11px] text-i3">
                  {isPast && event.recording_url
                    ? 'Đã kết thúc · Recording đã sẵn sàng'
                    : isLive || isSoon
                      ? 'Link đã sẵn sàng'
                      : event.event_type === 'offline'
                        ? 'Trực tiếp tại địa điểm'
                        : 'Link sẽ mở trước 15 phút'}
                </div>
              </div>
              {(isLive || isSoon) && event.meeting_url && (
                <button
                  onClick={() => window.open(event.meeting_url!, '_blank', 'noopener,noreferrer')}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md flex-shrink-0"
                  style={{ background: '#FEF4D6', color: '#D4920A' }}
                >
                  Mở
                </button>
              )}
            </div>
          )}

          {/* Instructor — fallback "Nedu" khi BE chưa resolve courses.metadata.instructor_ids */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#F5F3EF' }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 text-white"
              style={{ background: 'linear-gradient(135deg,#F5B731,#D4920A)' }}
            >
              {(event.instructor_name ?? 'Nedu')
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink truncate">
                {event.instructor_name ?? 'Giảng viên Nedu'}
              </div>
              <div className="text-[11px] text-i3">
                {event.instructor_name ? 'Giảng viên · Nedu' : 'Đang cập nhật'}
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={handlePrimaryAction}
          className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-opacity flex items-center justify-center gap-2"
          style={{
            background: isLive ? '#C0392B' : isSoon ? '#F5B731' : isDone ? '#1A1816' : '#1A1816',
            color: isSoon ? '#1A1816' : '#F5B731',
          }}
        >
          {isLive && <span>▶</span>}
          {isSoon && <span>▶</span>}
          {isFuture && <span>📅</span>}
          {isDone && <span>▶</span>}
          {isMissed && <span>🎥</span>}
          {statusInfo.ctaLabel}
        </button>

        {/* Secondary actions */}
        {isPast && (
          <button
            onClick={() => toast('Mở danh sách bài tập về nhà', 'info')}
            className="w-full py-3 rounded-xl text-[13px] font-semibold transition-colors"
            style={{
              background: 'transparent',
              color: '#1A1816',
              border: '1.5px solid rgba(26,24,22,0.15)',
            }}
          >
            ↓ Vẫn làm bài tập về nhà
          </button>
        )}

        {isFuture && (
          <button
            onClick={() => downloadIcs(event)}
            className="w-full py-3 rounded-xl text-[13px] font-semibold transition-colors"
            style={{
              background: 'transparent',
              color: '#1A1816',
              border: '1.5px solid rgba(26,24,22,0.15)',
            }}
          >
            🍎 Tải .ics (Apple/Outlook)
          </button>
        )}

        {/* PREP MATERIALS (pre-class) */}
        {!isPast && event.prep_items && event.prep_items.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <div
                className="font-mono text-[10px] font-bold uppercase text-i3"
                style={{ letterSpacing: '0.06em' }}
              >
                Chuẩn bị trước buổi
              </div>
              <div
                className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ background: '#FEF4D6', color: '#D4920A' }}
              >
                {prepDone}/{prepTotal}
              </div>
            </div>
            <div
              className="bg-surface rounded-[14px] px-3 py-2 space-y-1"
              style={{ border: '1px solid rgba(26,24,22,0.10)' }}
            >
              {event.prep_items.map((item, i) => {
                const checked = prepChecked.has(i)
                return (
                  <button
                    key={i}
                    onClick={() => togglePrep(i)}
                    className="w-full flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-s2 transition-colors text-left"
                  >
                    <div
                      className="w-[18px] h-[18px] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: checked ? '#1A1816' : 'transparent',
                        border: checked ? '1.5px solid #1A1816' : '1.5px solid rgba(26,24,22,0.20)',
                      }}
                    >
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M1.5 5L4 7.5L8.5 2"
                            stroke="#F5B731"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-[13px] flex-1"
                      style={{
                        color: checked ? '#8A8480' : '#4A4540',
                        textDecoration: checked ? 'line-through' : 'none',
                      }}
                    >
                      {item}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* POST MATERIALS (after class) */}
        {isPast && (
          <div>
            <div
              className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
              style={{ letterSpacing: '0.06em' }}
            >
              Tài liệu sau buổi
            </div>
            <div
              className="bg-surface rounded-[14px] divide-y"
              style={{ border: '1px solid rgba(26,24,22,0.10)' }}
            >
              <MaterialRow icon="🎥" title="Recording đầy đủ" sub="~1h 30 · Cần xem để hiểu" />
              <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />
              <MaterialRow icon="📄" title="Slide buổi học (PDF)" sub="42 trang" />
              <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />
              <MaterialRow icon="✨" title="Tóm tắt AI · 7 điểm chính" sub="2 phút đọc" badge="MỚI" />
            </div>
          </div>
        )}

        {/* REMINDERS (future + soon only) */}
        {(isFuture || isSoon) && (
          <div>
            <div
              className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
              style={{ letterSpacing: '0.06em' }}
            >
              Nhắc tôi
            </div>
            <div
              className="bg-surface rounded-[14px]"
              style={{ border: '1px solid rgba(26,24,22,0.10)' }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-[16px]">🔔</span>
                  <div>
                    <div className="text-[13px] font-semibold text-ink">Push notification</div>
                    <div className="text-[11px] text-i3 mt-0.5">
                      {enabledReminders.size}/{REMINDER_OPTIONS.length} mức đã bật
                    </div>
                  </div>
                </div>
                <Toggle on={pushOn} onChange={() => setPushOn(!pushOn)} />
              </div>
              {pushOn &&
                REMINDER_OPTIONS.map((r, i) => {
                  const enabled = enabledReminders.has(r.key)
                  return (
                    <div key={r.key}>
                      {i === 0 && <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />}
                      <button
                        onClick={() => toggleReminder(r.key)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left active:bg-s2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-[18px] h-[18px] rounded-md flex items-center justify-center flex-shrink-0"
                            style={{
                              background: enabled ? '#1A1816' : 'transparent',
                              border: enabled ? '1.5px solid #1A1816' : '1.5px solid rgba(26,24,22,0.20)',
                            }}
                          >
                            {enabled && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path
                                  d="M1.5 5L4 7.5L8.5 2"
                                  stroke="#F5B731"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-[13px] text-ink">{r.label}</span>
                        </div>
                        <span className="font-mono text-[11px] text-i3">{r.offset}</span>
                      </button>
                      {i < REMINDER_OPTIONS.length - 1 && (
                        <div style={{ borderTop: '1px solid rgba(26,24,22,0.06)' }} />
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div>
            <div
              className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
              style={{ letterSpacing: '0.06em' }}
            >
              Buổi học
            </div>
            <p className="text-[13px] text-i2 leading-relaxed px-1">{event.description}</p>
          </div>
        )}

        {/* AI tutor hint (past only) */}
        {isPast && (
          <div
            className="rounded-xl px-3 py-2.5 flex items-start gap-2"
            style={{
              background: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)',
              border: '1px solid rgba(91,33,182,0.15)',
            }}
          >
            <span className="text-[16px] mt-0.5">✨</span>
            <span className="text-[11px] leading-relaxed" style={{ color: '#5B21B6' }}>
              <strong>Tự ôn:</strong> Bạn có thể đặt câu hỏi với BOT 24/24 về buổi học này.
              App sẽ trả lời dựa trên nội dung và recording.
            </span>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

function MaterialRow({
  icon,
  title,
  sub,
  badge,
}: {
  icon: string
  title: string
  sub: string
  badge?: string
}) {
  return (
    <button
      onClick={() => toast(`Mở ${title}`, 'info')}
      className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors"
    >
      <div className="text-[20px] flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-ink truncate">{title}</div>
        <div className="text-[11px] text-i3 mt-0.5">{sub}</div>
      </div>
      {badge && (
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
          style={{ background: '#FEF4D6', color: '#D4920A' }}
        >
          {badge}
        </span>
      )}
      <span className="text-i3 text-[14px]">›</span>
    </button>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative rounded-[12px] flex-shrink-0 transition-colors"
      style={{
        width: 42,
        height: 24,
        background: on ? '#F5B731' : 'rgba(26,24,22,0.10)',
      }}
    >
      <span
        className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform"
        style={{
          transform: on ? 'translateX(18px)' : 'translateX(0)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  )
}
