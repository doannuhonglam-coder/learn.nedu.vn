import { http, HttpResponse } from 'msw'

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

// /api/learn/me — mock minimal cho ProfilePage hydration trong mock mode.
const mockMe = {
  user_id: 'usr-001',
  email: 'minhanh@example.com',
  full_name: 'Nguyễn Minh Anh',
  avatar_url: null,
  roles: ['learner'],
  learner_state: {
    student_code: 'NEDU-2026-001234',
    consultant_name: 'Chị Nhí',
    activated_at: '2026-01-15T10:00:00Z',
    streak_current_weeks: 4,
    streak_longest_weeks: 8,
    last_lesson_completed_at: '2026-04-12T15:30:00Z',
    noi_status: 'active',
  },
}

export const profileHandlers = [
  http.get(`*/api/learn/me`, () => {
    return HttpResponse.json(mockMe)
  }),

  http.get(`*/api/learn/profile/metaphysical`, () => {
    return HttpResponse.json(mockMetaphysical)
  }),
]
