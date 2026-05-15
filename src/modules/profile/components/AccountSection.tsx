import { useNavigate } from 'react-router-dom'
import type { PendingPaymentAlert } from '../../../shared/types'
import { SquircleIcon } from './SquircleIcon'

interface AccountSectionProps {
  pendingPayment: PendingPaymentAlert | null
  onOpenSettings: () => void
  onOpenSupport: () => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
}

export function AccountSection({
  pendingPayment,
  onOpenSettings,
  onOpenSupport,
}: AccountSectionProps) {
  const navigate = useNavigate()

  const paymentSub = pendingPayment
    ? `${formatCurrency(pendingPayment.amount)} chờ thanh toán`
    : 'Tất cả đã thanh toán'

  return (
    <div className="px-4 mt-5">
      <div
        className="font-mono text-[11px] font-bold uppercase text-i3 mb-2 px-1"
        style={{ letterSpacing: '0.08em' }}
      >
        Tài Khoản
      </div>

      <div
        className="bg-surface rounded-[14px]"
        style={{ border: '1px solid rgba(26,24,22,0.10)' }}
      >
        {/* Payments */}
        <button
          onClick={() => navigate('/payments')}
          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors rounded-t-[14px]"
        >
          <SquircleIcon kind="invoice" size={32} />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">Thanh toán & Hoá đơn</div>
            <div
              className={`text-[11px] mt-0.5 truncate ${pendingPayment ? 'font-medium' : ''}`}
              style={{ color: pendingPayment ? '#C0392B' : '#8A8480' }}
            >
              {paymentSub}
            </div>
          </div>
          <span className="text-i3 text-[16px]">›</span>
        </button>

        <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors"
        >
          <SquircleIcon kind="gear" size={32} />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">Cài đặt</div>
            <div className="text-[11px] text-i3 mt-0.5 truncate">
              Email · SĐT · Mật khẩu · Thông báo
            </div>
          </div>
          <span className="text-i3 text-[16px]">›</span>
        </button>

        <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />

        {/* Support */}
        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors rounded-b-[14px]"
        >
          <SquircleIcon kind="chat" size={32} />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">Liên hệ Nedu</div>
            <div className="text-[11px] text-i3 mt-0.5 truncate">
              Zalo · Email · Hotline 1800 NEDU
            </div>
          </div>
          <span className="text-i3 text-[16px]">›</span>
        </button>
      </div>
    </div>
  )
}
