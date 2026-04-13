import { useNavigate } from 'react-router-dom'
import type { StudentProfile, StreakStats } from '../../../shared/types'

interface ProfileHeaderProps {
  profile: StudentProfile
  streak: StreakStats | null
  stats: { courses: number; certificates: number; progress: number }
  onCertificatesClick: () => void
}

export function ProfileHeader({ profile, streak, stats, onCertificatesClick }: ProfileHeaderProps) {
  const navigate = useNavigate()
  const initials = profile.full_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-gold text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-brand-dark">{profile.full_name}</h2>
          <p className="text-xs text-gray-500">{profile.student_code || 'Học viên Nedu'}</p>
          {streak && streak.current_streak_weeks > 0 && (
            <p className="text-xs text-brand-gold font-medium mt-0.5">
              🔥 {streak.current_streak_weeks} tuần liên tiếp
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <button
          onClick={() => navigate('/courses')}
          className="bg-gray-50 rounded-xl py-2.5 px-2 text-center hover:bg-gray-100 transition-colors"
        >
          <p className="text-lg font-bold text-brand-dark">{stats.courses}</p>
          <p className="text-[10px] text-gray-500">Khoá học</p>
        </button>
        <button
          onClick={onCertificatesClick}
          className="bg-gray-50 rounded-xl py-2.5 px-2 text-center hover:bg-gray-100 transition-colors"
        >
          <p className="text-lg font-bold text-brand-dark">{stats.certificates}</p>
          <p className="text-[10px] text-gray-500">Chứng chỉ</p>
        </button>
        <div className="bg-gray-50 rounded-xl py-2.5 px-2 text-center">
          <p className="text-lg font-bold text-brand-dark">{stats.progress}%</p>
          <p className="text-[10px] text-gray-500">Tiến độ</p>
        </div>
      </div>
    </div>
  )
}
