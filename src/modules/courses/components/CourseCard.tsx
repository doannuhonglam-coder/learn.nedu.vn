import type { EnrollmentSummary, CourseType } from '../../../shared/types'
import { Badge } from '../../../shared/components/ui/Badge'
import { ProgressBar } from '../../../shared/components/ui/ProgressBar'
import { CountdownTimer } from './CountdownTimer'
import { toast } from '../../../shared/components/ui/Toast'

interface CourseCardProps {
  enrollment: EnrollmentSummary
  onOpenCourse: (courseId: string, tab?: string) => void
}

const typeConfig: Record<CourseType, { label: string; icon: string; variant: 'retreat' | 'cohort' | 'on-demand' | 'coaching' }> = {
  retreat: { label: 'Retreat', icon: '🌿', variant: 'retreat' },
  cohort: { label: 'Cohort', icon: '👥', variant: 'cohort' },
  on_demand: { label: 'On-demand', icon: '🎥', variant: 'on-demand' },
  coaching: { label: '1:1 Coaching', icon: '🤝', variant: 'coaching' },
}

export function CourseCard({ enrollment, onOpenCourse }: CourseCardProps) {
  const { course } = enrollment
  const config = typeConfig[course.course_type]

  return (
    <div
      className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onOpenCourse(course.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant={config.variant}>
          {config.icon} {config.label}
        </Badge>
        {enrollment.status === 'completed' && (
          <span className="text-xs text-brand-green font-medium">✓ Hoàn thành</span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-brand-dark mt-2">{course.name}</h3>
      <p className="text-xs text-gray-500 mt-0.5">{course.instructor_name}</p>

      {/* Retreat variant */}
      {course.course_type === 'retreat' && (
        <div className="mt-3">
          {course.retreat_date && (
            <p className="text-xs text-gray-500">
              📍 {course.retreat_date && new Date(course.retreat_date).toLocaleDateString('vi-VN')}
            </p>
          )}
          <div className="mt-1.5">
            <CountdownTimer targetDate={course.retreat_date || ''} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenCourse(course.id, 'prep')
            }}
            className="mt-2 text-xs text-brand-gold font-medium"
          >
            Danh sách cần chuẩn bị →
          </button>
        </div>
      )}

      {/* Cohort variant */}
      {course.course_type === 'cohort' && (
        <div className="mt-3">
          <ProgressBar percent={enrollment.progress_percent} showLabel />
          {course.metaphysical_match_score && course.metaphysical_match_score > 70 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toast('Dựa trên hồ sơ BaZi + Nine Star Ki của bạn', 'info')
              }}
              className="mt-1.5"
            >
              <Badge variant="match">🔮 Phù hợp {course.metaphysical_match_score}%</Badge>
            </button>
          )}
        </div>
      )}

      {/* On-demand variant */}
      {course.course_type === 'on_demand' && (
        <div className="mt-3">
          <ProgressBar percent={enrollment.progress_percent} showLabel />
          <p className="text-xs text-gray-500 mt-1">Tự học</p>
          {enrollment.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenCourse(course.id, 'lessons')
              }}
              className="mt-2 text-xs text-brand-gold font-medium"
            >
              Tiếp tục học →
            </button>
          )}
        </div>
      )}

      {/* Coaching variant */}
      {course.course_type === 'coaching' && (
        <div className="mt-3">
          <p className="text-xs text-gray-600">
            Buổi {course.coaching_sessions_completed}/{course.coaching_sessions_total}
            {' · '}Còn {(course.coaching_sessions_total || 0) - (course.coaching_sessions_completed || 0)} buổi
          </p>
        </div>
      )}
    </div>
  )
}
