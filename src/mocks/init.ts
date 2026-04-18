// src/mocks/init.ts
// MSW chỉ chạy trên localhost (service worker cần HTTPS/localhost).
// Trên Vercel: api-client fallback sang static mock-data.ts.
export async function enableMocking() {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')

  if (!isLocalhost) return
  if (import.meta.env.VITE_ENABLE_MOCKING !== 'true') return

  try {
    const { worker } = await import('./browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  } catch (e) {
    console.warn('[MSW] Failed to start worker:', e)
  }
}
