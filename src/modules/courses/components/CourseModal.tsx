import { useState } from 'react'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { ProgressBar } from '../../../shared/components/ui/ProgressBar'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useCourseDetail, useCourseLessons, useLessonDetail } from '../hooks/useCourseDetail'
import { LessonList } from './LessonList'
import { VideoPlayer } from './VideoPlayer'
import { LessonNoteEditor } from './LessonNoteEditor'
import { PrepChecklist } from './PrepChecklist'
import { RetreatSchedule } from './RetreatSchedule'
import { CountdownTimer } from './CountdownTimer'
import type { CourseMaterial } from '../../../shared/types'

interface CourseModalProps {
  courseId: string | null
  initialTab?: string
  onClose: () => void
}

export function CourseModal({ courseId, initialTab, onClose }: CourseModalProps) {
  const { data: course, isLoading } = useCourseDetail(courseId)
  const { data: lessons } = useCourseLessons(courseId)
  const [activeTab, setActiveTab] = useState(initialTab || 'overview')
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
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
            <OverviewTab course={course} />
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
            <p className="text-sm text-gray-400 text-center py-8">Xem bài tập trong tab Bài Tập & Nộp Bài</p>
          )}

          {activeTab === 'materials' && (
            <MaterialsList materials={lessonDetail?.materials || []} />
          )}

          {activeTab === 'prep' && course.retreat_prep_checklist && (
            <PrepChecklist items={course.retreat_prep_checklist} />
          )}

          {activeTab === 'schedule' && course.retreat_schedule && (
            <RetreatSchedule schedule={course.retreat_schedule} />
          )}

          {activeTab === 'coaching' && (
            <p className="text-sm text-gray-400 text-center py-8">Coaching sessions — Sprint 3</p>
          )}

          {activeTab === 'notes' && (
            <p className="text-sm text-gray-400 text-center py-8">Ghi chú coaching — Sprint 3</p>
          )}
        </div>
      )}
    </BottomSheet>
  )
}

function OverviewTab({ course }: { course: NonNullable<ReturnType<typeof useCourseDetail>['data']> }) {
  return (
    <div className="space-y-4">
      {course.description && (
        <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[11px] text-gray-400">Giảng viên</p>
          <p className="text-sm font-medium text-brand-dark">{course.instructor_name}</p>
        </div>
        {course.program && (
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[11px] text-gray-400">Chương trình</p>
            <p className="text-sm font-medium text-brand-dark">{course.program.name}</p>
          </div>
        )}
      </div>

      {course.course_type === 'retreat' && (
        <>
          <div className="bg-purple-50 rounded-xl p-3">
            <p className="text-[11px] text-gray-400">Địa điểm</p>
            <p className="text-sm font-medium text-brand-dark">{course.retreat_location}</p>
            <p className="text-[11px] text-gray-400 mt-1">Ngày</p>
            <p className="text-sm font-medium text-brand-dark">
              {course.retreat_date && new Date(course.retreat_date).toLocaleDateString('vi-VN')}
            </p>
            <div className="mt-2">
              <CountdownTimer targetDate={course.retreat_date || ''} />
            </div>
          </div>
        </>
      )}

      {(course.course_type === 'cohort' || course.course_type === 'on_demand') && (
        <div>
          <p className="text-xs text-gray-500 mb-1">{course.modules.length} modules</p>
          <ProgressBar
            percent={Math.round(
              (course.modules.reduce((a, m) => a + m.lessons_completed, 0) /
                Math.max(course.modules.reduce((a, m) => a + m.lessons_count, 0), 1)) * 100
            )}
            showLabel
          />
        </div>
      )}
    </div>
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
        { key: 'coaching', label: 'Buổi Coaching' },
        { key: 'notes', label: 'Ghi Chú' },
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
