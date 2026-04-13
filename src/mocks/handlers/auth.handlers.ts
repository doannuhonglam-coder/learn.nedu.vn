import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL || 'https://api.nedu.vn'

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

export const authHandlers = [
  http.post(`${API}/api/v1/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    if (body.email === 'test@nedu.vn' && body.password === 'password123') {
      return HttpResponse.json({
        access_token: 'mock-jwt-token-123',
        refresh_token: 'mock-refresh-token',
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        user: mockUser,
      })
    }

    return HttpResponse.json(
      { code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng', request_id: 'req-001' },
      { status: 401 },
    )
  }),

  http.post(`${API}/api/v1/auth/activate`, async ({ request }) => {
    const body = await request.json() as { token: string; password: string }

    if (body.token === 'expired') {
      return HttpResponse.json(
        { code: 'TOKEN_EXPIRED', message: 'Link đã hết hạn', request_id: 'req-002' },
        { status: 400 },
      )
    }

    return HttpResponse.json({
      access_token: 'mock-jwt-token-456',
      refresh_token: 'mock-refresh-token-2',
      expires_at: new Date(Date.now() + 3600000).toISOString(),
      user: { ...mockUser, activated_at: new Date().toISOString() },
    })
  }),

  http.post(`${API}/api/v1/auth/forgot-password`, () => {
    return HttpResponse.json({ message: 'Email sent' })
  }),

  http.get(`${API}/api/v1/auth/me`, () => {
    return HttpResponse.json(mockUser)
  }),
]
