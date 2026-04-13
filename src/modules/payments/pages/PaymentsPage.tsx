import { useState } from 'react'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { usePayments } from '../hooks/usePayments'
import { PaymentOverviewCard } from '../components/PaymentOverviewCard'
import { TransactionList } from '../components/TransactionList'
import { PaymentModal } from '../components/PaymentModal'
import { InvoiceModal } from '../components/InvoiceModal'
import type { PaymentSummary } from '../../../shared/types'

type PaymentFilter = 'all' | 'pending' | 'paid'

export default function PaymentsPage() {
  const { data: payments, isLoading } = usePayments()
  const [filter, setFilter] = useState<PaymentFilter>('all')
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [invoicePayment, setInvoicePayment] = useState<PaymentSummary | null>(null)

  const filtered = (payments || []).filter((p) => {
    if (filter === 'pending') return p.status === 'pending' || p.status === 'overdue' || p.status === 'awaiting_verification'
    if (filter === 'paid') return p.status === 'paid'
    return true
  })

  const handleSelectPayment = (payment: PaymentSummary) => {
    if (payment.status === 'paid') {
      setInvoicePayment(payment)
    } else {
      setSelectedPaymentId(payment.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const filters: { key: PaymentFilter; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ TT' },
    { key: 'paid', label: 'Đã TT' },
  ]

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 pb-3">
        <h2 className="font-display font-semibold text-xl text-brand-dark">Thanh Toán & Hóa Đơn</h2>
      </div>

      <PaymentOverviewCard payments={payments || []} />

      <div className="flex gap-2 px-4 py-3">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
              ${filter === f.key ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <TransactionList payments={filtered} onSelectPayment={handleSelectPayment} />

      <PaymentModal paymentId={selectedPaymentId} onClose={() => setSelectedPaymentId(null)} />
      <InvoiceModal payment={invoicePayment} onClose={() => setInvoicePayment(null)} />
    </div>
  )
}
