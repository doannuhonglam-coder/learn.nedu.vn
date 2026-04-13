// Static mock data used as fallback when MSW is not available (e.g. Vercel deployment)

const mockUser = {
  id: 'stu-001',
  full_name: 'Nguyễn Minh Anh',
  email: 'minhanh@example.com',
  phone: '0901234567',
  avatar_url: null,
  student_code: 'NEDU-2026-001234',
  is_active: true,
  activated_at: '2026-01-15T10:00:00Z',
  created_at: '2026-01-10T08:00:00Z',
  consultant_name: 'Chị Nhí',
}

const mockHomeSummary = {
  student: { id: 'stu-001', full_name: 'Nguyễn Minh Anh', status_label: 'Học viên Nedu' },
  stats: { active_courses: 3, completion_percent: 42, certificates_count: 1 },
  noi_status: { status: 'active', label: 'N-ơi · Đang hoạt động', checkins: 12, streak_weeks: 4, ninety_day_percent: 67 },
  pending_payment: {
    payment_id: 'pay-001', enrollment_id: 'enr-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    installment_label: 'Đợt 2', amount: 5500000, due_date: '2026-04-25', status: 'pending', status_label: 'Chờ thanh toán',
  },
  upcoming_events: [
    { id: 'evt-001', title: 'Live Q&A: Cảm Xúc Trong Lãnh Đạo', event_type: 'online', start_time: '2026-04-15T19:00:00+07:00', end_time: '2026-04-15T20:30:00+07:00', platform: 'Zoom', location: null },
    { id: 'evt-002', title: 'Retreat Tĩnh Tâm Đà Lạt', event_type: 'retreat', start_time: '2026-05-01T08:00:00+07:00', end_time: '2026-05-03T17:00:00+07:00', platform: null, location: 'Đà Lạt' },
    { id: 'evt-003', title: 'Workshop Offline: Hơi Thở & Năng Lượng', event_type: 'offline', start_time: '2026-04-20T09:00:00+07:00', end_time: '2026-04-20T12:00:00+07:00', platform: null, location: 'Nedu HQ - Q3, HCM' },
  ],
  pending_assignments: [
    { id: 'asg-001', title: 'Bài tập: Nhật ký cảm xúc tuần 3', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', due_date: '2026-04-16T23:59:00+07:00', status: 'not_submitted', is_urgent: true },
    { id: 'asg-002', title: 'Reflection: Giá trị cốt lõi của bạn', course_name: 'Con Số & Cuộc Bạn', due_date: '2026-04-22T23:59:00+07:00', status: 'not_submitted', is_urgent: false },
  ],
  recent_courses: [
    { id: 'crs-001', name: 'Lãnh Đạo Cảm Xúc Mùa 12', slug: 'lcm-12', course_type: 'cohort', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_countdown_seconds: null, cohort_start_date: '2026-03-01', cohort_end_date: '2026-06-01', coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: 85 },
    { id: 'crs-002', name: 'Retreat Tĩnh Tâm Đà Lạt', slug: 'retreat-dalat-2026', course_type: 'retreat', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: '2026-05-01', retreat_countdown_seconds: 1555200, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: null },
    { id: 'crs-003', name: 'Con Số & Cuộc Bạn', slug: 'cscb-on-demand', course_type: 'on_demand', status: 'published', instructor_name: 'Thầy Minh', thumbnail_url: null, retreat_date: null, retreat_countdown_seconds: null, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: null },
  ],
}

const mockContinueLearning = {
  enrollment_id: 'enr-001', course_id: 'crs-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
  course_type: 'cohort', instructor_name: 'Chị Nhí Lê', current_module: 'Module 3: Cảm Xúc & Giao Tiếp',
  progress_percent: 42, next_lesson: { id: 'les-007', title: 'Bài 7: Lắng nghe chủ động' },
}

const mockEnrollments = [
  { id: 'enr-001', course: { id: 'crs-001', name: 'Lãnh Đạo Cảm Xúc Mùa 12', slug: 'lcm-12', course_type: 'cohort', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_countdown_seconds: null, cohort_start_date: '2026-03-01', cohort_end_date: '2026-06-01', coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: 85 }, status: 'active', payment_status: 'partial', progress_percent: 42, enrolled_at: '2026-03-01T00:00:00Z', expired_at: null },
  { id: 'enr-002', course: { id: 'crs-002', name: 'Retreat Tĩnh Tâm Đà Lạt', slug: 'retreat-dalat-2026', course_type: 'retreat', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: '2026-05-01', retreat_countdown_seconds: 1555200, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: null }, status: 'active', payment_status: 'paid', progress_percent: 0, enrolled_at: '2026-02-15T00:00:00Z', expired_at: null },
  { id: 'enr-003', course: { id: 'crs-003', name: 'Con Số & Cuộc Bạn', slug: 'cscb-on-demand', course_type: 'on_demand', status: 'published', instructor_name: 'Thầy Minh', thumbnail_url: null, retreat_date: null, retreat_countdown_seconds: null, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: null }, status: 'active', payment_status: 'paid', progress_percent: 65, enrolled_at: '2026-01-20T00:00:00Z', expired_at: null },
  { id: 'enr-004', course: { id: 'crs-004', name: 'Coaching 1:1 với Chị Nhí', slug: 'coaching-nhi-2026', course_type: 'coaching', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_countdown_seconds: null, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: 3, coaching_sessions_total: 8, metaphysical_match_score: null }, status: 'active', payment_status: 'paid', progress_percent: 37, enrolled_at: '2026-02-01T00:00:00Z', expired_at: null },
  { id: 'enr-005', course: { id: 'crs-005', name: 'Khám Phá Bản Thân K9', slug: 'kpbt-k9', course_type: 'cohort', status: 'published', instructor_name: 'Thầy Minh', thumbnail_url: null, retreat_date: null, retreat_countdown_seconds: null, cohort_start_date: '2025-09-01', cohort_end_date: '2025-12-01', coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: null }, status: 'completed', payment_status: 'paid', progress_percent: 100, enrolled_at: '2025-09-01T00:00:00Z', expired_at: null },
]

const mockCourseDetail = {
  id: 'crs-001', name: 'Lãnh Đạo Cảm Xúc Mùa 12', slug: 'lcm-12', course_type: 'cohort', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_countdown_seconds: null, cohort_start_date: '2026-03-01', cohort_end_date: '2026-06-01', coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: 85,
  description: 'Khoá học giúp bạn hiểu và làm chủ cảm xúc trong vai trò lãnh đạo.', program: { id: 'prg-001', name: 'LCM' },
  modules: [
    { id: 'mod-001', title: 'Module 1: Nhận Diện Cảm Xúc', order_index: 1, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-002', title: 'Module 2: Hiểu Về Bản Thân', order_index: 2, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-003', title: 'Module 3: Cảm Xúc & Giao Tiếp', order_index: 3, lessons_count: 4, lessons_completed: 2, is_locked: false },
    { id: 'mod-004', title: 'Module 4: Lãnh Đạo Bằng Trái Tim', order_index: 4, lessons_count: 4, lessons_completed: 0, is_locked: true },
  ],
  retreat_location: null, retreat_prep_checklist: null, retreat_schedule: null,
}

const mockRetreatDetail = {
  id: 'crs-002', name: 'Retreat Tĩnh Tâm Đà Lạt', slug: 'retreat-dalat-2026', course_type: 'retreat', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: '2026-05-01', retreat_countdown_seconds: 1555200, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, metaphysical_match_score: null,
  description: 'Retreat 3 ngày 2 đêm tại Đà Lạt.', program: null, modules: [],
  retreat_location: 'Đà Lạt, Lâm Đồng',
  retreat_prep_checklist: [
    { id: 'chk-001', title: 'Đặt vé máy bay/xe', description: 'Bay đến Liên Khương', due_date: '2026-04-20', is_checked: true },
    { id: 'chk-002', title: 'Chuẩn bị quần áo thoải mái', description: 'Quần áo yoga, áo khoác', due_date: '2026-04-28', is_checked: false },
    { id: 'chk-003', title: 'Nhật ký cá nhân', description: 'Mang theo sổ tay', due_date: null, is_checked: false },
  ],
  retreat_schedule: [
    { day_number: 1, date: '2026-05-01', title: 'Ngày 1: Đón Tiếp & Kết Nối', activities: [{ time: '08:00', title: 'Đón khách tại resort' }, { time: '10:00', title: 'Khai mạc' }, { time: '14:00', title: 'Workshop: Hơi thở & Năng lượng' }, { time: '19:00', title: 'Dinner & Chia sẻ nhóm' }] },
    { day_number: 2, date: '2026-05-02', title: 'Ngày 2: Hành Trình Nội Tâm', activities: [{ time: '06:00', title: 'Yoga buổi sáng' }, { time: '09:00', title: 'Workshop: Nhận diện cảm xúc sâu' }, { time: '14:00', title: 'Thiền walking trong rừng' }] },
    { day_number: 3, date: '2026-05-03', title: 'Ngày 3: Tái Sinh & Cam Kết', activities: [{ time: '06:00', title: 'Thiền buổi sáng' }, { time: '09:00', title: 'Workshop: Cam kết hành động' }, { time: '12:00', title: 'Bế mạc & Trao chứng nhận' }] },
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
  id: 'les-007', title: 'Bài 7: Lắng nghe chủ động', order_index: 7, duration_minutes: 30, is_preview: false, is_locked: false, is_completed: false, completed_at: null, unlock_condition: null,
  module_id: 'mod-003', module_title: 'Module 3: Cảm Xúc & Giao Tiếp',
  description: 'Học cách lắng nghe một cách chủ động và thấu cảm.',
  video: { cloudflare_stream_id: 'mock-stream-id-007', thumbnail_url: '', signed_token: 'mock-token', duration_seconds: 1800 },
  materials: [
    { id: 'mat-001', title: 'Slide bài giảng - Lắng nghe chủ động', file_type: 'pdf', file_size_bytes: 2500000, signed_url: '#' },
    { id: 'mat-002', title: 'Bài tập thực hành tuần 3', file_type: 'docx', file_size_bytes: 150000, signed_url: '#' },
  ],
  notes: 'Ghi chú cá nhân: Nhớ thực hành kỹ thuật phản chiếu...',
}

const mockEvents = [
  { id: 'evt-001', title: 'Live Q&A: Cảm Xúc Trong Lãnh Đạo', event_type: 'online', start_time: '2026-04-15T19:00:00+07:00', end_time: '2026-04-15T20:30:00+07:00', platform: 'Zoom', location: null, course_id: 'crs-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', instructor_name: 'Chị Nhí Lê', description: 'Buổi Q&A trực tuyến.', meeting_url: null, is_joinable: false, join_available_in_seconds: 7200, ical_url: '#' },
  { id: 'evt-002', title: 'Retreat Tĩnh Tâm Đà Lạt', event_type: 'retreat', start_time: '2026-05-01T08:00:00+07:00', end_time: '2026-05-03T17:00:00+07:00', platform: null, location: 'Đà Lạt, Lâm Đồng', course_id: 'crs-002', course_name: 'Retreat Tĩnh Tâm Đà Lạt', instructor_name: 'Chị Nhí Lê', description: 'Retreat 3 ngày 2 đêm.', meeting_url: null, is_joinable: false, join_available_in_seconds: null, ical_url: '#' },
  { id: 'evt-003', title: 'Workshop Offline: Hơi Thở & Năng Lượng', event_type: 'offline', start_time: '2026-04-20T09:00:00+07:00', end_time: '2026-04-20T12:00:00+07:00', platform: null, location: 'Nedu HQ - Q3, HCM', course_id: 'crs-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', instructor_name: 'Chị Nhí Lê', description: 'Workshop thực hành.', meeting_url: null, is_joinable: false, join_available_in_seconds: null, ical_url: '#' },
  { id: 'evt-004', title: 'Coaching Session #4', event_type: 'online', start_time: '2026-04-22T10:00:00+07:00', end_time: '2026-04-22T11:00:00+07:00', platform: 'Google Meet', location: null, course_id: 'crs-004', course_name: 'Coaching 1:1 với Chị Nhí', instructor_name: 'Chị Nhí Lê', description: 'Buổi coaching lần 4.', meeting_url: null, is_joinable: false, join_available_in_seconds: null, ical_url: '#' },
  { id: 'evt-005', title: 'Live Class: Module 3 Review', event_type: 'online', start_time: '2026-04-28T19:30:00+07:00', end_time: '2026-04-28T21:00:00+07:00', platform: 'Zoom', location: null, course_id: 'crs-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', instructor_name: 'Chị Nhí Lê', description: 'Ôn tập Module 3.', meeting_url: null, is_joinable: false, join_available_in_seconds: null, ical_url: '#' },
]

const mockPayments = [
  { id: 'pay-001', enrollment_id: 'enr-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', installment_number: 2, installment_label: 'Đợt 2', amount: 5500000, status: 'pending', due_date: '2026-04-25', paid_at: null },
  { id: 'pay-002', enrollment_id: 'enr-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', installment_number: 1, installment_label: 'Đợt 1', amount: 5500000, status: 'paid', due_date: '2026-03-01', paid_at: '2026-02-28T10:00:00Z' },
  { id: 'pay-003', enrollment_id: 'enr-002', course_name: 'Retreat Tĩnh Tâm Đà Lạt', installment_number: 1, installment_label: 'Thanh toán đầy đủ', amount: 8000000, status: 'paid', due_date: '2026-03-15', paid_at: '2026-03-10T15:30:00Z' },
  { id: 'pay-004', enrollment_id: 'enr-003', course_name: 'Con Số & Cuộc Bạn', installment_number: 1, installment_label: 'Thanh toán đầy đủ', amount: 3200000, status: 'paid', due_date: '2026-01-20', paid_at: '2026-01-18T09:00:00Z' },
]

const mockPaymentDetail = {
  ...mockPayments[0],
  bank_info: { bank_name: 'Vietcombank', account_number: '1234567890', account_name: 'CÔNG TY TNHH NEDU EDUCATION', transfer_content: 'NEDU LCM12 NGUYEN MINH ANH DOT2', qr_code_url: 'https://placehold.co/200x200/1a1a2e/c8a951?text=QR+Code' },
}

const mockAssignments = [
  { id: 'asg-001', title: 'Bài tập: Nhật ký cảm xúc tuần 3', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', course_id: 'crs-001', due_date: '2026-04-16T23:59:00+07:00', status: 'not_submitted', is_urgent: true, description: 'Viết nhật ký cảm xúc mỗi ngày trong tuần 3.', max_file_size_mb: 10, allowed_file_types: ['pdf', 'docx', 'jpg', 'png'], submission: null },
  { id: 'asg-002', title: 'Reflection: Giá trị cốt lõi của bạn', course_name: 'Con Số & Cuộc Bạn', course_id: 'crs-003', due_date: '2026-04-22T23:59:00+07:00', status: 'not_submitted', is_urgent: false, description: 'Viết bài reflection 500-1000 từ.', max_file_size_mb: 10, allowed_file_types: ['pdf', 'docx'], submission: null },
  { id: 'asg-003', title: 'Case Study: Xung đột trong team', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', course_id: 'crs-001', due_date: '2026-04-10T23:59:00+07:00', status: 'graded', is_urgent: false, description: 'Phân tích case study.', max_file_size_mb: 10, allowed_file_types: ['pdf', 'docx'], submission: { id: 'sub-001', content: 'Bài phân tích...', file_url: null, submitted_at: '2026-04-09T15:30:00+07:00', grade: 8.5, feedback: 'Phân tích tốt!', graded_at: '2026-04-11T10:00:00+07:00' } },
]

const mockNotifications = [
  { id: 'notif-001', type: 'payment', icon: '💳', title: 'Nhắc thanh toán Đợt 2', body: 'Đợt 2 khoá LCM12 sắp đến hạn.', created_at: '2026-04-12T08:00:00+07:00', is_read: false, action_url: '/payments' },
  { id: 'notif-002', type: 'assignment', icon: '📝', title: 'Bài tập sắp hết hạn', body: 'Nhật ký cảm xúc tuần 3 - Hạn 16/04.', created_at: '2026-04-13T07:00:00+07:00', is_read: false, action_url: null },
  { id: 'notif-003', type: 'schedule', icon: '📅', title: 'Lịch học ngày mai', body: 'Live Q&A 19:00 ngày 15/04 trên Zoom.', created_at: '2026-04-14T08:00:00+07:00', is_read: false, action_url: '/schedule' },
  { id: 'notif-004', type: 'certificate', icon: '🎓', title: 'Chứng chỉ đã sẵn sàng', body: 'Chứng chỉ khoá KPBT K9 đã được cấp.', created_at: '2026-04-10T10:00:00+07:00', is_read: true, action_url: null },
]

const mockMetaphysical = {
  student_id: 'stu-001',
  bazi: { day_master: 'Nhâm Thân', element: 'Thủy', summary: 'Bạn mang mệnh Thủy — linh hoạt, thông minh, giỏi giao tiếp.', pillars: {} },
  nine_star_ki: { main_star: 7, star_name: 'Sao 7 Kim', energy_pattern: 'Kim — Thu hoạch & Hoàn thiện', summary: 'Sao 7 Kim đại diện cho năng lượng thu hoạch và sự tinh tế.' },
  numerology: { life_path: 7, expression: 5, soul_urge: 3, summary: 'Life Path 7 — Con đường của người tìm kiếm chân lý.' },
  mbti: { type: 'INFJ', summary: 'INFJ — Nhà tư vấn. Trực giác mạnh, lý tưởng.' },
  enneagram: { type: '4', wing: '5', summary: 'Enneagram 4w5 — Nghệ sĩ tư duy.' },
  recommended_path_note: 'Minh Anh nên tập trung phát triển kỹ năng lãnh đạo cảm xúc.',
  last_updated_at: '2026-03-15T10:00:00Z',
}

const mockStreak = { current_streak_weeks: 4, longest_streak_weeks: 8, total_lessons_completed: 32, last_activity_at: '2026-04-12T15:30:00Z' }

const mockCertificates = [
  { id: 'cert-001', certificate_no: 'NEDU-CERT-2025-0892', title: 'Chứng chỉ Khám Phá Bản Thân K9', course_name: 'Khám Phá Bản Thân K9', issued_at: '2025-12-15T10:00:00Z', is_locked: false, unlock_condition: null },
  { id: 'cert-002', certificate_no: null, title: 'Chứng chỉ Lãnh Đạo Cảm Xúc Mùa 12', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', issued_at: null, is_locked: true, unlock_condition: 'Hoàn thành 100% khoá học để nhận chứng chỉ' },
  { id: 'cert-003', certificate_no: null, title: 'Chứng chỉ Retreat Tĩnh Tâm', course_name: 'Retreat Tĩnh Tâm Đà Lạt', issued_at: null, is_locked: true, unlock_condition: 'Tham gia đầy đủ Retreat' },
]

// Route matcher: maps API paths to mock data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMockResponse(rawPath: string, _method: string): any {
  // Strip query string for matching
  const path = rawPath.split('?')[0]
  if (path === '/home/summary') return mockHomeSummary
  if (path === '/home/continue-learning') return mockContinueLearning
  if (path === '/enrollments') return mockEnrollments
  if (path === '/auth/me') return mockUser
  if (path === '/profile') return mockUser
  if (path === '/profile/metaphysical') return mockMetaphysical
  if (path === '/profile/streak') return mockStreak
  if (path === '/certificates') return mockCertificates
  if (path === '/payments') return mockPayments
  if (path === '/payments/pending') return mockHomeSummary.pending_payment
  if (path === '/assignments') return mockAssignments
  if (path === '/notifications') return mockNotifications
  if (path === '/schedule/events') return mockEvents
  if (path === '/notifications/preferences') return { push_enabled: true, email_enabled: true, push_schedule: true, push_assignment: true, push_payment: true }

  // Dynamic routes
  if (path.startsWith('/courses/crs-002')) return mockRetreatDetail
  if (path.match(/^\/courses\/[^/]+$/)) return mockCourseDetail
  if (path.match(/^\/courses\/[^/]+\/lessons/)) return mockLessons
  if (path.match(/^\/courses\/[^/]+\/materials/)) return mockLessonDetail.materials
  if (path.match(/^\/lessons\/[^/]+$/)) return mockLessonDetail
  if (path.match(/^\/lessons\/[^/]+\/notes/)) return { content: mockLessonDetail.notes }
  if (path.match(/^\/lessons\/[^/]+\/progress/)) return { lesson_id: 'les-007', is_completed: true, watch_percent: 80, completed_at: new Date().toISOString(), course_progress_updated: { progress_percent: 48, is_course_completed: false, certificate_unlocked: false } }
  if (path.match(/^\/payments\/[^/]+\/confirm/)) return { message: 'Confirmed', status: 'awaiting_verification' }
  if (path.match(/^\/payments\/[^/]+$/)) return mockPaymentDetail
  if (path.match(/^\/assignments\/[^/]+\/submit/)) return { id: 'sub-new', content: '', file_url: null, submitted_at: new Date().toISOString(), grade: null, feedback: null, graded_at: null }
  if (path.match(/^\/notifications\/mark-read/)) return { count: 3 }

  return null
}
