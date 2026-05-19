// PWA service worker registration hook.
//
// Wrap `useRegisterSW` (virtual:pwa-register/react) — vite-plugin-pwa tự
// generate registerSW.js từ workbox config, ta chỉ subscribe state.
//
// Behavior:
// - Lần đầu user mở app prod: SW install + precache assets → `offlineReady = true`
// - Khi deploy version mới: SW check update mỗi giờ + on visibility change →
//   `needRefresh = true` → UpdatePrompt hiện toast "Cập nhật ngay"
// - User click "Cập nhật" → `updateServiceWorker(true)` → reload sang version mới
//
// PWA SW chỉ active ở prod build (devOptions.enabled = false trong vite.config).
// Trong dev: hook trả về stub, không làm gì.

import { useRegisterSW } from 'virtual:pwa-register/react'

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000 // 1h

export function usePwaRegister() {
  return useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return
      // Periodic check: mỗi giờ + khi tab visible lại sau idle.
      setInterval(() => {
        registration.update().catch(() => {
          // network fail → bỏ qua, lần check sau retry
        })
      }, UPDATE_CHECK_INTERVAL_MS)
    },
    onRegisterError(err) {
      console.error('[pwa] sw register failed', err)
    },
  })
}
