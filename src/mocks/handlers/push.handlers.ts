import { http, HttpResponse } from 'msw'

// In-memory mock store cho push subscriptions — mock dev mode stateful
// để test flow subscribe → list → unsubscribe.
let mockSubscriptions: Array<{
  id: string
  endpoint: string
  user_agent: string | null
  created_at: string
  updated_at: string
}> = []

export const pushHandlers = [
  http.post(`*/api/learn/push/subscribe`, async ({ request }) => {
    const body = (await request.json()) as {
      endpoint?: string
      user_agent?: string
    }
    const endpoint = body.endpoint ?? ''

    // Upsert ON CONFLICT(endpoint).
    const existing = mockSubscriptions.find((s) => s.endpoint === endpoint)
    const now = new Date().toISOString()
    if (existing) {
      existing.user_agent = body.user_agent ?? existing.user_agent
      existing.updated_at = now
      return HttpResponse.json({ id: existing.id, created_at: existing.created_at })
    }
    const id = `ps-mock-${Date.now()}`
    const row = {
      id,
      endpoint,
      user_agent: body.user_agent ?? null,
      created_at: now,
      updated_at: now,
    }
    mockSubscriptions.push(row)
    return HttpResponse.json({ id, created_at: now })
  }),

  http.delete(`*/api/learn/push/unsubscribe`, async ({ request }) => {
    const body = (await request.json()) as { endpoint?: string }
    const before = mockSubscriptions.length
    mockSubscriptions = mockSubscriptions.filter((s) => s.endpoint !== body.endpoint)
    const deleted = mockSubscriptions.length < before
    return HttpResponse.json({ deleted })
  }),

  http.get(`*/api/learn/push/subscriptions`, () => {
    // BE response strip endpoint + keys — chỉ trả id + user_agent + timestamps.
    return HttpResponse.json(
      mockSubscriptions.map((s) => ({
        id: s.id,
        user_agent: s.user_agent,
        created_at: s.created_at,
        updated_at: s.updated_at,
      })),
    )
  }),
]
