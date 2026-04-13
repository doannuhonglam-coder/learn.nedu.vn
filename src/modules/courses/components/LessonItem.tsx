import type { LessonSummary } from '../../../shared/types'
import { toast } from '../../../shared/components/ui/Toast'

interface LessonItemProps {
  lesson: LessonSummary
  isCurrent: boolean
  onSelect: (lessonId: string) => void
}

export function LessonItem({ lesson, isCurrent, onSelect }: LessonItemProps) {
  const handleClick = () => {
    if (lesson.is_locked) {
      toast(lesson.unlock_condition || 'Bài học này chưa được mở khóa', 'info')
      return
    }
    onSelect(lesson.id)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
        ${isCurrent ? 'bg-amber-50 border border-brand-gold/30' : 'hover:bg-gray-50'}
        ${lesson.is_locked ? 'opacity-50' : ''}`}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {lesson.is_completed ? (
          <span className="text-brand-green text-sm">✓</span>
        ) : lesson.is_locked ? (
          <span className="text-gray-400 text-xs">🔒</span>
        ) : (
          <span className="w-2 h-2 rounded-full bg-gray-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${lesson.is_completed ? 'text-gray-500' : 'text-brand-dark font-medium'}`}>
          {lesson.title}
        </p>
        {lesson.duration_minutes && (
          <p className="text-[11px] text-gray-400">{lesson.duration_minutes} phút</p>
        )}
      </div>
    </button>
  )
}
