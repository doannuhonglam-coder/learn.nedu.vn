import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL || 'https://api.nedu.vn'

const mockAssignments = [
  {
    id: 'asg-001',
    title: 'Bài tập: Nhật ký cảm xúc tuần 3',
    course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    course_id: 'crs-001',
    due_date: '2026-04-16T23:59:00+07:00',
    status: 'not_submitted',
    is_urgent: true,
    description: 'Viết nhật ký cảm xúc mỗi ngày trong tuần 3. Ghi lại ít nhất 3 tình huống trigger cảm xúc mạnh và cách bạn phản ứng.',
    max_file_size_mb: 10,
    allowed_file_types: ['pdf', 'docx', 'jpg', 'png'],
    submission: null,
  },
  {
    id: 'asg-002',
    title: 'Reflection: Giá trị cốt lõi của bạn',
    course_name: 'Con Số & Cuộc Bạn',
    course_id: 'crs-003',
    due_date: '2026-04-22T23:59:00+07:00',
    status: 'not_submitted',
    is_urgent: false,
    description: 'Viết bài reflection 500-1000 từ về 5 giá trị cốt lõi quan trọng nhất của bạn và cách chúng ảnh hưởng đến quyết định hàng ngày.',
    max_file_size_mb: 10,
    allowed_file_types: ['pdf', 'docx'],
    submission: null,
  },
  {
    id: 'asg-003',
    title: 'Case Study: Xung đột trong team',
    course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    course_id: 'crs-001',
    due_date: '2026-04-10T23:59:00+07:00',
    status: 'graded',
    is_urgent: false,
    description: 'Phân tích case study về xung đột trong team và đề xuất giải pháp.',
    max_file_size_mb: 10,
    allowed_file_types: ['pdf', 'docx'],
    submission: {
      id: 'sub-001',
      content: 'Bài phân tích case study xung đột...',
      file_url: null,
      submitted_at: '2026-04-09T15:30:00+07:00',
      grade: 8.5,
      feedback: 'Phân tích tốt! Đề xuất giải pháp rất thực tế. Cần bổ sung thêm về vai trò cảm xúc trong xung đột.',
      graded_at: '2026-04-11T10:00:00+07:00',
    },
  },
]

export const assignmentsHandlers = [
  http.get(`${API}/api/v1/assignments`, () => {
    return HttpResponse.json(mockAssignments)
  }),

  http.get(`${API}/api/v1/assignments/:id`, ({ params }) => {
    const assignment = mockAssignments.find((a) => a.id === params.id)
    if (!assignment) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Not found', request_id: 'req-x' }, { status: 404 })
    return HttpResponse.json(assignment)
  }),

  http.post(`${API}/api/v1/assignments/:id/submit`, async ({ request }) => {
    const body = await request.json() as { content: string; file_url?: string }
    return HttpResponse.json({
      id: 'sub-new',
      content: body.content,
      file_url: body.file_url || null,
      submitted_at: new Date().toISOString(),
      grade: null,
      feedback: null,
      graded_at: null,
    })
  }),
]
