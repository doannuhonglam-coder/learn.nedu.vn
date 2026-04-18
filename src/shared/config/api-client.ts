import { useAuthStore } from '../stores/auth.store'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.nedu.vn'

// Until real backend is ready, always use static mock data.
// When backend is live, remove this fallback (or guard with env flag).
const USE_STATIC_MOCK = true

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (USE_STATIC_MOCK) {
    const { getMockResponse } = await import('../../mocks/mock-data')
    const mockData = getMockResponse(path, options.method || 'GET')
    if (mockData !== null) return mockData as T
    return undefined as T
  }

  const { body, headers: customHeaders, ...rest } = options
  const token = useAuthStore.getState().accessToken

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders as Record<string, string>,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    useAuthStore.getState().clearSession()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw error
  }

  if (response.status === 204) return undefined as T

  return response.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
