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
  stats: { active_courses: 4, completion_percent: 42, certificates_count: 1 },
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
    { id: 'crs-001', name: 'Lãnh Đạo Cảm Xúc Mùa 12', slug: 'lcm-12', course_type: 'cohort', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: '2026-03-01', cohort_end_date: '2026-06-01', coaching_sessions_completed: null, coaching_sessions_total: null, current_module: 3, total_modules: 8, metaphysical_match_score: 85 },
    { id: 'crs-002', name: 'Retreat Tĩnh Tâm Đà Lạt', slug: 'retreat-dalat-2026', course_type: 'retreat', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: '2026-05-01', retreat_end_date: '2026-05-03', retreat_countdown_seconds: 1555200, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, current_module: null, total_modules: null, metaphysical_match_score: null },
    { id: 'crs-003', name: 'Con Số & Cuộc Bạn', slug: 'cscb-on-demand', course_type: 'on_demand', status: 'published', instructor_name: 'Thầy Minh', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, current_module: 4, total_modules: 11, metaphysical_match_score: null },
  ],
}

const mockContinueLearning = {
  enrollment_id: 'enr-001', course_id: 'crs-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
  course_type: 'cohort', instructor_name: 'Chị Nhí Lê', current_module: 'Module 3: Cảm Xúc & Giao Tiếp',
  progress_percent: 42, next_lesson: { id: 'les-007', title: 'Bài 7: Lắng nghe chủ động' },
}

const mockEnrollments = [
  { id: 'enr-001', course: { id: 'crs-001', name: 'Lãnh Đạo Cảm Xúc Mùa 12', slug: 'lcm-12', course_type: 'cohort', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: '2026-03-01', cohort_end_date: '2026-06-01', coaching_sessions_completed: null, coaching_sessions_total: null, current_module: 3, total_modules: 8, metaphysical_match_score: 85 }, status: 'active', payment_status: 'partial', progress_percent: 42, enrolled_at: '2026-03-01T00:00:00Z', expired_at: null },
  { id: 'enr-002', course: { id: 'crs-002', name: 'Retreat Tĩnh Tâm Đà Lạt', slug: 'retreat-dalat-2026', course_type: 'retreat', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: '2026-05-01', retreat_end_date: '2026-05-03', retreat_countdown_seconds: 1555200, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, current_module: null, total_modules: null, metaphysical_match_score: null }, status: 'active', payment_status: 'paid', progress_percent: 0, enrolled_at: '2026-02-15T00:00:00Z', expired_at: null },
  { id: 'enr-003', course: { id: 'crs-003', name: 'Con Số & Cuộc Bạn', slug: 'cscb-on-demand', course_type: 'on_demand', status: 'published', instructor_name: 'Thầy Minh', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, current_module: 7, total_modules: 11, metaphysical_match_score: null }, status: 'active', payment_status: 'paid', progress_percent: 65, enrolled_at: '2026-01-20T00:00:00Z', expired_at: null },
  { id: 'enr-004', course: { id: 'crs-004', name: 'Coaching 1:1 với Chị Nhí', slug: 'coaching-nhi-2026', course_type: 'coaching', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: 3, coaching_sessions_total: 8, current_module: null, total_modules: null, metaphysical_match_score: null }, status: 'active', payment_status: 'paid', progress_percent: 37, enrolled_at: '2026-02-01T00:00:00Z', expired_at: null },
  { id: 'enr-005', course: { id: 'crs-005', name: 'Khám Phá Bản Thân K9', slug: 'kpbt-k9', course_type: 'cohort', status: 'published', instructor_name: 'Thầy Minh', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: '2025-09-01', cohort_end_date: '2025-12-01', coaching_sessions_completed: null, coaching_sessions_total: null, current_module: 8, total_modules: 8, metaphysical_match_score: null }, status: 'completed', payment_status: 'paid', progress_percent: 100, enrolled_at: '2025-09-01T00:00:00Z', expired_at: null },
]

