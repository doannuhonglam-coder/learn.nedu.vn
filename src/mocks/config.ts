// src/mocks/config.ts
// Helpers cho MSW handlers — resolve current user từ auth store
// + các response shape chuẩn (NestJS-style).
import { HttpResponse } from 'msw'
import { useAuthStore } from '@shared/stores/auth.store'
import { MOCK_PERSONS, type MockPerson } from './data/persons'

export function getCurrentMockUserId(): string | null {
  const user = useAuthStore.getState().user
  if (!user?.email) return null
  return MOCK_PERSONS.find((p) => p.email === user.email)?.id ?? null
}

export function getCurrentMockPerson(): MockPerson | null {
  const id = getCurrentMockUserId()
  return id ? MOCK_PERSONS.find((p) => p.id === id) ?? null : null
}

export const unauthorized = () =>
  HttpResponse.json(
    { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' },
    { status: 401 },
  )

export const forbidden = (msg = 'Forbidden') =>
  HttpResponse.json(
    { statusCode: 403, message: msg, error: 'Forbidden' },
    { status: 403 },
  )

export const notFound = (msg = 'Not found') =>
  HttpResponse.json(
    { statusCode: 404, message: msg, error: 'Not Found' },
    { status: 404 },
  )

export const badRequest = (errors: string[]) =>
  HttpResponse.json(
    { statusCode: 400, message: errors, error: 'Bad Request' },
    { status: 400 },
  )
