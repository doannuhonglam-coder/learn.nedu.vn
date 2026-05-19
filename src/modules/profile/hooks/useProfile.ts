import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileService, type PersonalInfoInput } from '../services/profile.service'
import type { PiiInput, MetaphysicalProfile } from '../../../shared/types'
import { useAuthStore } from '../../../shared/stores/auth.store'

// useProfile + useStreak removed — both fields are sourced from useMe()
// (shared/hooks/useMe). Only metaphysical facets still has dedicated endpoint
// because vault cache logic is separate.
export function useMetaphysical() {
  return useQuery({
    queryKey: ['profile', 'metaphysical'],
    queryFn: profileService.getMetaphysical,
  })
}

/**
 * Submit PII (dob/tob/pob/gender) → BE save + trigger vault compute.
 * Sau success → invalidate metaphysical query để cache fresh.
 */
export function useSubmitPii() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: PiiInput) => profileService.putPii(input),
    onSuccess: (data: MetaphysicalProfile) => {
      qc.setQueryData(['profile', 'metaphysical'], data)
      void qc.invalidateQueries({ queryKey: ['profile', 'metaphysical'] })
    },
  })
}

/**
 * Upload avatar (data URL base64) → BE persist users.avatar_url.
 * Sau success: update auth store (Topbar avatar refresh instant) +
 * invalidate /me query (re-fetch để source-of-truth fresh).
 */
export function useSetAvatar() {
  const qc = useQueryClient()
  const updateUser = useAuthStore((s) => s.updateUser)
  return useMutation({
    mutationFn: (dataUrl: string) => profileService.setAvatar(dataUrl),
    onSuccess: (res) => {
      updateUser({ avatar_url: res.avatar_url })
      void qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

/**
 * Clear custom avatar → BE save null → CentralAuthStrategy self-heal sẽ
 * fetch lại Google avatar lần next /me call. FE optimistic clear store.
 */
export function useClearAvatar() {
  const qc = useQueryClient()
  const updateUser = useAuthStore((s) => s.updateUser)
  return useMutation({
    mutationFn: () => profileService.clearAvatar(),
    onSuccess: (res) => {
      updateUser({ avatar_url: res.avatar_url })
      void qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

/**
 * Update họ tên + số điện thoại → BE persist users.full_name + users.phone.
 * Response shape canonical (sau trim) → sync store với response.
 * Sau success: invalidate /me để re-fetch source-of-truth.
 */
export function useUpdatePersonalInfo() {
  const qc = useQueryClient()
  const updateUser = useAuthStore((s) => s.updateUser)
  return useMutation({
    mutationFn: (input: PersonalInfoInput) =>
      profileService.updatePersonalInfo(input),
    onSuccess: (res) => {
      updateUser({ full_name: res.full_name, phone: res.phone })
      void qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
