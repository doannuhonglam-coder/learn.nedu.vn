import { http, HttpResponse } from 'msw'

const mockNotifications = [
  {
    id: 'notif-002',
    type: 'assignment',
    icon: '📝',
    title: 'Bài tập sắp hết hạn',
    body: 'Nhật ký cảm xúc tuần 3 - Hạn nộp: 16/04. Chỉ còn 3 ngày!',
    created_at: '2026-04-13T07:00:00+07:00',
    is_read: false,
    action_url: null,
  },
  {
    id: 'notif-003',
    type: 'schedule',
    icon: '📅',
    title: 'Lịch học ngày mai',
    body: 'Live Q&A: Cảm Xúc Trong Lãnh Đạo - 19:00 ngày 15/04 trên Zoom.',
    created_at: '2026-04-14T08:00:00+07:00',
    is_read: false,
    action_url: '/schedule',
  },
  {
    id: 'notif-004',
    type: 'certificate',
    icon: '🎓',
    title: 'Chứng chỉ đã sẵn sàng',
    body: 'Chúc mừng! Chứng chỉ khoá Khám Phá Bản Thân K9 đã được cấp.',
    created_at: '2026-04-10T10:00:00+07:00',
    is_read: true,
    action_url: null,
  },
  {
    id: 'notif-005',
    type: 'system',
    icon: '🔔',
    title: 'Cập nhật hệ thống',
    body: 'Nedu Learn đã cập nhật phiên bản mới với nhiều cải tiến.',
    created_at: '2026-04-08T12:00:00+07:00',
    is_read: true,
    action_url: null,
  },
]

export const notificationsHandlers = [
  http.get(`*/api/learn/notifications`, () => {
    return HttpResponse.json({
      items: mockNotifications,
      unread_count: mockNotifications.filter((n) => !n.is_read).length,
    })
  }),

  http.post(`*/api/learn/notifications/mark-read`, () => {
    return HttpResponse.json({ count: 3 })
  }),

  http.get(`*/api/learn/notifications/preferences`, () => {
    return HttpResponse.json({
      push_enabled: true,
      email_enabled: true,
      push_schedule: true,
      push_assignment: true,
      push_payment: true,
    })
  }),

  http.patch(`*/api/learn/notifications/preferences`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(body)
  }),
]
