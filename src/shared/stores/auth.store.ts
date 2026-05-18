import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StudentProfile } from '../types'
import type { AuthUser } from '../config/auth-central-client'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: StudentProfile | null
  notifCount: number
  setSession: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
  ) => void
  /** Update tokens only (refresh flow) — KHÔNG reset user fields. */
  setTokens: (accessToken: string, refreshToken: string) => void
  clearSession: () => void
  setNotifCount: (count: number) => void
  updateUser: (patch: Partial<StudentProfile>) => void
}

// AuthUser từ auth-central có 5 fields. Khi setSession, fill nullable
// defaults cho learn-specific fields — sẽ được hydrate qua /api/learn/me
// (TanStack Query) sau khi login + page mount.
function authUserToStudentProfile(user: AuthUser): StudentProfile {
  return {
    id: user.id,
    person_id: user.person_id,
    full_name: user.full_name,
    email: user.email,
    avatar_url: user.avatar_url,
    phone: null,
    student_code: null,
    is_active: true,
    activated_at: null,
    created_at: new Date().toISOString(),
    consultant_name: null,
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      notifCount: 0,
      setSession: (accessToken, refreshToken, user) =>
        set({
          accessToken,
          refreshToken,
          user: authUserToStudentProfile(user),
        }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          notifCount: 0,
        }),
      setNotifCount: (notifCount) => set({ notifCount }),
      updateUser: (patch) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : state.user,
        })),
    }),
    {
      name: 'nedu-learn-auth',
      // notifCount derive khỏi BE — không persist
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
)
