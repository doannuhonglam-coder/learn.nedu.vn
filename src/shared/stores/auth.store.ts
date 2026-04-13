import { create } from 'zustand'
import type { StudentProfile } from '../types'

interface AuthState {
  accessToken: string | null
  user: StudentProfile | null
  notifCount: number
  setSession: (token: string, user: StudentProfile) => void
  clearSession: () => void
  setNotifCount: (count: number) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  notifCount: 0,
  setSession: (accessToken, user) => set({ accessToken, user }),
  clearSession: () => set({ accessToken: null, user: null, notifCount: 0 }),
  setNotifCount: (notifCount) => set({ notifCount }),
}))
