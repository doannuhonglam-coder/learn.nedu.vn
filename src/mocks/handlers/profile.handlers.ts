import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL || 'https://api.nedu.vn'

const mockProfile = {
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

const mockMetaphysical = {
  student_id: 'stu-001',
  bazi: {
    day_master: 'Nhâm Thân',
    element: 'Thủy',
    summary: 'Bạn mang mệnh Thủy — linh hoạt, thông minh, giỏi giao tiếp. Nhâm Thân thể hiện nguồn nước lớn, mạnh mẽ và bao dung. Bạn có khả năng thích ứng cao và tư duy sáng tạo.',
    pillars: { year: 'Giáp Tý', month: 'Bính Dần', day: 'Nhâm Thân', hour: 'Canh Tuất' },
  },
  nine_star_ki: {
    main_star: 7,
    star_name: 'Sao 7 Kim',
    energy_pattern: 'Kim — Thu hoạch & Hoàn thiện',
    summary: 'Sao 7 Kim đại diện cho năng lượng thu hoạch, sự tinh tế và khả năng thưởng thức. Bạn có gu thẩm mỹ cao, thích sự hoàn hảo và có khiếu giao tiếp.',
  },
  numerology: {
    life_path: 7,
    expression: 5,
    soul_urge: 3,
    summary: 'Life Path 7 — Con đường của người tìm kiếm chân lý. Bạn có tư duy phân tích sâu, trực giác mạnh và khao khát hiểu biết. Số 7 thúc đẩy bạn đi sâu vào bên trong.',
  },
  mbti: {
    type: 'INFJ',
    summary: 'INFJ — Nhà tư vấn. Bạn có trực giác mạnh, lý tưởng và quan tâm sâu sắc đến người khác. Sự kết hợp giữa tầm nhìn xa và khả năng thấu hiểu cảm xúc.',
  },
  enneagram: {
    type: '4',
    wing: '5',
    summary: 'Enneagram 4w5 — Nghệ sĩ tư duy. Bạn tìm kiếm bản sắc riêng, sáng tạo và có chiều sâu cảm xúc. Cánh 5 bổ sung khả năng phân tích và nghiên cứu.',
  },
  recommended_path_note: 'Minh Anh nên tập trung phát triển kỹ năng lãnh đạo cảm xúc kết hợp với trực giác mạnh. Khoá LCM rất phù hợp với hồ sơ BaZi mệnh Thủy và Sao 7 Kim.',
  last_updated_at: '2026-03-15T10:00:00Z',
}

const mockStreak = {
  current_streak_weeks: 4,
  longest_streak_weeks: 8,
  total_lessons_completed: 32,
  last_activity_at: '2026-04-12T15:30:00Z',
}

export const profileHandlers = [
  http.get(`${API}/api/v1/profile`, () => {
    return HttpResponse.json(mockProfile)
  }),

  http.get(`${API}/api/v1/profile/metaphysical`, () => {
    return HttpResponse.json(mockMetaphysical)
  }),

  http.get(`${API}/api/v1/profile/streak`, () => {
    return HttpResponse.json(mockStreak)
  }),

  http.get(`${API}/api/v1/profile/metaphysical/pdf`, () => {
    return new HttpResponse(null, { status: 200, headers: { 'Content-Type': 'application/pdf' } })
  }),
]
