import type { PaymentSummary } from '../../../shared/types'

interface PaymentOverviewCardProps {
  payments: PaymentSummary[]
}

function formatCurrency(amount: number) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M đ`
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

export function PaymentOverviewCard({ payments }: PaymentOverviewCardProps) {
  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalOwed = payments.filter((p) => p.status !== 'paid' && p.status !== 'waived').reduce((s, p) => s + p.amount, 0)
  const activeCourses = new Set(payments.map((p) => p.enrollment_id)).size

  return (
    <div className="grid grid-cols-3 gap-3 px-4">
      <div className="bg-green-50 rounded-xl p-3 text-center">
        <p className="text-sm font-bold text-brand-green">{formatCurrency(totalPaid)}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">Đã thanh toán</p>
      </div>
      <div className="bg-red-50 rounded-xl p-3 text-center">
        <p className="text-sm font-bold text-brand-red">{formatCurrency(totalOwed)}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">Còn nợ</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 text-center">
        <p className="text-sm font-bold text-brand-dark">{activeCourses}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">Khoá đang học</p>
      </div>
    </div>
  )
}
