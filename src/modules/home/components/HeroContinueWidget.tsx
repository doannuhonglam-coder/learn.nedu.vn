import type { ContinueLearning } from '../../../shared/types'

interface HeroContinueWidgetProps {
  data: ContinueLearning
  onStartLesson: (courseId: string) => void
}

export function HeroContinueWidget({ data, onStartLesson }: HeroContinueWidgetProps) {
  return (
    <button
      onClick={() => onStartLesson(data.course_id)}
      className="block w-[calc(100%-2rem)] mx-4 mt-4 rounded-[14px] px-[18px] py-4 text-left transition-transform active:scale-[.98]"
      style={{
        background: '#1A1816',
        boxShadow: '0 4px 24px rgba(26,24,22,0.18)',
      }}
    >
      <div
        className="font-mono text-[10px] font-bold uppercase mb-1.5"
        style={{ color: 'rgba(245,183,49,0.6)', letterSpacing: '0.07em' }}
      >
        Tiếp tục học hôm nay
      </div>
      <div className="font-display text-[16px] font-semibold text-white leading-[1.3] mb-[3px]">
        {data.course_name}
      </div>
      <div className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {data.current_module} · {data.instructor_name} · {data.course_type === 'on_demand' ? 'On-demand' : 'Cohort'}
      </div>

      <div className="mb-2.5">
        <div className="flex justify-between text-[11px] mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>Tiến trình</span>
          <strong className="text-gold font-semibold">{data.progress_percent}%</strong>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ background: '#F5B731', width: `${data.progress_percent}%` }}
          />
        </div>
      </div>

      <div
        className="flex items-center justify-between rounded-lg px-[14px] py-[11px]"
        style={{ background: '#F5B731' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(26,24,22,0.15)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="3,2 12,7 3,12" fill="white" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-obs">Vào bài học ngay</div>
            <div className="text-[10px] mt-px" style={{ color: 'rgba(26,24,22,0.55)' }}>
              {data.next_lesson.title}
            </div>
          </div>
        </div>
        <div className="text-[18px]" style={{ color: 'rgba(26,24,22,0.4)' }}>
          ›
        </div>
      </div>
    </button>
  )
}
