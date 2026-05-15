import { useState } from 'react'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { Badge } from '../../../shared/components/ui/Badge'
import { toast } from '../../../shared/components/ui/Toast'
import { useCourseDetail, useCourseLessons, useLessonDetail } from '../hooks/useCourseDetail'
import { useEnrollments } from '../hooks/useCourses'
import { useAssignments } from '../../assignments/hooks/useAssignments'
import { AssignmentCard } from '../../assignments/components/AssignmentCard'
import { SubmitModal } from '../../assignments/components/SubmitModal'
import { LessonList } from './LessonList'
import { VideoPlayer } from './VideoPlayer'
import { LessonNoteEditor } from './LessonNoteEditor'
import { PrepChecklist } from './PrepChecklist'
import { RetreatSchedule } from './RetreatSchedule'
import { OverviewTab } from './OverviewTab'
import type { CourseMaterial, AssignmentDetail } from '../../../shared/types'

interface CourseModalProps {
  courseId: string | null
  initialTab?: string
  onClose: () => void
}

export function CourseModal({ courseId, initialTab, onClose }: CourseModalProps) {
  const { data: course, isLoading } = useCourseDetail(courseId)
  const { data: lessons } = useCourseLessons(courseId)
  const { data: enrollments } = useEnrollments()
  const enrollment = enrollments?.find((e) => e.course.id === courseId)
  const progressPercent = enrollment?.progress_percent ?? 0
  const { data: allAssignments } = useAssignments()
  const [activeTab, setActiveTab] = useState(initialTab || 'overview')
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentDetail | null>(null)
  const { data: lessonDetail } = useLessonDetail(selectedLessonId)

  if (!courseId) return null

  const tabs = getTabs(course?.course_type)

  return (
    <BottomSheet open={!!courseId} onClose={onClose} title={course?.name}>
      {isLoading || !course ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div>
          {/* Tab bar */}
          <div className="flex gap-1 mb-4 overflow-x-auto no-scrollbar -mx-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedLessonId(null) }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                  ${activeTab === tab.key ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <OverviewTab
              course={course}
              progressPercent={progressPercent}
              onStartLesson={() => {
                setActiveTab('lessons')
                // pick first non-completed, non-locked
                const firstAvailable = lessons?.find((l) => !l.is_completed && !l.is_locked)
                if (firstAvailable) setSelectedLessonId(firstAvailable.id)
              }}
              onOpenAssignments={() => setActiveTab('assignments')}
              onOpenPrep={() => setActiveTab('prep')}
            />
          )}

          {activeTab === 'lessons' && lessons && (
            <div>
              {selectedLessonId && lessonDetail ? (
                <div className="space-y-4">
                  <button onClick={() => setSelectedLessonId(null)} className="text-xs text-brand-gold font-medium">
                    ← Quay lại danh sách
                  </button>
                  <h3 className="text-sm font-semibold text-brand-dark">{lessonDetail.title}</h3>
                  {lessonDetail.description && (
                    <p className="text-xs text-gray-500">{lessonDetail.description}</p>
                  )}
                  {lessonDetail.video && (
                    <VideoPlayer
                      streamId={lessonDetail.video.cloudflare_stream_id}
                      signedToken={lessonDetail.video.signed_token}
                      lessonId={lessonDetail.id}
                    />
                  )}
                  <LessonNoteEditor lessonId={lessonDetail.id} initialContent={lessonDetail.notes} />
                  {lessonDetail.materials.length > 0 && (
                    <MaterialsList materials={lessonDetail.materials} />
                  )}
                </div>
              ) : (
                <LessonList
                  modules={course.modules}
                  lessons={lessons}
                  onSelectLesson={setSelectedLessonId}
                />
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-3">
              {(allAssignments || []).filter((a) => a.course_id === courseId).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Không có bài tập cho khoá này</p>
              ) : (
                (allAssignments || []).filter((a) => a.course_id === courseId).map((a) => (
                  <AssignmentCard key={a.id} assignment={a} onSelect={setSelectedAssignment} />
                ))
              )}
              <SubmitModal assignment={selectedAssignment} onClose={() => setSelectedAssignment(null)} />
            </div>
          )}

          {activeTab === 'materials' && (
            <MaterialsList
              materials={
                lessonDetail?.materials && lessonDetail.materials.length > 0
                  ? lessonDetail.materials
                  : course.course_type === 'coaching'
                    ? [
                        { id: 'coach-mat-01', title: '📘 Sổ tay Coaching · Hướng dẫn ghi chú', file_type: 'pdf' as const, file_size_bytes: 1_800_000, signed_url: '#' },
                        { id: 'coach-mat-02', title: '🎯 Worksheet · Xác định mục tiêu 90 ngày', file_type: 'pdf' as const, file_size_bytes: 950_000, signed_url: '#' },
                        { id: 'coach-mat-03', title: '🧭 Bộ câu hỏi tự vấn (50 câu)', file_type: 'pdf' as const, file_size_bytes: 1_200_000, signed_url: '#' },
                      ]
                    : []
              }
            />
          )}

          {activeTab === 'prep' && course.retreat_prep_checklist && (
            <PrepChecklist items={course.retreat_prep_checklist} />
          )}

          {activeTab === 'schedule' && course.retreat_schedule && (
            <RetreatSchedule schedule={course.retreat_schedule} />
          )}

          {activeTab === 'coaching' && (
            <div className="space-y-3">
              {[
                { num: 1, title: 'Khám phá giá trị cốt lõi', date: '15/02/2026', status: 'completed' },
                { num: 2, title: 'Nhận diện pattern cảm xúc', date: '01/03/2026', status: 'completed' },
                { num: 3, title: 'Xây dựng thói quen mới', date: '15/03/2026', status: 'completed' },
                { num: 4, title: 'Review & Kế hoạch hành động', date: '22/04/2026', status: 'scheduled' },
              ].map((s) => (
                <div key={s.num} className={`p-3 rounded-xl border ${s.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brand-dark">Buổi {s.num}: {s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.date}</p>
                    </div>
                    <Badge variant={s.status === 'completed' ? 'on-demand' : 'coaching'}>
                      {s.status === 'completed' ? '✓ Xong' : 'Sắp tới'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'book' && <CoachingBookTab instructorName={course.instructor_name} />}
        </div>
      )}
    </BottomSheet>
  )
}

function MaterialsList({ materials }: { materials: CourseMaterial[] }) {
  if (materials.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">Không có tài liệu</p>
  }

  const fileIcons: Record<string, string> = {
    pdf: '📄', docx: '📝', xlsx: '📊', image: '🖼️', other: '📎',
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 mb-2">Tài liệu</p>
      {materials.map((m) => (
        <a
          key={m.id}
          href={m.signed_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <span>{fileIcons[m.file_type] || '📎'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-brand-dark truncate">{m.title}</p>
            <p className="text-[11px] text-gray-400">{(m.file_size_bytes / 1024 / 1024).toFixed(1)} MB</p>
          </div>
          <span className="text-xs text-brand-gold">Tải ↓</span>
        </a>
      ))}
    </div>
  )
}

function CoachingBookTab({ instructorName }: { instructorName: string }) {
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set())

  // Generate next 4 available slots dynamically (next 14 days, weekdays only)
  const slots = (() => {
    const out: { id: string; day: number; month: number; weekday: string; start: string; end: string }[] = []
    const now = new Date()
    let offset = 1
    const times: Array<[string, string]> = [['10:00', '11:30'], ['14:00', '15:30']]
    while (out.length < 4 && offset <= 21) {
      const d = new Date(now.getTime() + offset * 86_400_000)
      const dow = d.getDay()
      if (dow !== 0 && dow !== 6) {
        const [start, end] = times[out.length % 2]
        const weekdayLabel = ['CN','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'][dow]
        out.push({
          id: `slot-${offset}-${start}`,
          day: d.getDate(),
          month: d.getMonth() + 1,
          weekday: weekdayLabel,
          start, end,
        })
      }
      offset++
    }
    return out
  })()

  const handleBook = (slotId: string, label: string) => {
    setBookedIds((prev) => new Set(prev).add(slotId))
    toast(`✓ Đã đặt lịch ${label}`, 'success')
  }

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-i2 leading-relaxed">
        Chọn khung giờ phù hợp với <strong>{instructorName}</strong>. Lịch được cập nhật theo tuần.
      </p>

      <div
        className="bg-surface rounded-[14px]"
        style={{ border: '1px solid rgba(26,24,22,0.10)' }}
      >
        {slots.map((s, i) => {
          const booked = bookedIds.has(s.id)
          const label = `${s.weekday}, ${String(s.day).padStart(2,'0')}/${String(s.month).padStart(2,'0')} · ${s.start}–${s.end}`
          return (
            <div key={s.id}>
              <div className="flex items-center gap-3 px-3.5 py-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px] flex-shrink-0"
                  style={{ background: '#FEF4D6' }}
                >
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink">
                    {s.weekday}, {String(s.day).padStart(2,'0')}/{String(s.month).padStart(2,'0')}
                    <span className="text-i3 font-normal"> · {s.start}–{s.end}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBook(s.id, label)}
                  disabled={booked}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-md flex-shrink-0 disabled:opacity-50"
                  style={{
                    background: booked ? '#F0FDF4' : '#FEF4D6',
                    color: booked ? '#16A34A' : '#D4920A',
                  }}
                >
                  {booked ? '✓ Đã đặt' : 'Đặt lịch'}
                </button>
              </div>
              {i < slots.length - 1 && (
                <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />
              )}
            </div>
          )
        })}
      </div>

      <div
        className="rounded-xl px-3 py-2.5 flex items-start gap-2"
        style={{ background: '#FEF4D6', border: '1px solid rgba(245,183,49,0.25)' }}
      >
        <span className="text-[14px] mt-0.5">💡</span>
        <span className="text-[11px] leading-relaxed" style={{ color: '#8B5A15' }}>
          Có thể đổi lịch trước buổi 24h. Liên hệ Nedu nếu cần huỷ gấp.
        </span>
      </div>
    </div>
  )
}

function getTabs(courseType?: string) {
  switch (courseType) {
    case 'retreat':
      return [
        { key: 'overview', label: 'Tổng quan' },
        { key: 'prep', label: 'Chuẩn Bị' },
        { key: 'schedule', label: 'Lịch' },
      ]
    case 'coaching':
      return [
        { key: 'overview', label: 'Tổng quan' },
        { key: 'coaching', label: 'Lịch sử' },
        { key: 'book', label: 'Đặt lịch' },
        { key: 'assignments', label: 'Bài tập' },
        { key: 'materials', label: 'Tài liệu' },
      ]
    default:
      return [
        { key: 'overview', label: 'Tổng quan' },
        { key: 'lessons', label: 'Bài học' },
        { key: 'assignments', label: 'Bài tập' },
        { key: 'materials', label: 'Tài liệu' },
      ]
  }
}
