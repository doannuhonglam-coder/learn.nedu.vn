import type { PendingPaymentAlert } from '../../../shared/types'

interface PaymentAlertBannerProps {
  payment: PendingPaymentAlert
  onPayClick: () => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

export function PaymentAlertBanner({ payment, onPayClick }: PaymentAlertBannerProps) {
  const isAwaiting = payment.status === 'awaiting_verification'
  const bgColor = isAwaiting ? '#FEF4D6' : '#FDECEA'
  const borderColor = isAwaiting ? 'rgba(245,183,49,0.2)' : 'rgba(185,79,46,0.2)'
  const titleColor = isAwaiting ? '#D4920A' : '#C0392B'
  const btnBg = isAwaiting ? '#D4920A' : '#C0392B'

  return (
    <div
      className="mx-4 mt-[14px] rounded-lg px-[14px] py-3 flex gap-2.5 items-start"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      <div className="flex-shrink-0 mt-0.5">
        <svg width="28" height="28" viewBox="0 0 48 48">
          <defs>
            <linearGradient id="warn-gr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="warn-hi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="12" fill="url(#warn-gr)" />
          <rect width="48" height="26" rx="12" fill="url(#warn-hi)" />
          <path d="M24 11L39 38H9L24 11Z" fill="rgba(255,255,255,0.22)" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <line x1="24" y1="22" x2="24" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="34.5" r="1.8" fill="white" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold" style={{ color: titleColor }}>
          {isAwaiting ? 'Đang xác minh thanh toán' : 'Học phí đang chờ thanh toán'}
        </div>
        <div className="text-[11px] text-i2 mt-0.5 leading-[1.45]">
          {payment.installment_label} · {payment.course_name} · {formatCurrency(payment.amount)} · Hạn{' '}
          {new Date(payment.due_date).toLocaleDateString('vi-VN')}
        </div>
        {!isAwaiting && (
          <button
            onClick={onPayClick}
            className="text-[11px] font-semibold text-white rounded-md px-3 py-[5px] mt-1.5"
            style={{ background: btnBg }}
          >
            Thanh toán ngay →
          </button>
        )}
      </div>
    </div>
  )
}
