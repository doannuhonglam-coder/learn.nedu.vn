import { useQuery } from '@tanstack/react-query'
import type { MetaphysicalProfile } from '../../../shared/types'
import { certificatesService } from '../../certificates/services/certificates.service'

interface JourneySectionProps {
  metaphysical: MetaphysicalProfile | null
  streakDays: number
  onOpenBaZi: () => void
  onOpenCertificates: () => void
  onOpenStreak: () => void
}

export function JourneySection({
  metaphysical,
  streakDays,
  onOpenBaZi,
  onOpenCertificates,
  onOpenStreak,
}: JourneySectionProps) {
  const { data: certificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: certificatesService.getCertificates,
  })

  const unlockedCerts = (certificates || []).filter((c) => !c.is_locked)
  const latestCert = unlockedCerts[0]

  const baziTags: string[] = []
  if (metaphysical?.bazi) baziTags.push(metaphysical.bazi.day_master)
  if (metaphysical?.enneagram) baziTags.push('Ma Kết')
  if (metaphysical?.nine_star_ki) baziTags.push(metaphysical.nine_star_ki.star_name)
  const baziSummary =
    baziTags.length > 0
      ? baziTags.slice(0, 3).join(' · ')
      : 'Nhâm Thân · Ma Kết · Sao 7 Kim'

  const certSummary = latestCert
    ? `Mới nhất: ${latestCert.title.replace('Chứng chỉ ', '')}`
    : 'Chưa có chứng chỉ'

  const streakSummary =
    streakDays >= 30
      ? 'Đã đạt mốc 30 ngày · Đỉnh!'
      : `Tiếp tục để đạt mốc 30 ngày`

  return (
    <div className="px-4 mt-5">
      <div
        className="font-mono text-[11px] font-bold uppercase text-i3 mb-2 px-1"
        style={{ letterSpacing: '0.08em' }}
      >
        Hành Trình Của Bạn
      </div>

      <div
        className="bg-surface rounded-[14px] divide-y"
        style={{
          border: '1px solid rgba(26,24,22,0.10)',
          ['--tw-divide-opacity' as never]: 1,
          borderColor: 'rgba(26,24,22,0.10)',
        }}
      >
        {/* BaZi */}
        <button
          onClick={onOpenBaZi}
          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors first:rounded-t-[14px]"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-display text-[13px] font-bold flex-shrink-0"
            style={{ background: '#F5F3EF', color: '#8A8480' }}
          >
            1
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">Hồ sơ BaZi</div>
            <div className="text-[11px] text-i3 mt-0.5 truncate">{baziSummary}</div>
          </div>
          <span className="text-i3 text-[16px]">›</span>
        </button>

        <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />

        {/* Certificates */}
        <button
          onClick={onOpenCertificates}
          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#FDE68A,#B45309)',
              color: 'white',
              fontFamily: 'serif',
            }}
          >
            1st
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">Chứng chỉ đã đạt</div>
            <div className="text-[11px] text-i3 mt-0.5 truncate">{certSummary}</div>
          </div>
          <span
            className="text-[13px] font-bold text-gold-d mr-1"
          >
            {unlockedCerts.length}
          </span>
          <span className="text-i3 text-[16px]">›</span>
        </button>

        <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />

        {/* Streak */}
        <button
          onClick={onOpenStreak}
          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors last:rounded-b-[14px]"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] flex-shrink-0"
            style={{ background: '#FEF4D6' }}
          >
            🔥
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">Chuỗi ngày học</div>
            <div className="text-[11px] text-i3 mt-0.5 truncate">{streakSummary}</div>
          </div>
          <span
            className="text-[11px] font-bold px-2 py-1 rounded-md mr-1"
            style={{ background: '#FEF4D6', color: '#D4920A' }}
          >
            {streakDays} ngày
          </span>
          <span className="text-i3 text-[16px]">›</span>
        </button>
      </div>
    </div>
  )
}
