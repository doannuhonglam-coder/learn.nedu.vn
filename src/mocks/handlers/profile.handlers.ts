import { http, HttpResponse } from 'msw'

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

// 5-system vault facets — opaque jsonb passthrough match BE
// /api/learn/profile/metaphysical contract. Mock với 4/5 facets có sẵn
// + 1 chưa compute (tu_vi) để FE test "đang phân tích" state per-facet.
const mockMetaphysical = {
  user_id: 'usr-001',
  facets: {
    bazi: {
      day_master: 'Nhâm Thân',
      element: 'Thủy',
      pillars: { year: 'Giáp Tý', month: 'Bính Dần', day: 'Nhâm Thân', hour: 'Canh Tuất' },
    },
    nine_star_ki: {
      main_star: 7,
      star_name: 'Sao 7 Kim',
      energy_pattern: 'Kim — Thu hoạch & Hoàn thiện',
    },
    tu_vi: null,
    numerology: {
      life_path: 7,
      expression: 5,
      soul_urge: 3,
    },
    western_astrology: {
      sun: 'Capricorn',
      moon: 'Cancer',
      rising: 'Virgo',
    },
  },
  cached_at: '2026-03-15T10:00:00Z',
  is_stale: false,
  is_available: true,
}

const mockStreak = {
  current_streak_weeks: 4,
  longest_streak_weeks: 8,
  total_lessons_completed: 32,
  last_activity_at: '2026-04-12T15:30:00Z',
}

export const profileHandlers = [
  http.get(`*/api/learn/profile`, () => {
    return HttpResponse.json(mockProfile)
  }),

  http.get(`*/api/learn/profile/metaphysical`, () => {
    return HttpResponse.json(mockMetaphysical)
  }),

  http.get(`*/api/learn/profile/streak`, () => {
    return HttpResponse.json(mockStreak)
  }),

  http.get(`*/api/learn/profile/metaphysical/pdf`, () => {
    return new HttpResponse(null, { status: 200, headers: { 'Content-Type': 'application/pdf' } })
  }),
]
