import type { PaymentSummary } from '../../../shared/types'

interface TransactionListProps {
  payments: PaymentSummary[]
  onSelectPayment: (payment: PaymentSummary) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ TT', color: 'text-amber-600' },
  awaiting_verification: { label: 'Đang xác minh', color: 'text-blue-600' },
  paid: { label: 'Đã TT', color: 'text-brand-green' },
  overdue: { label: 'Quá hạn', color: 'text-brand-red' },
  waived: { label: 'Miễn', color: 'text-gray-400' },
}

export function TransactionList({ payments, onSelectPayment }: TransactionListProps) {
  // Pin pending first
  const sorted = [...payments].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
  })

  return (
    <div className="space-y-2 px-4">
      {sorted.map((payment) => {
        const config = statusConfig[payment.status] || { label: payment.status, color: 'text-gray-500' }
        const isPending = payment.status === 'pending' || payment.status === 'overdue'

        return (
          <button
            key={payment.id}
            onClick={() => onSelectPayment(payment)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors
              ${isPending ? 'border-amber-200 bg-amber-50 hover:bg-amber-100' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-dark truncate">{payment.course_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{payment.installment_label}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Hạn: {new Date(payment.due_date).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-brand-dark">{formatCurrency(payment.amount)}</p>
              <p className={`text-xs font-medium mt-0.5 ${config.color}`}>{config.label}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
