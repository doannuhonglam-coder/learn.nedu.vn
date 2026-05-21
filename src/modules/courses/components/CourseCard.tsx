import type { CourseSummary, CourseType } from '../../../shared/types'
import { ProgressBar } from '../../../shared/components/ui/ProgressBar'
import { CountdownTimer } from './CountdownTimer'
import { toast } from '../../../shared/components/ui/Toast'

interface CourseCardProps {
  course: CourseSummary
  onOpenCourse: (runId: string, tab?: string) => void
}

const typeConfig: Record<CourseType, { label: string; icon: string; bg: string; color: string }> = {
  retreat: { label: 'Retreat', icon: '🌿', bg: '#EDE9FE', color: '#5B21B6' },
  cohort: { label: 'Cohort', icon: '👥', bg: '#F5F3EF', color: '#2C2A26' },
  on_demand: { label: 'On-demand', icon: '🎥', bg: '#FEF4D6', color: '#D4920A' },
  coaching: { label: '1:1 Coaching', icon: '🤝', bg: '#FEF4D6', color: '#D4920A' },
}

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatFullDate(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function calcNights(startISO: string, endISO: string): { days: number; nights: number } {
  const start = new Date(startISO)
  const end = new Date(endISO)
  const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1
  return { days, nights: Math.max(days - 1, 0) }
}

export function CourseCard({ course, onOpenCourse }: CourseCardProps) {
  // Fallback `on_demand` cho course_type ngoài enum — guard cùng pattern với
  // RecentCoursesList để 1 row lạ không sập cả listing /courses.
  const config = typeConfig[course.course_type] ?? typeConfig.on_demand
  // BE Phase 1 không expose enrollment_status — derive completion từ progress.
  const isCompleted = course.progress_percent >= 100

  return (
    <div
      className="p-4 bg-surface rounded-2xl cursor-pointer transition-shadow hover:shadow-md"
      style={{
        border: '1px solid rgba(26,24,22,0.10)',
        boxShadow: '0 1px 8px rgba(26,24,22,0.05)',
      }}
      onClick={() => onOpenCourse(course.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-[3px] rounded-full"
          style={{ background: config.bg, color: config.color, letterSpacing: '0.03em' }}
        >
          {config.icon} {config.label}
        </span>
        {isCompleted && (
          <span className="text-[10px] font-semibold text-gold-d">✓ Hoàn thành</span>
        )}
      </div>

      <h3 className="font-display text-[14px] font-semibold text-ink mt-2 leading-[1.35]">
        {course.name}
      </h3>
      {course.instructor_name && (
        <p className="text-[11px] text-i3 mt-0.5">{course.instructor_name}</p>
      )}

      {/* Retreat: date range + days/nights + countdown */}
      {course.course_type === 'retreat' && course.retreat_date && (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="text-[12px] font-semibold text-ink">
              📅 {formatShortDate(course.retreat_date)}
              {course.retreat_end_date && ` – ${formatFullDate(course.retreat_end_date)}`}
            </p>
            {course.retreat_end_date && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ background: '#EDE9FE', color: '#5B21B6' }}
              >
                {(() => {
                  const { days, nights } = calcNights(course.retreat_date, course.retreat_end_date)
                  return `${days} ngày ${nights} đêm`
                })()}
              </span>
            )}
          </div>
          <div>
            <CountdownTimer targetDate={course.retreat_date} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenCourse(course.id, 'prep')
            }}
            className="mt-2 text-[11px] text-gold-d font-medium"
          >
            Danh sách cần chuẩn bị →
          </button>
        </div>
      )}

      {/* Cohort: timeline + module progress + progress bar + match */}
      {course.course_type === 'cohort' && (
        <div className="mt-3">
          {/* Timeline DD/MM → DD/MM — distinguish K13 vs K14 cùng course */}
          {course.cohort_start_date && course.cohort_end_date && (
            <p className="text-[11px] text-i2 font-medium mb-1">
              📅 {formatShortDate(course.cohort_start_date)} → {formatFullDate(course.cohort_end_date)}
            </p>
          )}
          {course.current_module && course.total_modules && (
            <p className="text-[11px] text-i2 font-medium mb-1.5">
              📚 Module {course.current_module}/{course.total_modules}
            </p>
          )}
          <ProgressBar percent={course.progress_percent} showLabel />
          {course.metaphysical_match_score && course.metaphysical_match_score > 70 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toast('Dựa trên hồ sơ BaZi + Nine Star Ki của bạn', 'info')
              }}
              className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-[3px] rounded-full"
              style={{ background: '#EDE9FE', color: '#6B3FA0' }}
            >
              🔮 Phù hợp {course.metaphysical_match_score}%
            </button>
          )}
        </div>
      )}

      {/* On-demand: module progress + progress bar */}
      {course.course_type === 'on_demand' && (
        <div className="mt-3">
          {course.current_module && course.total_modules && (
            <p className="text-[11px] text-i2 font-medium mb-1.5">
              📚 Module {course.current_module}/{course.total_modules} · Tự học
            </p>
          )}
          <ProgressBar percent={course.progress_percent} showLabel />
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenCourse(course.id, 'lessons')
              }}
              className="mt-2 text-[11px] text-gold-d font-medium"
            >
              Tiếp tục học →
            </button>
          )}
        </div>
      )}

      {/* Coaching: session count + progress bar */}
      {course.course_type === 'coaching' && (
        <div className="mt-3">
          <p className="text-[11px] text-i2 font-medium mb-1.5">
            🤝 Buổi {course.coaching_sessions_completed}/{course.coaching_sessions_total}
            {' · '}
            <span className="text-i3 font-normal">
              Còn {(course.coaching_sessions_total || 0) - (course.coaching_sessions_completed || 0)} buổi
            </span>
          </p>
          <ProgressBar percent={course.progress_percent} showLabel />
        </div>
      )}
    </div>
  )
}
