import { env } from './env'
import { useAuthStore } from '../stores/auth.store'
import { authCentralClient } from './auth-central-client'

// nedu-backend BE — domain endpoints under /api/learn/* (per NL-LEARN-API-PLAN-001).
const API_URL = env.VITE_API_URL
const ENABLE_MOCKING = env.VITE_ENABLE_MOCKING === 'true'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

async function executeFetch<T>(
  path: string,
  options: RequestOptions,
  attempt: number,
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options
  const token = useAuthStore.getState().accessToken

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/api/learn${path}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // 401 → attempt single refresh, retry once. Per memory feedback_auth_refresh_dedupe,
  // authCentralClient.refresh() dedupes concurrent callers.
  if (response.status === 401 && attempt === 0) {
    const refreshToken = useAuthStore.getState().refreshToken
    if (!refreshToken) {
      forceLogout()
      throw new Error('Unauthorized')
    }
    try {
      const refreshed = await authCentralClient.refresh(refreshToken)
      useAuthStore
        .getState()
        .setTokens(refreshed.access_token, refreshed.refresh_token)
      return executeFetch<T>(path, options, attempt + 1)
    } catch {
      forceLogout()
      throw new Error('Unauthorized')
    }
  }

  if (response.status === 401) {
    forceLogout()
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw error
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

function forceLogout(): void {
  useAuthStore.getState().clearSession()
  window.location.href = '/login'
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (ENABLE_MOCKING) {
    const { getMockResponse } = await import('../../mocks/mock-data')
    const mockData = getMockResponse(path, options.method || 'GET')
    if (mockData !== null) return mockData as T
    return undefined as T
  }
  return executeFetch<T>(path, options, 0)
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'DELETE', body }),
}
