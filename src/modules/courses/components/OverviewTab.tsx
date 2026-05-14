import { CountdownTimer } from './CountdownTimer'
import { useCourseLessons } from '../hooks/useCourseDetail'
import { useAssignments } from '../../assignments/hooks/useAssignments'
import { useScheduleEvents } from '../../schedule/hooks/useSchedule'
import type { CourseDetail, LessonSummary } from '../../../shared/types'

interface OverviewTabProps {
  course: CourseDetail
  progressPercent: number
  onStartLesson: () => void
  onOpenAssignments: () => void
  onOpenPrep: () => void
}

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatFullDate(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export function OverviewTab({
  course,
  progressPercent,
  onStartLesson,
  onOpenAssignments,
  onOpenPrep,
}: OverviewTabProps) {
  const { data: lessonsData } = useCourseLessons(course.id)
  const lessons: LessonSummary[] = Array.isArray(lessonsData) ? lessonsData : []

  const { data: assignmentsData } = useAssignments()
  const assignments = Array.isArray(assignmentsData) ? assignmentsData : []

  const now = new Date()
  const { data: eventsData } = useScheduleEvents(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  )
  const events = Array.isArray(eventsData) ? eventsData : []

  // Find next lesson (first non-completed, non-locked)
  const nextLesson: LessonSummary | undefined = lessons.find(
    (l) => !l.is_completed && !l.is_locked,
  )

  // Find current module (first module with incomplete lessons)
  const currentModule =
    course.modules.find((m) => !m.is_locked && m.lessons_completed < m.lessons_count) ||
    course.modules[course.modules.length - 1]

  // Course-specific assignments + upcoming events
  const courseAssignments = assignments.filter(
    (a) => a.course_id === course.id && a.status === 'not_submitted',
  )
  const nextAssignment = [...courseAssignments].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
  )[0]

  const courseEvents = events.filter(
    (e) =>
      e.course_id === course.id &&
      new Date(e.start_time).getTime() > now.getTime(),
  )
  const nextEvent = [...courseEvents].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  )[0]

  // Total lessons stats
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons_count, 0)
  const completedLessons = course.modules.reduce((s, m) => s + m.lessons_completed, 0)
  const totalDurationMin = lessons.reduce((s, l) => s + (l.duration_minutes || 0), 0)
  const totalHours = (totalDurationMin / 60).toFixed(1)

  // Prep checklist (retreat)
  const prepDone = course.retreat_prep_checklist?.filter((i) => i.is_checked).length || 0
  const prepTotal = course.retreat_prep_checklist?.length || 0

  return (
    <div className="space-y-4">
      {/* 1. CURRENT PROGRESS — Cohort / On-demand */}
      {(course.course_type === 'cohort' || course.course_type === 'on_demand') && (
        <div
          className="rounded-[14px] p-4"
          style={{
            background: 'linear-gradient(135deg, #1A1816, #2C2A26)',
          }}
        >
          <div
            className="font-mono text-[10px] font-bold uppercase mb-2"
            style={{ color: 'rgba(245,183,49,0.6)', letterSpacing: '0.07em' }}
          >
            Tiến trình hiện tại
          </div>

          {currentModule && (
            <div className="font-display text-[15px] font-semibold text-white mb-1 leading-[1.3]">
              {currentModule.title}
            </div>
          )}

          <div className="flex justify-between text-[11px] mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>
              {completedLessons}/{totalLessons} bài học
            </span>
            <strong className="text-gold font-semibold">{progressPercent}%</strong>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden mb-3"
            style={{ background: 'rgba(255,255,255,0.10)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ background: '#F5B731', width: `${progressPercent}%` }}
            />
          </div>

          {nextLesson && (
            <>
              <div className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Bài tiếp:{' '}
                <span className="text-white font-medium">{nextLesson.title}</span>
                {nextLesson.duration_minutes && (
                  <span className="text-[10px] text-gold ml-1.5">
                    · {nextLesson.duration_minutes} phút
                  </span>
                )}
              </div>
              <button
                onClick={onStartLesson}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2.5"
                style={{ background: '#F5B731' }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(26,24,22,0.15)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <polygon points="3,2 12,7 3,12" fill="white" />
                    </svg>
                  </span>
                  <span className="text-[13px] font-semibold text-obs">
                    Vào bài học ngay
                  </span>
                </span>
                <span className="text-obs text-[16px]" style={{ opacity: 0.4 }}>›</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* 1. RETREAT SPOTLIGHT */}
      {course.course_type === 'retreat' && course.retreat_date && (
        <div
          className="rounded-[14px] p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #6B3FA0, #4A2870)',
          }}
        >
          <div
            className="absolute -top-[30px] -right-[20px] w-[100px] h-[100px] rounded-full pointer-events-none"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          <div
            className="relative z-[1] font-mono text-[10px] font-bold uppercase mb-2"
            style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.07em' }}
          >
            Đếm ngược · Retreat
          </div>
          <div className="relative z-[1] font-display text-[16px] font-semibold text-white mb-1.5 leading-tight">
            {course.retreat_location || 'Đà Lạt'}
          </div>
          <div
            className="relative z-[1] text-[12px] mb-3"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            📅 {formatShortDate(course.retreat_date)}
            {course.retreat_end_date && ` – ${formatFullDate(course.retreat_end_date)}`}
          </div>
          <div className="relative z-[1] mb-3">
            <CountdownTimer
              targetDate={course.retreat_date}
              className="!text-white text-[14px] font-semibold"
            />
          </div>
          {prepTotal > 0 && (
            <button
              onClick={onOpenPrep}
              className="relative z-[1] w-full flex items-center justify-between rounded-lg px-3 py-2.5"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <span className="text-[12px] font-semibold text-white">
                ✓ Chuẩn bị: {prepDone}/{prepTotal}
              </span>
              <span className="text-white text-[16px]" style={{ opacity: 0.7 }}>›</span>
            </button>
          )}
        </div>
      )}

      {/* 2. WHAT'S UP NEXT */}
      {(nextEvent || nextAssignment) && (
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
            style={{ letterSpacing: '0.06em' }}
          >
            Sắp tới
          </div>
          <div
            className="bg-surface rounded-[14px] divide-y"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            {nextEvent && (
              <div className="flex items-center gap-3 px-4 py-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
                  style={{ background: '#FEF4D6' }}
                >
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink truncate">
                    {nextEvent.title}
                  </div>
                  <div className="text-[11px] text-i3 mt-0.5">
                    {formatFullDate(nextEvent.start_time)} ·{' '}
                    {new Date(nextEvent.start_time).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            )}
            {nextEvent && nextAssignment && (
              <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />
            )}
            {nextAssignment && (
              <button
                onClick={onOpenAssignments}
                className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
                  style={{
                    background: nextAssignment.is_urgent ? '#FDECEA' : '#FEF4D6',
                  }}
                >
                  📝
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink truncate">
                    {nextAssignment.title}
                  </div>
                  <div
                    className="text-[11px] mt-0.5"
                    style={{ color: nextAssignment.is_urgent ? '#C0392B' : '#8A8480' }}
                  >
                    {nextAssignment.is_urgent && '⏰ '}
                    Hạn: {formatFullDate(nextAssignment.due_date)}
                    {courseAssignments.length > 1 && ` · +${courseAssignments.length - 1} bài khác`}
                  </div>
                </div>
                <span className="text-i3 text-[16px]">›</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. STATS */}
      {course.modules.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          <div
            className="bg-surface rounded-xl p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">
              {course.modules.length}
            </div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Modules
            </div>
          </div>
          <div
            className="bg-surface rounded-xl p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">
              {totalLessons}
            </div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Bài học
            </div>
          </div>
          <div
            className="bg-surface rounded-xl p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">
              {totalHours}h
            </div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Thời lượng
            </div>
          </div>
        </div>
      )}

      {/* 4. ABOUT */}
      {course.description && (
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
            style={{ letterSpacing: '0.06em' }}
          >
            Về khoá học
          </div>
          <p className="text-[13px] text-i2 leading-relaxed">{course.description}</p>
        </div>
      )}

      {/* 5. INSTRUCTOR + PROGRAM */}
      <div>
        <div
          className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
          style={{ letterSpacing: '0.06em' }}
        >
          Giảng viên
        </div>
        <div
          className="bg-surface rounded-[14px] px-4 py-3 flex items-center gap-3"
          style={{ border: '1px solid rgba(26,24,22,0.10)' }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0 text-white"
            style={{ background: 'linear-gradient(135deg, #F5B731, #D4920A)' }}
          >
            {course.instructor_name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">
              {course.instructor_name}
            </div>
            <div className="text-[11px] text-i3 mt-0.5">
              {course.program ? course.program.name : 'Mentor · Nedu Education'}
            </div>
          </div>
        </div>
      </div>

      {/* 6. CERTIFICATE */}
      <div>
        <div
          className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
          style={{ letterSpacing: '0.06em' }}
        >
          Chứng chỉ
        </div>
        <div
          className="rounded-[14px] px-4 py-3 flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg,#FDFAF5,#F0EBE0)',
            border: '1px solid rgba(245,183,49,0.25)',
          }}
        >
          <div className="text-[28px] flex-shrink-0">🎓</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-ink">
              Chứng chỉ Hoàn Thành
            </div>
            <div className="text-[11px] text-i3 mt-0.5">
              {progressPercent >= 100
                ? '✓ Đã đạt đủ điều kiện · Tải PDF'
                : `Cần ${100 - progressPercent}% nữa để mở khoá`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
