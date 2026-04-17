import { useEffect, type ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(26,24,22,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[420px] bg-surface rounded-t-[20px] flex flex-col animate-[slideUp_0.35s_cubic-bezier(.25,.46,.45,.94)]"
        style={{ maxHeight: '92vh', minHeight: 0 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(26,24,22,0.10)' }} />
        </div>

        {/* Header — sticky */}
        <div
          className="flex items-center justify-between px-[18px] pt-4 pb-[14px] flex-shrink-0 sticky top-0 z-[1]"
          style={{ borderBottom: '1px solid rgba(26,24,22,0.10)', background: '#FFFFFF' }}
        >
          {title && (
            <h2 className="font-display font-semibold text-[17px] text-ink">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto w-[30px] h-[30px] rounded-full flex items-center justify-center text-[16px] leading-none"
            style={{ background: '#F5F3EF' }}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto overscroll-contain px-[18px] py-4"
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
