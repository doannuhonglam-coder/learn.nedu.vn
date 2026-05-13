import { useNavigate } from 'react-router-dom'
import type { PendingAssignmentSummary } from '../../../shared/types'

interface AssignmentsListProps {
  assignments: PendingAssignmentSummary[]
  onOpenAssignment: (assignmentId: string) => void
}

export function AssignmentsList({ assignments, onOpenAssignment }: AssignmentsListProps) {
  const navigate = useNavigate()

  if (assignments.length === 0) return null

  // Sort by due_date ascending (most urgent first)
  const sorted = [...assignments].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  )
  const next = sorted[0]
  const dueDate = new Date(next.due_date)
  const now = new Date()
  const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000)
  const remaining = assignments.length - 1

  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-display text-[16px] font-semibold text-ink">Cần nộp bài</h2>
        {remaining > 0 ? (
          <button onClick={() => navigate('/courses')} className="text-[12px] font-medium text-gold-d">
            Xem {remaining} bài còn lại →
          </button>
        ) : (
          <button onClick={() => navigate('/courses')} className="text-[12px] font-medium text-gold-d">
            Vào khoá học →
          </button>
        )}
      </div>

      <button
        onClick={() => onOpenAssignment(next.id)}
        className="w-full bg-surface rounded-[14px] px-[14px] py-3 flex items-center gap-3 text-left transition-opacity active:opacity-80"
        style={{
          border: next.is_urgent
            ? '1px solid rgba(185,79,46,0.20)'
            : '1px solid rgba(26,24,22,0.10)',
          boxShadow: '0 1px 8px rgba(26,24,22,0.05)',
          background: next.is_urgent ? '#FFFAF9' : '#FFFFFF',
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-ink truncate">{next.title}</div>
          <div
            className={`text-[11px] mt-0.5 ${next.is_urgent ? 'font-medium' : ''}`}
            style={{ color: next.is_urgent ? '#C0392B' : '#8A8480' }}
          >
            {next.is_urgent && '⏰ '}
            {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Quá hạn'} · Hạn:{' '}
            {dueDate.toLocaleDateString('vi-VN')}
          </div>
        </div>

        <span
          className="text-[11px] font-semibold px-3 py-1.5 rounded-md flex-shrink-0"
          style={
            next.status === 'graded' || next.status === 'submitted'
              ? { background: '#FEF4D6', color: '#D4920A' }
              : { background: '#FDECEA', color: '#C0392B' }
          }
        >
          {next.status === 'graded'
            ? 'Đã chấm'
            : next.status === 'submitted'
              ? 'Đã nộp'
              : 'Viết & nộp →'}
        </span>
      </button>
    </div>
  )
}
