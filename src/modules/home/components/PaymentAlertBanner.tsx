import type { PendingPaymentAlert } from '../../../shared/types'
import { Button } from '../../../shared/components/ui/Button'

interface PaymentAlertBannerProps {
  payment: PendingPaymentAlert
  onPayClick: () => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

export function PaymentAlertBanner({ payment, onPayClick }: PaymentAlertBannerProps) {
  return (
    <div className="mx-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 truncate">
            {payment.installment_label} · {payment.course_name}
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            {formatCurrency(payment.amount)} · Hạn {new Date(payment.due_date).toLocaleDateString('vi-VN')}
          </p>
        </div>
        {payment.status === 'awaiting_verification' ? (
          <span className="text-xs font-medium text-amber-700 whitespace-nowrap">{payment.status_label}</span>
        ) : (
          <Button size="sm" onClick={onPayClick}>
            Thanh toán ngay →
          </Button>
        )}
      </div>
    </div>
  )
}
