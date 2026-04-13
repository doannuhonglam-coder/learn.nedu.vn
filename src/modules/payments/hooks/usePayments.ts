import { useQuery } from '@tanstack/react-query'
import { paymentsService } from '../services/payments.service'

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentsService.getPayments,
  })
}

export function usePaymentDetail(paymentId: string | null) {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentsService.getPaymentDetail(paymentId!),
    enabled: !!paymentId,
  })
}
