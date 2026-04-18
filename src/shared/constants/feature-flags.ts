// src/shared/constants/feature-flags.ts
// Feature flags — Claude tự thêm khi có feature cần flag, default false.
export const FLAGS = {
  // ví dụ: ENABLE_PUSH_NOTIFICATIONS: false,
} as const

export type FeatureFlag = keyof typeof FLAGS

export function isFlagEnabled(flag: FeatureFlag): boolean {
  return FLAGS[flag] === true
}
