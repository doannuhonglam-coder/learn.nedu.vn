import type { NoiStatus } from '../../../shared/types'
import { toast } from '../../../shared/components/ui/Toast'

interface WelcomeHeaderProps {
  fullName: string
  statusLabel: string
  noiStatus: NoiStatus | null
  stats: { active_courses: number; completion_percent: number; certificates_count: number }
  onCoursesClick: () => void
  onCertificatesClick: () => void
}

export function WelcomeHeader({
  fullName,
  statusLabel,
  noiStatus,
  stats,
  onCoursesClick,
  onCertificatesClick,
}: WelcomeHeaderProps) {
  const today = new Date()
  const weekday = today.toLocaleDateString('vi-VN', { weekday: 'long' })
  const dateStr = `${weekday} · ${String(today.getDate()).padStart(2, '0')} Tháng ${today.getMonth() + 1}, ${today.getFullYear()}`

  const handleNoiClick = () => {
    toast('N-ơi là cộng đồng dành cho học viên tốt nghiệp Nedu · Sắp ra mắt', 'info')
  }

  return (
    <div
      className="relative overflow-hidden rounded-[14px] mx-4 mt-[14px] px-5 pt-5 pb-[22px]"
      style={{ background: 'linear-gradient(135deg, #1A1816 0%, #2C2A26 100%)' }}
    >
      <div className="deco-circles" />

      <div
        className="relative z-[1] font-mono text-[11px] mb-1.5 uppercase"
        style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}
      >
        {dateStr}
      </div>

      <div className="relative z-[1] flex flex-wrap items-center gap-2 mb-2.5">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            background: 'rgba(245,183,49,0.15)',
            border: '1px solid rgba(245,183,49,0.3)',
            color: '#F5B731',
            letterSpacing: '0.04em',
          }}
        >
          ✦ {statusLabel}
        </span>
        <button
          onClick={handleNoiClick}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            background: 'rgba(107,63,160,0.35)',
            border: '1px solid rgba(180,140,255,0.35)',
            color: '#D4A8FF',
            letterSpacing: '0.04em',
          }}
        >
          🔮 {noiStatus ? noiStatus.label : 'N-ơi · Khám phá'}
        </button>
      </div>

      <h1
        className="relative z-[1] font-display text-[22px] font-semibold text-white leading-[1.2] mb-1"
      >
        Chào {fullName} 👋
      </h1>

      <div className="relative z-[1] flex gap-[14px] mt-2.5">
        <button
          onClick={onCoursesClick}
          className="flex-1 rounded-lg px-3 py-2 text-left"
          style={{ background: 'rgba(255,255,255,0.10)' }}
        >
          <div className="font-display text-[18px] font-bold text-white leading-none">
            {stats.active_courses}
          </div>
          <div
            className="text-[10px] font-medium mt-0.5 uppercase"
            style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
          >
            Khoá học
          </div>
        </button>

        <button
          onClick={onCoursesClick}
          className="flex-1 rounded-lg px-3 py-2 text-left"
          style={{ background: 'rgba(255,255,255,0.10)' }}
        >
          <div className="font-display text-[18px] font-bold text-white leading-none">
            {stats.completion_percent}%
          </div>
          <div
            className="text-[10px] font-medium mt-0.5 uppercase"
            style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
          >
            Hoàn thành
          </div>
        </button>

        <button
          onClick={onCertificatesClick}
          className="flex-1 rounded-lg px-3 py-2 text-left"
          style={{ background: 'rgba(255,255,255,0.10)' }}
        >
          <div className="font-display text-[18px] font-bold text-white leading-none">
            {stats.certificates_count}
          </div>
          <div
            className="text-[10px] font-medium mt-0.5 uppercase"
            style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
          >
            Chứng chỉ
          </div>
        </button>
      </div>
    </div>
  )
}
