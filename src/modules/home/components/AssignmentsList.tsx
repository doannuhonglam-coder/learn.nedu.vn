import { useNavigate } from 'react-router-dom'
import type { PendingAssignmentSummary } from '../../../shared/types'

interface AssignmentsListProps {
  assignments: PendingAssignmentSummary[]
  onOpenAssignment: (assignmentId: string) => void
}

export function AssignmentsList({ assignments, onOpenAssignment }: AssignmentsListProps) {
  const navigate = useNavigate()

  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-display text-[16px] font-semibold text-ink">Bài Tập & Nộp Bài</h2>
        <button onClick={() => navigate('/courses')} className="text-[12px] font-medium text-gold-d">
          Vào khoá học →
        </button>
      </div>

      {assignments.length === 0 ? (
        <p className="text-sm text-i3 text-center py-4">Không có bài tập sắp đến hạn ✓</p>
      ) : (
        <div className="flex flex-col gap-2">
          {assignments.slice(0, 3).map((a) => {
            const dueDate = new Date(a.due_date)
            const now = new Date()
            const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000)
            return (
              <button
                key={a.id}
                onClick={() => onOpenAssignment(a.id)}
                className="w-full bg-surface rounded-lg px-[14px] py-3 flex items-center gap-3 text-left"
                style={{
                  border: '1px solid rgba(26,24,22,0.10)',
                  boxShadow: '0 1px 8px rgba(26,24,22,0.05)',
                }}
              >
                <svg width="36" height="36" viewBox="0 0 48 48">
                  <defs>
                    <linearGradient id={`asg-gr-${a.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#4338CA" />
                    </linearGradient>
                    <linearGradient id={`asg-hi-${a.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  <rect width="48" height="48" rx="12" fill={`url(#asg-gr-${a.id})`} />
                  <rect width="48" height="26" rx="12" fill={`url(#asg-hi-${a.id})`} />
                  <rect x="12" y="9" width="24" height="30" rx="3.5" fill="rgba(255,255,255,0.22)" stroke="white" strokeWidth="1.8" />
                  <line x1="17" y1="19" x2="31" y2="19" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="17" y1="24" x2="31" y2="24" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="17" y1="29" x2="26" y2="29" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>

                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink truncate">{a.title}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${a.is_urgent ? 'text-terra font-medium' : 'text-i3'}`}
                  >
                    {a.is_urgent && '⏰ '}Hạn: {dueDate.toLocaleDateString('vi-VN')}
                    {a.status !== 'graded' && daysLeft > 0 && ` · Còn ${daysLeft} ngày`}
                  </div>
                </div>

                <span
                  className="text-[10px] font-semibold px-2 py-1 rounded-md flex-shrink-0"
                  style={
                    a.status === 'graded' || a.status === 'submitted'
                      ? { background: '#FEF4D6', color: '#D4920A' }
                      : { background: '#FEF4D6', color: '#D4920A' }
                  }
                >
                  {a.status === 'graded' ? 'Đã chấm' : a.status === 'submitted' ? 'Đã nộp' : 'Nộp bài →'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