const mockCourseDetail = {
  id: 'crs-001', name: 'Lãnh Đạo Cảm Xúc Mùa 12', slug: 'lcm-12', course_type: 'cohort', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: '2026-03-01', cohort_end_date: '2026-06-01', coaching_sessions_completed: null, coaching_sessions_total: null, current_module: 3, total_modules: 8, metaphysical_match_score: 85,
  description: 'Khoá học giúp bạn hiểu và làm chủ cảm xúc trong vai trò lãnh đạo. Qua 8 module và 32 bài học, bạn sẽ phát triển khả năng nhận diện, điều chỉnh và sử dụng cảm xúc hiệu quả.',
  program: { id: 'prg-001', name: 'LCM' },
  modules: [
    { id: 'mod-001', title: 'Module 1: Nhận Diện Cảm Xúc', order_index: 1, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-002', title: 'Module 2: Hiểu Về Bản Thân', order_index: 2, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-003', title: 'Module 3: Cảm Xúc & Giao Tiếp', order_index: 3, lessons_count: 4, lessons_completed: 2, is_locked: false },
    { id: 'mod-004', title: 'Module 4: Lãnh Đạo Bằng Trái Tim', order_index: 4, lessons_count: 4, lessons_completed: 0, is_locked: true },
  ],
  retreat_location: null, retreat_prep_checklist: null, retreat_schedule: null,
}

const mockOnDemandDetail = {
  id: 'crs-003', name: 'Con Số & Cuộc Bạn', slug: 'cscb-on-demand', course_type: 'on_demand', status: 'published', instructor_name: 'Thầy Minh', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: null, coaching_sessions_total: null, current_module: 7, total_modules: 11, metaphysical_match_score: null,
  description: 'Khoá học tự học về Numerology — khám phá ý nghĩa các con số trong cuộc đời bạn. Học theo nhịp riêng, không có deadline cohort.',
  program: { id: 'prg-002', name: 'Self-Discovery' },
  modules: [
    { id: 'mod-cs-01', title: 'Module 1: Giới thiệu Numerology', order_index: 1, lessons_count: 3, lessons_completed: 3, is_locked: false },
    { id: 'mod-cs-02', title: 'Module 2: Life Path Number', order_index: 2, lessons_count: 3, lessons_completed: 3, is_locked: false },
    { id: 'mod-cs-03', title: 'Module 3: Expression Number', order_index: 3, lessons_count: 3, lessons_completed: 3, is_locked: false },
    { id: 'mod-cs-04', title: 'Module 4: Soul Urge Number', order_index: 4, lessons_count: 3, lessons_completed: 3, is_locked: false },
    { id: 'mod-cs-05', title: 'Module 5: Personality Number', order_index: 5, lessons_count: 3, lessons_completed: 3, is_locked: false },
    { id: 'mod-cs-06', title: 'Module 6: Personal Year', order_index: 6, lessons_count: 3, lessons_completed: 3, is_locked: false },
    { id: 'mod-cs-07', title: 'Module 7: Master Numbers (11, 22, 33)', order_index: 7, lessons_count: 3, lessons_completed: 1, is_locked: false },
    { id: 'mod-cs-08', title: 'Module 8: Numerology trong Sự Nghiệp', order_index: 8, lessons_count: 3, lessons_completed: 0, is_locked: false },
    { id: 'mod-cs-09', title: 'Module 9: Numerology trong Tình Yêu', order_index: 9, lessons_count: 3, lessons_completed: 0, is_locked: false },
    { id: 'mod-cs-10', title: 'Module 10: Phân Tích Hồ Sơ Hoàn Chỉnh', order_index: 10, lessons_count: 4, lessons_completed: 0, is_locked: false },
    { id: 'mod-cs-11', title: 'Module 11: Bài kiểm tra cuối khoá', order_index: 11, lessons_count: 1, lessons_completed: 0, is_locked: false },
  ],
  retreat_location: null, retreat_prep_checklist: null, retreat_schedule: null,
}

const mockCoachingDetail = {
  id: 'crs-004', name: 'Coaching 1:1 với Chị Nhí', slug: 'coaching-nhi-2026', course_type: 'coaching', status: 'published', instructor_name: 'Chị Nhí Lê', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: null, cohort_end_date: null, coaching_sessions_completed: 3, coaching_sessions_total: 8, current_module: null, total_modules: null, metaphysical_match_score: null,
  description: 'Gói coaching 1:1 cá nhân hoá 8 buổi với Chị Nhí Lê. Mỗi buổi 90 phút qua Google Meet, được thiết kế riêng theo mục tiêu và pace của bạn.',
  program: { id: 'prg-coach', name: 'Premium Coaching' },
  modules: [],
  retreat_location: null, retreat_prep_checklist: null, retreat_schedule: null,
}

