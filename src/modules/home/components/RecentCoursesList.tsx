import { useNavigate } from 'react-router-dom'
import type { CourseSummary, CourseType } from '../../../shared/types'

interface RecentCoursesListProps {
  courses: CourseSummary[]
  onOpenCourse: (courseId: string) => void
}

const badgeStyles: Record<CourseType, { bg: string; color: string; label: string; icon: string }> = {
  retreat: { bg: '#EDE9FE', color: '#5B21B6', label: 'Retreat', icon: '🌿' },
  cohort: { bg: '#F5F3EF', color: '#2C2A26', label: 'Cohort', icon: '👥' },
  on_demand: { bg: '#FEF4D6', color: '#D4920A', label: 'On-demand', icon: '🎥' },
  coaching: { bg: '#FEF4D6', color: '#D4920A', label: 'Coaching', icon: '🤝' },
}

export function RecentCoursesList({ courses, onOpenCourse }: RecentCoursesListProps) {
  const navigate = useNavigate()

  if (courses.length === 0) return null

  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-display text-[16px] font-semibold text-ink">Khoá Học Của Tôi</h2>
        <button onClick={() => navigate('/courses')} className="text-[12px] font-medium text-gold-d">
          Xem tất cả →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {courses.map((course) => {
          const badge = badgeStyles[course.course_type]
          return (
            <button
              key={course.id}
              onClick={() => onOpenCourse(course.id)}
              className="flex-shrink-0 w-[260px] bg-surface rounded-[14px] p-4 text-left transition-transform active:scale-[.98]"
              style={{
                border: '1px solid rgba(26,24,22,0.10)',
                boxShadow: '0 2px 16px rgba(26,24,22,0.08)',
              }}
            >
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-[3px] rounded-full mb-2.5"
                style={{ background: badge.bg, color: badge.color, letterSpacing: '0.03em' }}
              >
                {badge.icon} {badge.label}
              </span>
              <div className="font-display text-[14px] font-semibold text-ink leading-[1.35] mb-2">
                {course.name}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-i3 mb-2.5">
                <span
                  className="w-[18px] h-[18px] rounded-full inline-flex items-center justify-center text-[9px] font-extrabold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #F5B731, #D4920A)',
                    color: '#1A1816',
                  }}
                >
                  {course.instructor_name.charAt(0).toUpperCase()}
                </span>
                {course.instructor_name}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
