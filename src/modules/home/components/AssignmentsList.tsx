import type { PendingAssignmentSummary } from '../../../shared/types'
import { Badge } from '../../../shared/components/ui/Badge'

interface AssignmentsListProps {
  assignments: PendingAssignmentSummary[]
  onOpenAssignment: (assignmentId: string) => void
}

export function AssignmentsList({ assignments, onOpenAssignment }: AssignmentsListProps) {
  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-base text-brand-dark">Bài Tập & Nộp Bài</h3>
      </div>
      {assignments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Không có bài tập sắp đến hạn ✓</p>
      ) : (
        <div className="space-y-2">
          {assignments.slice(0, 3).map((a) => {
            const dueDate = new Date(a.due_date)
            return (
              <button
                key={a.id}
                onClick={() => onOpenAssignment(a.id)}
                className={`w-full p-3 rounded-xl border text-left hover:shadow-sm transition-all
                  ${a.is_urgent ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-dark truncate">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.course_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Hạn: {dueDate.toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  {a.is_urgent && <Badge variant="urgent">Sắp hết hạn</Badge>}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
