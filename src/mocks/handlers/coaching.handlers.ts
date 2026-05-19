import { http, HttpResponse } from 'msw'

// Mock coaching sessions — match BE /api/learn/coaching/sessions DTO.
const mockSessions = [
  {
    id: 'cs-001',
    enrollment_id: 'enr-004',
    course_run_id: 'crsrun-coaching-2026-h1',
    course_id: 'crs-004',
    course_name: 'Coaching 1:1 với Chị Nhí',
    course_slug: 'coaching-nhi-2026',
    session_number: 4,
    sessions_total: 8,
    title: 'Buổi 4: Lãnh đạo cảm xúc nội tâm',
    description: 'Review homework tuần trước + framework EI mới.',
    scheduled_at: '2026-04-22T19:00:00+07:00',
    end_at: '2026-04-22T20:00:00+07:00',
    duration_minutes: 60,
    status: 'scheduled' as const,
    is_joinable: false,
    meeting_url: 'https://zoom.us/j/123456789',
    meeting_id: '123 456 789',
    meeting_passcode: 'nedu2026',
    recording_url: null,
    has_notes: false,
  },
  {
    id: 'cs-002',
    enrollment_id: 'enr-004',
    course_run_id: 'crsrun-coaching-2026-h1',
    course_id: 'crs-004',
    course_name: 'Coaching 1:1 với Chị Nhí',
    course_slug: 'coaching-nhi-2026',
    session_number: 3,
    sessions_total: 8,
    title: 'Buổi 3: Giá trị cốt lõi',
    description: null,
    scheduled_at: '2026-04-08T19:00:00+07:00',
    end_at: '2026-04-08T20:00:00+07:00',
    duration_minutes: 60,
    status: 'completed' as const,
    is_joinable: false,
    meeting_url: null,
    meeting_id: null,
    meeting_passcode: null,
    recording_url: 'https://example.com/recording-3',
    has_notes: true,
  },
]

const mockNote = {
  summary_text: 'Minh Anh nhận diện 3 giá trị cốt lõi: trung thực, sáng tạo, ảnh hưởng.',
  homework_items: [
    'Viết 1 trang nhật ký về 1 giá trị mỗi ngày trong tuần',
    'Quan sát 3 tình huống bạn áp dụng giá trị này',
  ],
  written_at: '2026-04-09T10:30:00+07:00',
}

export const coachingHandlers = [
  http.get(`*/api/learn/coaching/sessions`, () => {
    return HttpResponse.json(mockSessions)
  }),

  http.get(`*/api/learn/coaching/sessions/:id`, ({ params }) => {
    const session = mockSessions.find((s) => s.id === params.id)
    if (!session) {
      return HttpResponse.json(
        { message: 'Coaching session not found' },
        { status: 404 },
      )
    }
    return HttpResponse.json({
      ...session,
      note: session.has_notes ? mockNote : null,
    })
  }),
]
