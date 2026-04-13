import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL || 'https://api.nedu.vn'

const mockEvents = [
  {
    id: 'evt-001',
    title: 'Live Q&A: Cảm Xúc Trong Lãnh Đạo',
    event_type: 'online',
    start_time: '2026-04-15T19:00:00+07:00',
    end_time: '2026-04-15T20:30:00+07:00',
    platform: 'Zoom',
    location: null,
    course_id: 'crs-001',
    course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    instructor_name: 'Chị Nhí Lê',
    description: 'Buổi Q&A trực tuyến về chủ đề cảm xúc trong lãnh đạo.',
    meeting_url: null,
    is_joinable: false,
    join_available_in_seconds: 7200,
    ical_url: '#',
  },
  {
    id: 'evt-002',
    title: 'Retreat Tĩnh Tâm Đà Lạt',
    event_type: 'retreat',
    start_time: '2026-05-01T08:00:00+07:00',
    end_time: '2026-05-03T17:00:00+07:00',
    platform: null,
    location: 'Đà Lạt, Lâm Đồng',
    course_id: 'crs-002',
    course_name: 'Retreat Tĩnh Tâm Đà Lạt',
    instructor_name: 'Chị Nhí Lê',
    description: 'Retreat 3 ngày 2 đêm tại Đà Lạt.',
    meeting_url: null,
    is_joinable: false,
    join_available_in_seconds: null,
    ical_url: '#',
  },
  {
    id: 'evt-003',
    title: 'Workshop Offline: Hơi Thở & Năng Lượng',
    event_type: 'offline',
    start_time: '2026-04-20T09:00:00+07:00',
    end_time: '2026-04-20T12:00:00+07:00',
    platform: null,
    location: 'Nedu HQ - Q3, HCM',
    course_id: 'crs-001',
    course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    instructor_name: 'Chị Nhí Lê',
    description: 'Workshop thực hành hơi thở và quản lý năng lượng.',
    meeting_url: null,
    is_joinable: false,
    join_available_in_seconds: null,
    ical_url: '#',
  },
  {
    id: 'evt-004',
    title: 'Coaching Session #4',
    event_type: 'online',
    start_time: '2026-04-22T10:00:00+07:00',
    end_time: '2026-04-22T11:00:00+07:00',
    platform: 'Google Meet',
    location: null,
    course_id: 'crs-004',
    course_name: 'Coaching 1:1 với Chị Nhí',
    instructor_name: 'Chị Nhí Lê',
    description: 'Buổi coaching 1:1 lần 4.',
    meeting_url: null,
    is_joinable: false,
    join_available_in_seconds: null,
    ical_url: '#',
  },
  {
    id: 'evt-005',
    title: 'Live Class: Module 3 Review',
    event_type: 'online',
    start_time: '2026-04-28T19:30:00+07:00',
    end_time: '2026-04-28T21:00:00+07:00',
    platform: 'Zoom',
    location: null,
    course_id: 'crs-001',
    course_name: 'Lãnh Đạo Cảm Xúc Mùa 12',
    instructor_name: 'Chị Nhí Lê',
    description: 'Ôn tập Module 3 và chuẩn bị Module 4.',
    meeting_url: null,
    is_joinable: false,
    join_available_in_seconds: null,
    ical_url: '#',
  },
]

export const scheduleHandlers = [
  http.get(`${API}/api/v1/schedule/events`, () => {
    return HttpResponse.json(mockEvents)
  }),

  http.get(`${API}/api/v1/schedule/events/:id`, ({ params }) => {
    const event = mockEvents.find((e) => e.id === params.id)
    if (!event) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Not found', request_id: 'req-x' }, { status: 404 })
    return HttpResponse.json(event)
  }),
]
