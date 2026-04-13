import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import type { PaymentSummary } from '../../../shared/types'

interface InvoiceModalProps {
  payment: PaymentSummary | null
  onClose: () => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

export function InvoiceModal({ payment, onClose }: InvoiceModalProps) {
  if (!payment) return null

  return (
    <BottomSheet open={!!payment} onClose={onClose} title="Hóa đơn">
      <div className="space-y-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl mb-2">✓</p>
          <p className="text-sm font-medium text-brand-green">Đã thanh toán</p>
        </div>

        <div className="space-y-2">
          <InfoRow label="Khoá học" value={payment.course_name} />
          <InfoRow label="Đợt" value={payment.installment_label} />
          <InfoRow label="Số tiền" value={formatCurrency(payment.amount)} />
          <InfoRow label="Ngày TT" value={payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('vi-VN') : '—'} />
        </div>

        <p className="text-xs text-gray-400 text-center py-2">
          Tải hóa đơn PDF — Tính năng đang phát triển (P2)
        </p>
      </div>
    </BottomSheet>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-brand-dark">{value}</p>
    </div>
  )
}
