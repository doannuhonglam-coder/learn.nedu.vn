import type { PendingPaymentAlert } from '../../../shared/types'

interface PaymentAlertBannerProps {
  payment: PendingPaymentAlert
  onPayClick: () => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
}

export function PaymentAlertBanner({ payment, onPayClick }: PaymentAlertBannerProps) {
  const isAwaiting = payment.status === 'awaiting_verification'

  return (
    <div
      className="mx-4 mt-3 rounded-[14px] px-[14px] py-3"
      style={{
        background: isAwaiting ? '#FEF4D6' : '#FDECEA',
        border: `1px solid ${isAwaiting ? 'rgba(245,183,49,0.25)' : 'rgba(185,79,46,0.20)'}`,
      }}
    >
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="flex-shrink-0 mt-0.5">
          <svg width="22" height="22" viewBox="0 0 48 48">
            <defs>
              <linearGradient id="pay-warn-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FCA5A5" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
              <linearGradient id="pay-warn-h" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <rect width="48" height="48" rx="12" fill="url(#pay-warn-g)" />
            <rect width="48" height="26" rx="12" fill="url(#pay-warn-h)" />
            <path d="M24 11L39 38H9L24 11Z" fill="rgba(255,255,255,0.22)" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            <line x1="24" y1="22" x2="24" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="24" cy="34.5" r="1.8" fill="white" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[12px] font-bold"
            style={{ color: isAwaiting ? '#D4920A' : '#C0392B' }}
          >
            {isAwaiting ? 'Đang xác minh thanh toán' : 'Học phí đang chờ thanh toán'}
          </div>
          <div className="text-[11px] text-i2 mt-0.5 leading-[1.45]">
            {payment.installment_label} · {payment.course_name} · Hạn{' '}
            {new Date(payment.due_date).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {!isAwaiting && (
        <button
          onClick={onPayClick}
          className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
          style={{ background: '#C0392B' }}
        >
          Chuyển khoản {formatCurrency(payment.amount)} →
        </button>
      )}
    </div>
  )
}
