import type { StudentProfile } from '../../../shared/types'
import { toast } from '../../../shared/components/ui/Toast'

interface ProfileHeaderProps {
  profile: StudentProfile
  stats: { courses: number; certificates: number; progress: number }
  onCoursesClick: () => void
  onCertificatesClick: () => void
}

export function ProfileHeader({ profile, stats, onCoursesClick, onCertificatesClick }: ProfileHeaderProps) {
  const initials = profile.full_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="px-4">
      <div className="text-center pt-5 pb-4">
        <button
          onClick={() => toast('📸 Tính năng đổi ảnh đang phát triển', 'info')}
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-[28px] font-bold text-white border-[3px] border-white"
          style={{
            background: 'linear-gradient(135deg, #F5B731, #D4920A)',
            boxShadow: '0 4px 20px rgba(26,24,22,0.18)',
          }}
        >
          {initials}
        </button>
        <div className="font-display text-[20px] font-semibold text-ink mb-[3px]">
          {profile.full_name}
        </div>
        <div className="text-[12px] text-i3 mb-4">
          Học viên · Nedu Education{profile.student_code ? ` · ID: ${profile.student_code}` : ''}
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onCoursesClick}
            className="flex-1 bg-surface rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">{stats.courses}</div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Khoá học
            </div>
          </button>
          <button
            onClick={onCertificatesClick}
            className="flex-1 bg-surface rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">{stats.certificates}</div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Chứng chỉ
            </div>
          </button>
          <button
            onClick={onCoursesClick}
            className="flex-1 bg-surface rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">{stats.progress}%</div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Tiến độ
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
