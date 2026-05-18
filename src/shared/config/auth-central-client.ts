// auth-central direct client (L1 D1 — FE login direct, KHÔNG qua nedu-backend).
//
// Endpoints map (per NL-LEARN-API-PLAN-001 §Track-A Auth):
//   POST  /auth/login                  email + password → { tokens, user }
//   POST  /auth/refresh                rotate refresh token (dedupe singleton)
//   POST  /auth/logout                 revoke refresh family (Bearer)
//   GET   /auth/me                     current user (Bearer)
//   POST  /auth/invite/accept          activation: token + password → { tokens, user, auto-login }
//   POST  /auth/password/forgot        send reset email
//   POST  /auth/password/reset         consume reset token

import { env } from './env'

const BASE_URL = env.VITE_AUTH_CENTRAL_URL

// ── Response shapes match auth-central source ──────────────────
export interface AuthUser {
  id: string
  person_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
}

export type LoginResult = AuthTokens & { user: AuthUser }
export type RefreshResult = AuthTokens

export interface AuthCentralError {
  status: number
  error: string
  message?: string
  retry_after?: string
}

// ── Generic request wrapper ────────────────────────────────────
async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
    const err: AuthCentralError = {
      status: response.status,
      error: typeof body.error === 'string' ? body.error : 'request_failed',
      message: typeof body.message === 'string' ? body.message : undefined,
      retry_after: typeof body.retry_after === 'string' ? body.retry_after : undefined,
    }
    throw err
  }

  return response.json() as Promise<T>
}

// ── Singleton refresh dedupe ───────────────────────────────────
// Memory feedback_auth_refresh_dedupe: concurrent 401 → all parallel calls
// share 1 in-flight refresh promise → 1 actual call → no "đá user ra login"
// khi rotate-and-revoke landed mid-flight.
let inflightRefresh: Promise<RefreshResult> | null = null

async function doRefresh(refreshToken: string): Promise<RefreshResult> {
  return request<RefreshResult>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
}

// ── Public API ─────────────────────────────────────────────────
export const authCentralClient = {
  /** Email + password login → tokens + user. */
  login: (email: string, password: string) =>
    request<LoginResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /**
   * Rotate refresh token. Dedupe singleton — multiple concurrent callers
   * share the same in-flight promise.
   */
  refresh: (refreshToken: string): Promise<RefreshResult> => {
    if (inflightRefresh) return inflightRefresh
    inflightRefresh = doRefresh(refreshToken).finally(() => {
      inflightRefresh = null
    })
    return inflightRefresh
  },

  /**
   * Logout. Modes:
   *   - { refresh_token } → revoke ENTIRE family (chain)
   *   - { all_devices: true } → revoke ALL families
   *   - {} → access_only (token tự expire 15min)
   */
  logout: (
    accessToken: string,
    options?: { refresh_token?: string; all_devices?: boolean },
  ) =>
    request<{ revoked_count: number; scope: 'family' | 'all_devices' | 'access_only' }>(
      '/auth/logout',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(options ?? {}),
      },
    ),

  /** Current user + linked auth methods. Bearer required. */
  me: (accessToken: string) =>
    request<AuthUser & { methods: string[] }>('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /**
   * Activation: học viên click email link → POST với token + password.
   * Auth-central tạo password method + auto-login → return tokens + user.
   * (Endpoint thật trên auth-central là /auth/invite/accept.)
   */
  activate: (token: string, password: string) =>
    request<LoginResult>('/auth/invite/accept', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  /** Send password reset email. Always returns 200 (không reveal email tồn tại). */
  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/password/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /** Consume reset token → set new password. */
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
}
