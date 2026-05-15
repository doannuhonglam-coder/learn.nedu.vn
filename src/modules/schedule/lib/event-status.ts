import type { ScheduleEvent, UpcomingEventSummary } from '../../../shared/types'

export type EventStatus = 'live' | 'soon' | 'future' | 'done' | 'missed'

export interface EventStatusInfo {
  status: EventStatus
  label: string                // LIVE | SOON | DONE | FUTURE | MISSED
  longLabel: string            // Full status text (for modal pill)
  subtitle: (event: ScheduleEvent | UpcomingEventSummary) => string  // Compact line for list item
  bg: string                   // Badge background
  color: string                // Badge text color
  ctaLabel: string             // Primary CTA label in modal
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function platformOrLocation(e: ScheduleEvent | UpcomingEventSummary): string {
  return e.platform || e.location || ''
}

function hoursOfClass(e: ScheduleEvent | UpcomingEventSummary): string {
  const h = (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / 3_600_000
  return h >= 1 ? `${Math.round(h)} giờ học` : `${Math.round(h * 60)} phút học`
}

export function getEventStatus(
  event: ScheduleEvent | UpcomingEventSummary,
  now: number = Date.now(),
): EventStatusInfo {
  const startMs = new Date(event.start_time).getTime()
  const endMs = new Date(event.end_time).getTime()
  const minutesUntilStart = Math.floor((startMs - now) / 60_000)
  const minutesSinceEnd = Math.floor((now - endMs) / 60_000)
  const daysUntilStart = Math.floor((startMs - now) / 86_400_000)
  const daysSinceEnd = Math.floor((now - endMs) / 86_400_000)

  // LIVE
  if (now >= startMs && now < endMs) {
    return {
      status: 'live',
      label: 'LIVE',
      longLabel: '🔴 Đang diễn ra',
      subtitle: (e) =>
        `🔴 Đang diễn ra · ${formatTime(e.start_time)}–${formatTime(e.end_time)} · ${platformOrLocation(e)}`,
      bg: '#FDECEA',
      color: '#C0392B',
      ctaLabel: 'Tham gia ngay',
    }
  }

  // SOON (≤ 60 min)
  if (minutesUntilStart > 0 && minutesUntilStart <= 60) {
    return {
      status: 'soon',
      label: 'SOON',
      longLabel: `⏰ Bắt đầu trong ${minutesUntilStart} phút`,
      subtitle: (e) => `⏰ Còn ${minutesUntilStart} phút · ${platformOrLocation(e)}`,
      bg: '#FEF4D6',
      color: '#D4920A',
      ctaLabel: 'Vào lớp ngay',
    }
  }

  // FUTURE
  if (minutesUntilStart > 0) {
    const when = daysUntilStart >= 1
      ? `Còn ${daysUntilStart} ngày`
      : `Còn ${Math.floor(minutesUntilStart / 60)} giờ`
    return {
      status: 'future',
      label: 'FUTURE',
      longLabel: when,
      subtitle: (e) => `📅 ${when} · ${platformOrLocation(e)}`,
      bg: '#EDE9FE',
      color: '#5B21B6',
      ctaLabel: 'Thêm vào Lịch',
    }
  }

  // DONE (recording available OR ended in last 24h)
  const hasRecording = 'recording_url' in event && !!event.recording_url
  if (hasRecording || (minutesSinceEnd > 0 && daysSinceEnd === 0)) {
    return {
      status: 'done',
      label: 'DONE',
      longLabel: '✓ Đã hoàn thành',
      subtitle: (e) => `✅ Đã hoàn thành · ${hoursOfClass(e)}`,
      bg: '#F0FDF4',
      color: '#16A34A',
      ctaLabel: 'Xem lại buổi học',
    }
  }

  // MISSED (past, no recording)
  const whenMissed = daysSinceEnd === 0
    ? `${Math.floor(minutesSinceEnd / 60)} giờ trước`
    : `${daysSinceEnd} ngày trước`
  return {
    status: 'missed',
    label: 'MISSED',
    longLabel: `✗ Đã lỡ · ${whenMissed}`,
    subtitle: (e) => `❌ Đã lỡ ${whenMissed} · ${platformOrLocation(e)}`,
    bg: '#FDECEA',
    color: '#C0392B',
    ctaLabel: 'Xem ghi hình',
  }
}
