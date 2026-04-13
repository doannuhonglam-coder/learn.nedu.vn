import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL || 'https://api.nedu.vn'

const mockCertificates = [
  {
    id: 'cert-001',
    certificate_no: 'NEDU-CERT-2025-0892',
    title: 'Chứng chỉ Khám Phá Bản Thân K9',
    course_name: 'Khám Phá Bản Thân K9',
    issued_at: '2025-12-15T10:00:00Z',
    is_locked: false,
    unlock_condition: null,
  },
  {
    id: 'cert-002',
    certificate_no: null,
    title: 'Chứng chỉ Lãnh Đạo Cảm Xúc Mùa 12',
    course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    issued_at: null,
    is_locked: true,
    unlock_condition: 'Hoàn thành 100% khoá học để nhận chứng chỉ',
  },
  {
    id: 'cert-003',
    certificate_no: null,
    title: 'Chứng chỉ Retreat Tĩnh Tâm',
    course_name: 'Retreat Tĩnh Tâm Đà Lạt',
    issued_at: null,
    is_locked: true,
    unlock_condition: 'Tham gia đầy đủ Retreat để nhận chứng nhận',
  },
]

export const certificatesHandlers = [
  http.get(`${API}/api/v1/certificates`, () => {
    return HttpResponse.json(mockCertificates)
  }),

  http.get(`${API}/api/v1/certificates/:id`, ({ params }) => {
    const cert = mockCertificates.find((c) => c.id === params.id)
    if (!cert) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Not found', request_id: 'req-x' }, { status: 404 })
    return HttpResponse.json({
      ...cert,
      student_name: 'Nguyễn Minh Anh',
      pdf_url: cert.is_locked ? null : '#',
    })
  }),
]
