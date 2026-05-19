import { http, HttpResponse } from 'msw'

// Mock challenge daily missions — match BE /api/learn/missions DTO.
// 7-day challenge, currently day 3 unlocked. Day 1 = submitted+reviewed,
// day 2 = submitted no review, day 3 = unlocked not_submitted, day 4-7 locked.
const now = Date.now()
const anchorMs = now - 3 * 24 * 60 * 60 * 1000 // 3 days ago
const dayMs = (offset: number, hours = 0) =>
  new Date(anchorMs + offset * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000).toISOString()

const buildMission = (
  dayNumber: number,
  status:
    | 'reviewed'
    | 'submitted'
    | 'not_submitted'
    | 'locked'
    | 'overdue',
) => {
  const isLocked = status === 'locked'
  const isOverdue = status === 'overdue'
  const hasSubmission = status === 'submitted' || status === 'reviewed'
  return {
    id: `ms-day-${dayNumber}`,
    course_run_id: 'crsrun-challenge-2026',
    course_id: 'crs-challenge-bietern',
    course_name: 'Thử thách Biết Ơn 7 ngày',
    course_slug: 'biet-on-7-ngay',
    day_number: dayNumber,
    title: isLocked ? `Ngày ${dayNumber}` : `Ngày ${dayNumber}: Nhật ký biết ơn`,
    description: isLocked ? null : 'Viết 3 điều bạn biết ơn hôm nay + lý do.',
    video_provider: isLocked ? null : 'cloudflare_stream',
    video_ref: isLocked ? null : 'cf-stream-mock-id',
    task_description: isLocked
      ? null
      : 'Submit reflection 100-300 từ + hình minh hoạ (optional).',
    unlock_at: dayMs(dayNumber - 1),
    deadline_at: dayMs(dayNumber - 1, 24),
    is_locked: isLocked,
    is_overdue: isOverdue,
    status,
    submission: hasSubmission
      ? {
          id: `sub-day-${dayNumber}`,
          content: 'Hôm nay tôi biết ơn 3 điều: 1) Sức khoẻ, 2) Gia đình, 3) Cơ hội học tập.',
          file_url: null,
          submitted_at: dayMs(dayNumber - 1, 10),
          review_text:
            status === 'reviewed'
              ? 'Cảm xúc chân thật, chi tiết tốt. Cố gắng đào sâu lý do tại sao biết ơn.'
              : null,
          rating: status === 'reviewed' ? 4 : null,
          reviewed_at: status === 'reviewed' ? dayMs(dayNumber - 1, 14) : null,
        }
      : null,
  }
}

const mockMissions = [
  buildMission(1, 'reviewed'),
  buildMission(2, 'submitted'),
  buildMission(3, 'not_submitted'),
  buildMission(4, 'locked'),
  buildMission(5, 'locked'),
  buildMission(6, 'locked'),
  buildMission(7, 'locked'),
]

export const missionsHandlers = [
  http.get(`*/api/learn/missions`, () => {
    return HttpResponse.json(mockMissions)
  }),

  http.get(`*/api/learn/missions/:id`, ({ params }) => {
    const mission = mockMissions.find((m) => m.id === params.id)
    if (!mission) {
      return HttpResponse.json(
        { message: 'Mission not found' },
        { status: 404 },
      )
    }
    return HttpResponse.json(mission)
  }),

  http.post(`*/api/learn/missions/:id/submit`, async ({ params, request }) => {
    const mission = mockMissions.find((m) => m.id === params.id)
    if (!mission) {
      return HttpResponse.json(
        { message: 'Mission not found' },
        { status: 404 },
      )
    }
    if (mission.is_locked) {
      return HttpResponse.json(
        { message: 'Mission chưa mở khoá' },
        { status: 400 },
      )
    }
    const body = (await request.json()) as { content?: string; file_url?: string }
    return HttpResponse.json({
      ...mission,
      status: 'submitted' as const,
      submission: {
        id: `sub-day-${mission.day_number}-new`,
        content: body.content ?? '',
        file_url: null,
        submitted_at: new Date().toISOString(),
        review_text: null,
        rating: null,
        reviewed_at: null,
      },
    })
  }),
]
