// src/mocks/init.ts
//
// Hai mode rõ ràng, không half-state:
//   - VITE_ENABLE_MOCKING=true  → start MSW, MSW intercept mọi /api/* + /auth/*
//   - VITE_ENABLE_MOCKING=false → unregister MSW worker (CHỈ MSW) → request đi
//     thẳng tới real BE
//
// MSW chỉ chạy trên localhost (service worker yêu cầu HTTPS hoặc localhost).
// Trên deploy thật (Cloudflare Worker / Vercel), MSW không start kể cả khi
// flag = true — production phải dùng real BE.
import { env } from '@shared/config/env'

const RELOAD_FLAG = 'msw_cleanup_reloaded'

/**
 * Gỡ MSW worker khi user toggle VITE_ENABLE_MOCKING=true → false.
 *
 * Vòng đời Service Worker:
 *   SW persist ở browser ngay cả sau khi code không còn gọi worker.start().
 *   Khi tab load mới, SW cũ đã ACTIVE và intercept request NGAY — trước cả khi
 *   JS app kịp chạy unregister. Vì vậy phải unregister + reload 1 lần.
 *
 * QUAN TRỌNG: chỉ unregister MSW worker (`/mockServiceWorker.js`), KHÔNG đụng
 * PWA workbox SW (`/sw.js`). Code cũ unregister tất cả SW + xóa tất cả caches
 * → blast cả PWA → cache rỗng, mất offline + extra reload mỗi page load.
 *
 * `RELOAD_FLAG` trong sessionStorage chặn loop reload vô hạn.
 */
function isMswScriptURL(url: string | null | undefined): boolean {
  return !!url && url.endsWith('/mockServiceWorker.js')
}

async function cleanupLegacyMockWorker() {
  let needsReload = false

  if ('serviceWorker' in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations()
      // Chỉ MSW worker, không động vào PWA SW.
      const mswRegs = regs.filter(
        (r) =>
          isMswScriptURL(r.active?.scriptURL) ||
          isMswScriptURL(r.waiting?.scriptURL) ||
          isMswScriptURL(r.installing?.scriptURL),
      )
      if (mswRegs.length > 0) {
        needsReload = true
        await Promise.all(mswRegs.map((r) => r.unregister()))
      }
    } catch {
      /* ignore */
    }
  }

  // MSW không tạo Cache Storage entry — chỉ intercept qua fetch event.
  // Workbox precache outdated tự handle qua `cleanupOutdatedCaches: true`.
  // → Không xóa caches ở đây để giữ PWA runtime cache (navigation, fonts, images).

  if (needsReload && !sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.setItem(RELOAD_FLAG, '1')
    console.info('[mocks] Legacy MSW worker unregistered — reloading to detach.')
    window.location.reload()
    // Treo bootstrap để React không render với MSW SW cũ còn active.
    await new Promise(() => {})
  } else {
    sessionStorage.removeItem(RELOAD_FLAG)
  }
}

export async function enableMocking() {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')

  // Non-localhost (prod): luôn cleanup, không bao giờ start MSW.
  if (!isLocalhost) {
    await cleanupLegacyMockWorker()
    return
  }

  // Mock flag OFF: cleanup SW cũ để request đi real BE.
  if (!env.IS_MOCK) {
    await cleanupLegacyMockWorker()
    return
  }

  // Mock flag ON: start worker.
  try {
    const { worker } = await import('./browser')
    // `warn` thay vì `bypass`: nếu request tới /api/learn/* hoặc /auth/*
    // mà không có handler, console cảnh báo để team biết thêm mock.
    // Static assets (font/image/etc) khác origin bỏ qua vì không match.
    await worker.start({
      onUnhandledRequest: (request, print) => {
        const url = new URL(request.url)
        if (
          url.pathname.startsWith('/api/learn/') ||
          url.pathname.startsWith('/auth/')
        ) {
          print.warning()
        }
      },
    })
  } catch (e) {
    console.warn('[MSW] Failed to start worker:', e)
  }
}
