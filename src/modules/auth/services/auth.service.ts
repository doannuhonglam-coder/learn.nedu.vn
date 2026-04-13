import { api } from '../../../shared/config/api-client'
import type { LoginResponse, StudentProfile } from '../../../shared/types'

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),

  activate: (token: string, password: string) =>
    api.post<LoginResponse>('/auth/activate', { token, password }),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  me: () => api.get<StudentProfile>('/auth/me'),
}
