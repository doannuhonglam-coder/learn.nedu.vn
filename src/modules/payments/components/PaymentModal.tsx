import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import { toast } from '../../../shared/components/ui/Toast'
import { usePaymentDetail } from '../hooks/usePayments'
import { paymentsService } from '../services/payments.service'

interface PaymentModalProps {
  paymentId: string | null
  onClose: () => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
}

export function PaymentModal({ paymentId, onClose }: PaymentModalProps) {
  const { data: payment } = usePaymentDetail(paymentId)
  const [confirmed, setConfirmed] = useState(false)
  const queryClient = useQueryClient()

  const confirmMutation = useMutation({
    mutationFn: () =>
      paymentsService.confirmPayment(paymentId!, {
        transfer_amount: payment!.amount,
        screenshot_url: 'mock-screenshot-url',
      }),
    onSuccess: () => {
      setConfirmed(true)
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'summary'] })
    },
    onError: () => {
      toast('Có lỗi xảy ra, vui lòng thử lại', 'error')
    },
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast('Đã sao chép', 'success')
  }

  if (!paymentId) return null

  return (
    <BottomSheet open={!!paymentId} onClose={onClose} title="Thanh toán">
      {confirmed ? (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">✓</p>
          <p className="text-lg font-semibold text-brand-dark">Đã ghi nhận</p>
          <p className="text-sm text-gray-500 mt-1">Nedu đang xử lý 2–4 giờ làm việc</p>
          <Button className="mt-6 w-full" onClick={onClose}>Đóng</Button>
        </div>
      ) : payment ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-sm font-medium text-brand-dark">{payment.course_name}</p>
            <p className="text-xs text-gray-500">{payment.installment_label}</p>
            <p className="text-lg font-bold text-brand-dark mt-1">{formatCurrency(payment.amount)}</p>
            <p className="text-xs text-gray-400">Hạn: {new Date(payment.due_date).toLocaleDateString('vi-VN')}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Thông tin chuyển khoản</h4>

            <BankRow label="Ngân hàng" value={payment.bank_info.bank_name} />
            <BankRow label="Số tài khoản" value={payment.bank_info.account_number} onCopy={() => copyToClipboard(payment.bank_info.account_number)} />
            <BankRow label="Tên tài khoản" value={payment.bank_info.account_name} />
            <BankRow label="Nội dung CK" value={payment.bank_info.transfer_content} onCopy={() => copyToClipboard(payment.bank_info.transfer_content)} />
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <img
              src={payment.bank_info.qr_code_url}
              alt="QR Code thanh toán"
              className="w-48 h-48 rounded-xl border border-gray-200"
            />
          </div>

          <Button className="w-full" onClick={() => confirmMutation.mutate()} loading={confirmMutation.isPending}>
            ✅ Tôi Đã Chuyển Khoản
          </Button>
          <button onClick={onClose} className="w-full text-center text-sm text-gray-500 py-2">
            Để sau
          </button>
        </div>
      ) : null}
    </BottomSheet>
  )
}

function BankRow({ label, value, onCopy }: { label: string; value: string; onCopy?: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <div>
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className="text-sm font-medium text-brand-dark">{value}</p>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="text-xs text-brand-gold font-medium px-2 py-1">
          Sao chép
        </button>
      )}
    </div>
  )
}
