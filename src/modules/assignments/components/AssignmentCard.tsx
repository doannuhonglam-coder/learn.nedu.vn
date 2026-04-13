import type { AssignmentDetail } from '../../../shared/types'
import { Badge } from '../../../shared/components/ui/Badge'

interface AssignmentCardProps {
  assignment: AssignmentDetail
  onSelect: (assignment: AssignmentDetail) => void
}

const statusConfig: Record<string, { label: string; color: string }> = {
  not_submitted: { label: 'Chưa nộp', color: 'text-amber-600' },
  submitted: { label: 'Đã nộp', color: 'text-blue-600' },
  graded: { label: 'Đã chấm', color: 'text-brand-green' },
  overdue: { label: 'Quá hạn', color: 'text-brand-red' },
}

export function AssignmentCard({ assignment, onSelect }: AssignmentCardProps) {
  const config = statusConfig[assignment.status] || { label: assignment.status, color: 'text-gray-500' }
  const dueDate = new Date(assignment.due_date)

  return (
    <button
      onClick={() => onSelect(assignment)}
      className={`w-full p-4 rounded-xl border text-left transition-colors
        ${assignment.is_urgent ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-brand-dark">{assignment.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{assignment.course_name}</p>
          <p className="text-xs text-gray-400 mt-1">
            Hạn: {dueDate.toLocaleDateString('vi-VN')}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
          {assignment.is_urgent && <Badge variant="urgent">Sắp hết hạn</Badge>}
          {assignment.submission?.grade !== undefined && assignment.submission?.grade !== null && (
            <span className="text-sm font-bold text-brand-gold">{assignment.submission.grade}/10</span>
          )}
        </div>
      </div>
    </button>
  )
}
