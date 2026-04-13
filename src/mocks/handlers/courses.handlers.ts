import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL || 'https://api.nedu.vn'

const mockEnrollments = [
  {
    id: 'enr-001',
    course: {
      id: 'crs-001',
      name: 'Lãnh Đạo Cảm Xúc Mùa 12',
      slug: 'lcm-12',
      course_type: 'cohort',
      status: 'published',
      instructor_name: 'Chị Nhí Lê',
      thumbnail_url: null,
      retreat_date: null,
      retreat_countdown_seconds: null,
      cohort_start_date: '2026-03-01',
      cohort_end_date: '2026-06-01',
      coaching_sessions_completed: null,
      coaching_sessions_total: null,
      metaphysical_match_score: 85,
    },
    status: 'active',
    payment_status: 'partial',
    progress_percent: 42,
    enrolled_at: '2026-03-01T00:00:00Z',
    expired_at: null,
  },
  {
    id: 'enr-002',
    course: {
      id: 'crs-002',
      name: 'Retreat Tĩnh Tâm Đà Lạt',
      slug: 'retreat-dalat-2026',
      course_type: 'retreat',
      status: 'published',
      instructor_name: 'Chị Nhí Lê',
      thumbnail_url: null,
      retreat_date: '2026-05-01',
      retreat_countdown_seconds: 1555200,
      cohort_start_date: null,
      cohort_end_date: null,
      coaching_sessions_completed: null,
      coaching_sessions_total: null,
      metaphysical_match_score: null,
    },
    status: 'active',
    payment_status: 'paid',
    progress_percent: 0,
    enrolled_at: '2026-02-15T00:00:00Z',
    expired_at: null,
  },
  {
    id: 'enr-003',
    course: {
      id: 'crs-003',
      name: 'Con Số & Cuộc Bạn',
      slug: 'cscb-on-demand',
      course_type: 'on_demand',
      status: 'published',
      instructor_name: 'Thầy Minh',
      thumbnail_url: null,
      retreat_date: null,
      retreat_countdown_seconds: null,
      cohort_start_date: null,
      cohort_end_date: null,
      coaching_sessions_completed: null,
      coaching_sessions_total: null,
      metaphysical_match_score: null,
    },
    status: 'active',
    payment_status: 'paid',
    progress_percent: 65,
    enrolled_at: '2026-01-20T00:00:00Z',
    expired_at: null,
  },
  {
    id: 'enr-004',
    course: {
      id: 'crs-004',
      name: 'Coaching 1:1 với Chị Nhí',
      slug: 'coaching-nhi-2026',
      course_type: 'coaching',
      status: 'published',
      instructor_name: 'Chị Nhí Lê',
      thumbnail_url: null,
      retreat_date: null,
      retreat_countdown_seconds: null,
      cohort_start_date: null,
      cohort_end_date: null,
      coaching_sessions_completed: 3,
      coaching_sessions_total: 8,
      metaphysical_match_score: null,
    },
    status: 'active',
    payment_status: 'paid',
    progress_percent: 37,
    enrolled_at: '2026-02-01T00:00:00Z',
    expired_at: null,
  },
  {
    id: 'enr-005',
    course: {
      id: 'crs-005',
      name: 'Khám Phá Bản Thân K9',
      slug: 'kpbt-k9',
      course_type: 'cohort',
      status: 'published',
      instructor_name: 'Thầy Minh',
      thumbnail_url: null,
      retreat_date: null,
      retreat_countdown_seconds: null,
      cohort_start_date: '2025-09-01',
      cohort_end_date: '2025-12-01',
      coaching_sessions_completed: null,
      coaching_sessions_total: null,
      metaphysical_match_score: null,
    },
    status: 'completed',
    payment_status: 'paid',
    progress_percent: 100,
    enrolled_at: '2025-09-01T00:00:00Z',
    expired_at: null,
  },
]

const mockCourseDetail = {
  id: 'crs-001',
  name: 'Lãnh Đạo Cảm Xúc Mùa 12',
  slug: 'lcm-12',
  course_type: 'cohort',
  status: 'published',
  instructor_name: 'Chị Nhí Lê',
  thumbnail_url: null,
  retreat_date: null,
  retreat_countdown_seconds: null,
  cohort_start_date: '2026-03-01',
  cohort_end_date: '2026-06-01',
  coaching_sessions_completed: null,
  coaching_sessions_total: null,
  metaphysical_match_score: 85,
  description: 'Khoá học giúp bạn hiểu và làm chủ cảm xúc trong vai trò lãnh đạo. Qua 12 tuần, bạn sẽ phát triển khả năng nhận diện, điều chỉnh và sử dụng cảm xúc một cách hiệu quả.',
  program: { id: 'prg-001', name: 'LCM' },
  modules: [
    { id: 'mod-001', title: 'Module 1: Nhận Diện Cảm Xúc', order_index: 1, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-002', title: 'Module 2: Hiểu Về Bản Thân', order_index: 2, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-003', title: 'Module 3: Cảm Xúc & Giao Tiếp', order_index: 3, lessons_count: 4, lessons_completed: 2, is_locked: false },
    { id: 'mod-004', title: 'Module 4: Lãnh Đạo Bằng Trái Tim', order_index: 4, lessons_count: 4, lessons_completed: 0, is_locked: true },
  ],
  retreat_location: null,
  retreat_prep_checklist: null,
  retreat_schedule: null,
}

