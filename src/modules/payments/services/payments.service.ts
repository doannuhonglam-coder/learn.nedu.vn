import { api } from '../../../shared/config/api-client'
import type { PaymentSummary, PaymentDetail, PendingPaymentAlert } from '../../../shared/types'

export const paymentsService = {
  getPayments: () => api.get<PaymentSummary[]>('/payments'),
  getPending: () => api.get<PendingPaymentAlert | null>('/payments/pending'),
  getPaymentDetail: (paymentId: string) => api.get<PaymentDetail>(`/payments/${paymentId}`),
  confirmPayment: (paymentId: string, data: { transfer_amount: number; screenshot_url: string; bank_ref?: string }) =>
    api.post(`/payments/${paymentId}/confirm`, data),
}
