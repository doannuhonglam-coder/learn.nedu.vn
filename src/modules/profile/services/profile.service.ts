import { api } from '../../../shared/config/api-client'
import type { MetaphysicalProfile, PiiInput } from '../../../shared/types'

export interface PersonalInfoInput {
  full_name: string
  phone?: string | null
}

export interface PersonalInfoResponse {
  full_name: string
  phone: string | null
}

export interface PlaceSuggestion {
  place_id: string
  text: string
  secondary?: string
  full?: string
  lat: number
  lng: number
}

// /profile (full StudentProfile) đã merge vào /me (xem shared/hooks/useMe).
// /profile/streak đã merge vào /me.learner_state.streak_*. /profile/metaphysical/pdf
// defer Phase 2 (P2 spec NL-LEARN-API-PLAN-001).
export const profileService = {
  getMetaphysical: () => api.get<MetaphysicalProfile>('/profile/metaphysical'),
  putPii: (input: PiiInput) =>
    api.put<MetaphysicalProfile>('/profile/pii', input),
  /**
   * Upload custom avatar — base64 data URL. BE validate MIME + max 1MB raw.
   * BE return { avatar_url } persisted. FE invalidate useMe để Topbar refresh.
   */
  setAvatar: (dataUrl: string) =>
    api.put<{ avatar_url: string | null }>('/profile/avatar', {
      data_url: dataUrl,
    }),
  /**
   * Clear custom avatar → null. BE self-heal sẽ fetch lại Google avatar
   * từ /auth/me lần verify token sau.
   */
  clearAvatar: () =>
    api.delete<{ avatar_url: string | null }>('/profile/avatar'),
  /**
   * Update họ tên + số điện thoại. BE validate trim/length, trả về shape
   * canonical (sau trim). FE sync auth store với response để UI consistent.
   */
  updatePersonalInfo: (input: PersonalInfoInput) =>
    api.put<PersonalInfoResponse>('/profile/personal-info', input),
  /**
   * Birthplace autocomplete — proxy tới Mapbox v6, response include lat/lng
   * inline. Trả `{ suggestions }`. Caller debounce + abort signal.
   */
  searchPlaces: (q: string, signal?: AbortSignal) =>
    api.get<{ suggestions: PlaceSuggestion[] }>(
      `/places/autocomplete?q=${encodeURIComponent(q)}&lang=vi`,
      signal,
    ),
}
