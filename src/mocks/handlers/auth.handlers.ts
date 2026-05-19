import { http, HttpResponse } from 'msw'

// Match auth-central URLs (FE login direct, L1 D1).
// Phase 1: Google OAuth only — KHÔNG còn password/invite/forgot endpoints.
// Mock dev: LoginPage gọi /auth/mock-login (same-origin) thay vì redirect ra
// external Google URL — browser không cho MSW intercept window.location.
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
  // POST /auth/mock-login — same-origin fake login cho dev (KHÔNG có ở
  // auth-central thật). Trả tokens + user trực tiếp.
  http.post('/auth/mock-login', () =>
    HttpResponse.json({ ...issueTokens(), user: mockAuthUser }),
  ),

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
    return HttpResponse.json({ ...mockAuthUser, methods: ['google'] })
  }),
]
