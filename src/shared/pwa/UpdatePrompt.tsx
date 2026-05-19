import { usePwaRegister } from './usePwaRegister'

/**
 * Bottom banner hiện khi có version mới của app (service worker waiting).
 *
 * Mount 1 lần ở root (App.tsx). KHÔNG dùng portal — fixed bottom với z-index cao.
 * Mobile-first: full-width bottom, safe-area aware (viewport-fit=cover).
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = usePwaRegister()

  if (!needRefresh) return null

  const handleUpdate = () => {
    updateServiceWorker(true).catch((err) => {
      console.error('[pwa] update failed', err)
      setNeedRefresh(false)
    })
  }

  const handleDismiss = () => {
    setNeedRefresh(false)
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-0 right-0 z-[1000] flex items-center justify-between gap-3 bg-ink px-4 py-3 text-white shadow-lg"
      style={{
        bottom: 0,
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex-1">
        <div className="text-[13px] font-semibold">Có bản cập nhật mới</div>
        <div className="text-[11px] text-white/70">
          Tải lại để dùng phiên bản mới nhất.
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          onClick={handleDismiss}
          className="rounded-md px-3 py-1.5 text-[12px] font-medium text-white/80 hover:text-white"
        >
          Để sau
        </button>
        <button
          onClick={handleUpdate}
          className="rounded-md bg-gold-d px-3 py-1.5 text-[12px] font-semibold text-ink hover:opacity-90"
          style={{ background: '#F5B731' }}
        >
          Cập nhật
        </button>
      </div>
    </div>
  )
}