const mockCompletedCohortDetail = {
  id: 'crs-005', name: 'Khám Phá Bản Thân K9', slug: 'kpbt-k9', course_type: 'cohort', status: 'published', instructor_name: 'Thầy Minh', thumbnail_url: null, retreat_date: null, retreat_end_date: null, retreat_countdown_seconds: null, cohort_start_date: '2025-09-01', cohort_end_date: '2025-12-01', coaching_sessions_completed: null, coaching_sessions_total: null, current_module: 8, total_modules: 8, metaphysical_match_score: null,
  description: 'Khoá học cohort K9 đã hoàn thành — bạn đã tốt nghiệp xuất sắc với điểm số 9.2/10. Chứng chỉ đã được cấp.',
  program: { id: 'prg-kpbt', name: 'Khám Phá Bản Thân' },
  modules: [
    { id: 'mod-k9-01', title: 'Module 1: Khởi Đầu Hành Trình', order_index: 1, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-k9-02', title: 'Module 2: Giá Trị Cốt Lõi', order_index: 2, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-k9-03', title: 'Module 3: Điểm Mạnh Bản Thân', order_index: 3, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-k9-04', title: 'Module 4: Vùng Bóng Tối', order_index: 4, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-k9-05', title: 'Module 5: Tầm Nhìn Cuộc Đời', order_index: 5, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-k9-06', title: 'Module 6: Kế Hoạch Hành Động', order_index: 6, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-k9-07', title: 'Module 7: Thực Hành 21 Ngày', order_index: 7, lessons_count: 4, lessons_completed: 4, is_locked: false },
    { id: 'mod-k9-08', title: 'Module 8: Bảo Vệ Đồ Án', order_index: 8, lessons_count: 4, lessons_completed: 4, is_locked: false },
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

const mockLessonsOnDemand = [
  { id: 'les-cs-01', title: 'Giới thiệu Numerology', order_index: 1, duration_minutes: 12, is_preview: true, is_locked: false, is_completed: true, completed_at: '2026-01-20T10:00:00Z', unlock_condition: null },
  { id: 'les-cs-02', title: 'Lịch sử các con số', order_index: 2, duration_minutes: 18, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-01-22T10:00:00Z', unlock_condition: null },
  { id: 'les-cs-03', title: 'Tính Life Path Number', order_index: 3, duration_minutes: 22, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-01-25T10:00:00Z', unlock_condition: null },
  { id: 'les-cs-04', title: 'Ý nghĩa Life Path 1-9', order_index: 4, duration_minutes: 28, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-02-01T10:00:00Z', unlock_condition: null },
  { id: 'les-cs-05', title: 'Tính Expression Number', order_index: 5, duration_minutes: 20, is_preview: false, is_locked: false, is_completed: true, completed_at: '2026-02-10T10:00:00Z', unlock_condition: null },
  { id: 'les-cs-06', title: 'Master Numbers 11-22-33', order_index: 6, duration_minutes: 32, is_preview: false, is_locked: false, is_completed: false, completed_at: null, unlock_condition: null },
  { id: 'les-cs-07', title: 'Phân tích Numerology trong sự nghiệp', order_index: 7, duration_minutes: 26, is_preview: false, is_locked: false, is_completed: false, completed_at: null, unlock_condition: null },
  { id: 'les-cs-08', title: 'Bài kiểm tra cuối khoá', order_index: 8, duration_minutes: 45, is_preview: false, is_locked: true, is_completed: false, completed_at: null, unlock_condition: 'Hoàn thành tất cả bài học' },
]

const mockLessonsCompleted = [
  { id: 'les-k9-01', title: 'Bài 1: Khởi đầu hành trình', order_index: 1, duration_minutes: 30, is_preview: false, is_locked: false, is_completed: true, completed_at: '2025-09-05T10:00:00Z', unlock_condition: null },
  { id: 'les-k9-02', title: 'Bài 2: Tự đánh giá ban đầu', order_index: 2, duration_minutes: 25, is_preview: false, is_locked: false, is_completed: true, completed_at: '2025-09-12T10:00:00Z', unlock_condition: null },
  { id: 'les-k9-03', title: 'Bài 3: Khám phá giá trị cốt lõi', order_index: 3, duration_minutes: 35, is_preview: false, is_locked: false, is_completed: true, completed_at: '2025-09-19T10:00:00Z', unlock_condition: null },
  { id: 'les-k9-04', title: 'Bài 4: Bảo vệ đồ án cuối', order_index: 4, duration_minutes: 40, is_preview: false, is_locked: false, is_completed: true, completed_at: '2025-11-28T10:00:00Z', unlock_condition: null },
]

const mockCourseDetails: Record<string, typeof mockCourseDetail> = {
  'crs-001': mockCourseDetail,
  'crs-002': mockRetreatDetail as never,
  'crs-003': mockOnDemandDetail as never,
  'crs-004': mockCoachingDetail as never,
  'crs-005': mockCompletedCohortDetail as never,
}

const mockCourseLessons: Record<string, typeof mockLessons> = {
  'crs-001': mockLessons,
  'crs-002': [],
  'crs-003': mockLessonsOnDemand,
  'crs-004': [],
  'crs-005': mockLessonsCompleted,
}

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

// Generate dynamic event dates so demo shows all 5 status states
const __now = Date.now()
const __atOffset = (offsetMs: number, durationMin: number) => ({
  start_time: new Date(__now + offsetMs).toISOString(),
  end_time: new Date(__now + offsetMs + durationMin * 60_000).toISOString(),
})

const mockEvents = [
  // LIVE — started 30 min ago, still running for 1h
  {
    id: 'evt-001', title: 'Live Class · Thiết Kế Bản Thân', event_type: 'online',
    ...__atOffset(-30 * 60_000, 120),
    platform: 'Zoom', location: null,
    course_id: 'crs-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', instructor_name: 'Chị Nhí Lê',
    description: 'Quản lý cảm xúc trong gia đình — buổi học live với case study từ học viên K12.',
    meeting_url: 'https://zoom.us/j/123456789',
    is_joinable: true, join_available_in_seconds: 0, ical_url: '#',
    module_title: 'Cohort K12 · Buổi 6/12',
    agenda: ['Ôn tập kỹ năng lắng nghe chủ động', 'Phân tích case study', 'Q&A bài tập tuần 3', 'Hướng dẫn module 4'],
    prep_items: ['Hoàn thành Bài 6: Shadow work', 'Xem slide chương 3', 'Chuẩn bị 1 câu hỏi'],
    meeting_id: '123 4567 8901', meeting_passcode: 'NEDU2026',
    will_be_recorded: true, recording_url: null,
  },
  // SOON — starts in 28 min
  {
    id: 'evt-002', title: '1:1 Coaching · Buổi 4 với Nhi Lê', event_type: 'online',
    ...__atOffset(28 * 60_000, 90),
    platform: 'Google Meet', location: null,
    course_id: 'crs-004', course_name: 'Coaching 1:1 với Chị Nhí', instructor_name: 'Chị Nhí Lê',
    description: 'Buổi coaching 1:1 chuẩn bị tâm thế muốn thảo luận. Đọc lại ghi chú buổi 3 trước khi vào.',
    meeting_url: 'https://meet.google.com/abc-defg-hij',
    is_joinable: false, join_available_in_seconds: 1680, ical_url: '#',
    module_title: 'Coaching · Buổi 4/6',
    agenda: ['Review homework buổi 3', 'Xác định pattern mới', 'Kế hoạch hành động 2 tuần', 'Đặt mục tiêu buổi 5'],
    prep_items: ['Bài đọc · 5 câu hỏi tự vấn (8 trang PDF · chưa mở)', 'Ghi 3 trigger cảm xúc tuần qua'],
    meeting_id: 'abc-defg-hij', meeting_passcode: null,
    will_be_recorded: true, recording_url: null,
  },
  // DONE — ended 2h ago, recording available
  {
    id: 'evt-003', title: 'Live Class · Thiết Kế Bản Thân', event_type: 'online',
    ...__atOffset(-4 * 3600_000, 120),
    platform: 'Zoom', location: null,
    course_id: 'crs-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', instructor_name: 'Chị Nhí Lê',
    description: 'Buổi học đã hoàn thành. Recording + slide đã sẵn sàng để xem lại.',
    meeting_url: 'https://zoom.us/j/111222333',
    is_joinable: false, join_available_in_seconds: null, ical_url: '#',
    module_title: 'Cohort K12 · Buổi 5/12',
    agenda: ['Recap 4 bài học chính', 'Live demo', 'Thảo luận nhóm'],
    prep_items: [],
    meeting_id: '111 222 333', meeting_passcode: null,
    will_be_recorded: true, recording_url: 'https://zoom.us/rec/play/abc',
  },
  // FUTURE — starts in 5 days (gắn vào Retreat Tĩnh Tâm — workshop chuẩn bị tinh thần)
  {
    id: 'evt-004', title: 'Workshop Chánh Niệm · 3 ngày', event_type: 'offline',
    ...__atOffset(5 * 86_400_000, 180),
    platform: null, location: 'Q3 TPHCM · 45 Nguyễn Đình Chiểu',
    course_id: 'crs-002', course_name: 'Retreat Tĩnh Tâm Đà Lạt', instructor_name: 'Hoài An',
    description: 'Workshop nội trú 3 ngày tại trung tâm thiền Q3 — chuẩn bị tâm thế trước khi đi Retreat Đà Lạt. Mang trang phục thoải mái, nước uống, và nhật ký cá nhân.',
    meeting_url: null, is_joinable: false, join_available_in_seconds: null, ical_url: '#',
    module_title: 'Pre-Retreat Workshop',
    agenda: ['Day 1: Hơi thở chánh niệm', 'Day 2: Body scan', 'Day 3: Tích hợp & cam kết'],
    prep_items: ['Mặc quần áo thoải mái', 'Mang chai nước cá nhân', 'Đến trước 15 phút check-in', 'Nhật ký cá nhân'],
    meeting_id: null, meeting_passcode: null,
    will_be_recorded: false, recording_url: null,
  },
  // MISSED — ended 3 days ago, no recording
  {
    id: 'evt-005', title: 'Live Class cuối · Bảo vệ đồ án', event_type: 'online',
    ...__atOffset(-3 * 86_400_000, 120),
    platform: 'Zoom', location: null,
    course_id: 'crs-001', course_name: 'Lãnh Đạo Cảm Xúc Mùa 12', instructor_name: 'Chị Nhí Lê',
    description: 'Buổi cuối khoá — bạn không tham gia được. Recording chưa sẵn sàng, hãy theo dõi thông báo.',
    meeting_url: 'https://zoom.us/j/444555666',
    is_joinable: false, join_available_in_seconds: null, ical_url: '#',
    module_title: 'Cohort K12 · Buổi 4/12 · Bạn không tham gia',
    agenda: ['Bảo vệ đồ án nhóm', 'Feedback từ Chị Nhí', 'Lễ tốt nghiệp Cohort'],
    prep_items: [],
    meeting_id: '444 555 666', meeting_passcode: null,
    will_be_recorded: true, recording_url: null,
  },
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
  if (path === '/auth/login') return {
    access_token: 'mock-jwt-token-123',
    refresh_token: 'mock-refresh-token',
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    user: mockUser,
  }
  if (path === '/auth/activate') return {
    access_token: 'mock-jwt-token-456',
    refresh_token: 'mock-refresh-token-2',
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    user: { ...mockUser, activated_at: new Date().toISOString() },
  }
  if (path === '/auth/forgot-password') return { message: 'Email sent' }
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
  {
    const courseDetailMatch = path.match(/^\/courses\/([^/]+)$/)
    if (courseDetailMatch) {
      return mockCourseDetails[courseDetailMatch[1]] || mockCourseDetail
    }
    const lessonsMatch = path.match(/^\/courses\/([^/]+)\/lessons/)
    if (lessonsMatch) {
      return mockCourseLessons[lessonsMatch[1]] || []
    }
  }
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
