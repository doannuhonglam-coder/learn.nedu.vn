import { http, HttpResponse } from 'msw'

// Match auth-central URLs (FE login direct, L1 D1).
// Response shapes match auth-central source — xem
// `shared/config/auth-central-client.ts` types.
const AUTH_CENTRAL =
  import.meta.env.VITE_AUTH_CENTRAL_URL || 'https://auth.nhi.sg'

const mockAuthUser = {
  id: 'identity-stu-001',
  person_id: 'person-stu-001',
  email: 'minhanh@example.com',
  full_name: 'Nguyễn Minh Anh',
  avatar_url: null,
}

function issueTokens() {
  return {
    access_token: `mock-access-${Date.now()}`,
    refresh_token: `mock-refresh-${Date.now()}`,
    token_type: 'Bearer' as const,
  }
}

export const authHandlers = [
  // POST /auth/login
  http.post(`${AUTH_CENTRAL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    if (body.email === 'test@nedu.vn' && body.password === 'password123') {
      return HttpResponse.json({
        ...issueTokens(),
        user: {
          ...mockAuthUser,
          email: 'test@nedu.vn',
          full_name: 'Học viên Test',
        },
      })
    }
    if (body.email === 'minhanh@example.com' && body.password === 'password123') {
      return HttpResponse.json({ ...issueTokens(), user: mockAuthUser })
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 },
    )
  }),

  // POST /auth/refresh — rotate
  http.post(`${AUTH_CENTRAL}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refresh_token?: string }
    if (!body.refresh_token) {
      return HttpResponse.json({ error: 'refresh_token is required' }, { status: 400 })
    }
    return HttpResponse.json(issueTokens())
  }),

  // POST /auth/logout (Bearer)
  http.post(`${AUTH_CENTRAL}/auth/logout`, async ({ request }) => {
    const auth = request.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = (await request.json().catch(() => ({}))) as {
      refresh_token?: string
      all_devices?: boolean
    }
    const scope = body.all_devices
      ? 'all_devices'
      : body.refresh_token
        ? 'family'
        : 'access_only'
    return HttpResponse.json({ revoked_count: 1, scope })
  }),

  // GET /auth/me (Bearer)
  http.get(`${AUTH_CENTRAL}/auth/me`, ({ request }) => {
    const auth = request.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({ ...mockAuthUser, methods: ['password'] })
  }),

  // POST /auth/invite/accept — activation
  http.post(`${AUTH_CENTRAL}/auth/invite/accept`, async ({ request }) => {
    const body = (await request.json()) as { token: string; password: string }

    if (body.token === 'expired') {
      return HttpResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 },
      )
    }
    if (body.token === 'used') {
      return HttpResponse.json(
        { error: 'Account đã có password. Dùng /auth/password/forgot.' },
        { status: 409 },
      )
    }
    if (body.password.length < 8) {
      return HttpResponse.json(
        { error: 'password must be at least 8 characters' },
        { status: 400 },
      )
    }

    return HttpResponse.json({
      ...issueTokens(),
      user: mockAuthUser,
    })
  }),

  // POST /auth/password/forgot — always 200 (security: don't reveal email)
  http.post(`${AUTH_CENTRAL}/auth/password/forgot`, () =>
    HttpResponse.json({
      message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi.',
    }),
  ),

  // POST /auth/password/reset
  http.post(`${AUTH_CENTRAL}/auth/password/reset`, async ({ request }) => {
    const body = (await request.json()) as { token: string; password: string }
    if (body.token === 'expired' || !body.token) {
      return HttpResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 },
      )
    }
    if (body.password.length < 8) {
      return HttpResponse.json(
        { error: 'password must be at least 8 characters' },
        { status: 400 },
      )
    }
    return HttpResponse.json({ message: 'Mật khẩu đã được đặt lại thành công.' })
  }),
]
