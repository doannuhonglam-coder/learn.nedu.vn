import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL || 'https://api.nedu.vn'

const mockPayments = [
  {
    id: 'pay-001',
    enrollment_id: 'enr-001',
    course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    installment_number: 2,
    installment_label: 'Đợt 2',
    amount: 5500000,
    status: 'pending',
    due_date: '2026-04-25',
    paid_at: null,
  },
  {
    id: 'pay-002',
    enrollment_id: 'enr-001',
    course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    installment_number: 1,
    installment_label: 'Đợt 1',
    amount: 5500000,
    status: 'paid',
    due_date: '2026-03-01',
    paid_at: '2026-02-28T10:00:00Z',
  },
  {
    id: 'pay-003',
    enrollment_id: 'enr-002',
    course_name: 'Retreat Tĩnh Tâm Đà Lạt',
    installment_number: 1,
    installment_label: 'Thanh toán đầy đủ',
    amount: 8000000,
    status: 'paid',
    due_date: '2026-03-15',
    paid_at: '2026-03-10T15:30:00Z',
  },
  {
    id: 'pay-004',
    enrollment_id: 'enr-003',
    course_name: 'Con Số & Cuộc Bạn',
    installment_number: 1,
    installment_label: 'Thanh toán đầy đủ',
    amount: 3200000,
    status: 'paid',
    due_date: '2026-01-20',
    paid_at: '2026-01-18T09:00:00Z',
  },
]

const mockPaymentDetail = {
  ...mockPayments[0],
  bank_info: {
    bank_name: 'Vietcombank',
    account_number: '1234567890',
    account_name: 'CÔNG TY TNHH NEDU EDUCATION',
    transfer_content: 'NEDU LCM12 NGUYEN MINH ANH DOT2',
    qr_code_url: 'https://placehold.co/200x200/1a1a2e/c8a951?text=QR+Code',
  },
}

export const paymentsHandlers = [
  http.get(`${API}/api/v1/payments`, () => {
    return HttpResponse.json(mockPayments)
  }),

  http.get(`${API}/api/v1/payments/pending`, () => {
    return HttpResponse.json({
      payment_id: 'pay-001',
      enrollment_id: 'enr-001',
      course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
      installment_label: 'Đợt 2',
      amount: 5500000,
      due_date: '2026-04-25',
      status: 'pending',
      status_label: 'Chờ thanh toán',
    })
  }),

  http.get(`${API}/api/v1/payments/:id`, () => {
    return HttpResponse.json(mockPaymentDetail)
  }),

  http.post(`${API}/api/v1/payments/:id/confirm`, () => {
    return HttpResponse.json({ message: 'Confirmed', status: 'awaiting_verification' })
  }),
]