const mockRetreatDetail = {
  id: 'crs-002',
  name: 'Retreat Tĩnh Tâm Đà Lạt',
  slug: 'retreat-dalat-2026',
  course_type: 'retreat',
  status: 'published',
  instructor_name: 'Chị Nhí Lê',
  thumbnail_url: null,
  retreat_date: '2026-05-01',
  retreat_countdown_seconds: 1555200,
  cohort_start_date: null,
  cohort_end_date: null,
  coaching_sessions_completed: null,
  coaching_sessions_total: null,
  metaphysical_match_score: null,
  description: 'Retreat 3 ngày 2 đêm tại Đà Lạt. Trải nghiệm thiền, yoga, và các hoạt động kết nối nội tâm giữa thiên nhiên.',
  program: null,
  modules: [],
  retreat_location: 'Đà Lạt, Lâm Đồng',
  retreat_prep_checklist: [
    { id: 'chk-001', title: 'Đặt vé máy bay/xe', description: 'Bay đến Liên Khương hoặc xe khách đến Đà Lạt', due_date: '2026-04-20', is_checked: true },
    { id: 'chk-002', title: 'Chuẩn bị quần áo thoải mái', description: 'Quần áo yoga, áo khoác (Đà Lạt lạnh buổi tối)', due_date: '2026-04-28', is_checked: false },
    { id: 'chk-003', title: 'Nhật ký cá nhân', description: 'Mang theo sổ tay để ghi chép', due_date: null, is_checked: false },
    { id: 'chk-004', title: 'Thuốc cá nhân', description: 'Nếu có thuốc đang uống', due_date: null, is_checked: true },
  ],
  retreat_schedule: [
    {
      day_number: 1, date: '2026-05-01', title: 'Ngày 1: Đón Tiếp & Kết Nối',
      activities: [
        { time: '08:00', title: 'Đón khách tại resort' },
        { time: '10:00', title: 'Khai mạc & Giới thiệu' },
        { time: '14:00', title: 'Workshop: Hơi thở & Năng lượng' },
        { time: '19:00', title: 'Dinner & Chia sẻ nhóm' },
      ],
    },
    {
      day_number: 2, date: '2026-05-02', title: 'Ngày 2: Hành Trình Nội Tâm',
      activities: [
        { time: '06:00', title: 'Yoga buổi sáng' },
        { time: '09:00', title: 'Workshop: Nhận diện cảm xúc sâu' },
        { time: '14:00', title: 'Thiền walking trong rừng' },
        { time: '19:00', title: 'Lễ lửa trại & Chia sẻ' },
      ],
    },
    {
      day_number: 3, date: '2026-05-03', title: 'Ngày 3: Tái Sinh & Cam Kết',
      activities: [
        { time: '06:00', title: 'Thiền buổi sáng' },
        { time: '09:00', title: 'Workshop: Cam kết hành động' },
        { time: '12:00', title: 'Bế mạc & Trao chứng nhận' },
        { time: '14:00', title: 'Check-out & Chia tay' },
      ],
    },
  ],
}

