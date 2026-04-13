import type { ContinueLearning } from '../../../shared/types'
import { ProgressBar } from '../../../shared/components/ui/ProgressBar'
import { Button } from '../../../shared/components/ui/Button'

interface HeroContinueWidgetProps {
  data: ContinueLearning
  onStartLesson: (courseId: string) => void
}

export function HeroContinueWidget({ data, onStartLesson }: HeroContinueWidgetProps) {
  return (
    <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-brand-dark to-gray-800 rounded-2xl text-white">
      <p className="text-[11px] text-gray-400 uppercase tracking-wide">Tiếp tục học</p>
      <p className="font-semibold text-sm mt-1">{data.course_name}</p>
      <p className="text-xs text-gray-300 mt-0.5">{data.current_module} · {data.instructor_name}</p>
      <ProgressBar percent={data.progress_percent} showLabel color="bg-brand-gold" className="mt-3" />
      <p className="text-xs text-gray-400 mt-2">
        Bài tiếp: {data.next_lesson.title}
      </p>
      <Button size="sm" className="mt-3 w-full" onClick={() => onStartLesson(data.course_id)}>
        Vào bài học ngay
      </Button>
    </div>
  )
}