const mockLessons = [
  { id: 'les-001', title: 'Bài 1: Cảm xúc là gì?', order_index: 1, duration_minutes: 25, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-03-05T10:00:00Z', unlock_condition: null },
  { id: 'les-002', title: 'Bài 2: Vòng tròn cảm xúc', order_index: 2, duration_minutes: 30, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-03-07T10:00:00Z', unlock_condition: null },
  { id: 'les-003', title: 'Bài 3: Nhận diện trigger', order_index: 3, duration_minutes: 20, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-03-10T10:00:00Z', unlock_condition: null },
  { id: 'les-004', title: 'Bài 4: Bài tập thực hành tuần 1', order_index: 4, duration_minutes: 15, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-03-12T10:00:00Z', unlock_condition: null },
  { id: 'les-005', title: 'Bài 5: Giá trị cốt lõi', order_index: 5, duration_minutes: 35, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-03-15T10:00:00Z', unlock_condition: null },
  { id: 'les-006', title: 'Bài 6: Shadow work cơ bản', order_index: 6, duration_minutes: 40, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-03-20T10:00:00Z', unlock_condition: null },
  { id: 'les-007', title: 'Bài 7: Lắng nghe chủ động', order_index: 7, duration_minutes: 30, is_preview: false, is_locked: false, is_completed: false, completed_at: null, unlock_condition: null },
  { id: 'les-008', title: 'Bài 8: Giao tiếp phi bạo lực', order_index: 8, duration_minutes: 35, is_preview: false, is_locked: false, is_completed: false, completed_at: null, unlock_condition: null },
  { id: 'les-009', title: 'Bài 9: Phản hồi xây dựng', order_index: 9, duration_minutes: 25, is_preview: false, is_locked: true, is_completed: false, completed_at: null, unlock_condition: 'Hoàn thành Module 3 để mở khóa' },
  { id: 'les-010', title: 'Bài 10: Dẫn dắt bằng cảm xúc', order_index: 10, duration_minutes: 40, is_preview: false, is_locked: true, is_completed: false, completed_at: null, unlock_condition: 'Hoàn thành Module 3 để mở khóa' },
]

const mockLessonDetail = {
  id: 'les-007',
  title: 'Bài 7: Lắng nghe chủ động',
  order_index: 7,
  duration_minutes: 30,
  is_preview: false,
  is_locked: false,
  is_completed: false,
  completed_at: null,
  unlock_condition: null,
  module_id: 'mod-003',
  module_title: 'Module 3: Cảm Xúc & Giao Tiếp',
  description: 'Học cách lắng nghe một cách chủ động và thấu cảm. Bài học bao gồm các kỹ thuật lắng nghe hiệu quả trong giao tiếp hàng ngày và trong vai trò lãnh đạo.',
  video: {
    cloudflare_stream_id: 'mock-stream-id-007',
    thumbnail_url: 'https://placehold.co/640x360/1a1a2e/c8a951?text=Bai+7',
    signed_token: 'mock-signed-token-007',
    duration_seconds: 1800,
  },
  materials: [
    { id: 'mat-001', title: 'Slide bài giảng - Lắng nghe chủ động', file_type: 'pdf', file_size_bytes: 2500000, signed_url: '#' },
    { id: 'mat-002', title: 'Bài tập thực hành tuần 3', file_type: 'docx', file_size_bytes: 150000, signed_url: '#' },
  ],
  notes: 'Ghi chú cá nhân: Nhớ thực hành kỹ thuật phản chiếu...',
}

export const coursesHandlers = [
  http.get(`${API}/api/v1/enrollments`, () => {
    return HttpResponse.json(mockEnrollments)
  }),

  http.get(`${API}/api/v1/enrollments/:id`, ({ params }) => {
    const enrollment = mockEnrollments.find((e) => e.id === params.id)
    if (!enrollment) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Not found', request_id: 'req-x' }, { status: 404 })
    return HttpResponse.json({
      ...enrollment,
      modules_completed: 2,
      modules_total: 4,
      lessons_completed: 10,
      lessons_total: 16,
      certificates: [],
      payments: [],
    })
  }),

  http.get(`${API}/api/v1/courses/:id`, ({ params }) => {
    if (params.id === 'crs-002') return HttpResponse.json(mockRetreatDetail)
    return HttpResponse.json(mockCourseDetail)
  }),

  http.get(`${API}/api/v1/courses/:id/lessons`, () => {
    return HttpResponse.json(mockLessons)
  }),

  http.get(`${API}/api/v1/courses/:id/materials`, () => {
    return HttpResponse.json(mockLessonDetail.materials)
  }),

  http.get(`${API}/api/v1/lessons/:id`, () => {
    return HttpResponse.json(mockLessonDetail)
  }),

  http.post(`${API}/api/v1/lessons/:id/progress`, async ({ request }) => {
    const body = await request.json() as { watch_percent: number }
    return HttpResponse.json({
      lesson_id: 'les-007',
      is_completed: body.watch_percent >= 80,
      watch_percent: body.watch_percent,
      completed_at: body.watch_percent >= 80 ? new Date().toISOString() : null,
      course_progress_updated: {
        progress_percent: 48,
        is_course_completed: false,
        certificate_unlocked: false,
      },
    })
  }),

  http.get(`${API}/api/v1/lessons/:id/notes`, () => {
    return HttpResponse.json({ content: mockLessonDetail.notes })
  }),

  http.put(`${API}/api/v1/lessons/:id/notes`, async ({ request }) => {
    const body = await request.json() as { content: string }
    return HttpResponse.json({ content: body.content })
  }),
]
