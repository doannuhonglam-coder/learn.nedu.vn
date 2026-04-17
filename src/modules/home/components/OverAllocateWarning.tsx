import { useState, useEffect } from 'react'

interface OverAllocateWarningProps {
  activeCourses: number
}

const STORAGE_KEY = 'nedu-warn-alloc-dismissed'

export function OverAllocateWarning({ activeCourses }: OverAllocateWarningProps) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored && activeCourses >= 4) {
      setDismissed(false)
    }
  }, [activeCourses])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setDismissed(true)
  }

  if (dismissed || activeCourses < 4) return null

  return (
    <div
      className="mx-4 mt-[14px] relative rounded-[14px] p-[12px_14px] flex gap-2.5 items-start"
      style={{
        background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)',
        border: '1px solid rgba(217,119,6,0.25)',
      }}
    >
      <div className="text-[18px] flex-shrink-0 mt-[1px]">⚠️</div>
      <div className="flex-1 pr-5">
        <div
          className="text-[12px] font-bold mb-0.5"
          style={{ color: '#92400E' }}
        >
          Bạn đang học {activeCourses} khoá cùng lúc
        </div>
        <div
          className="text-[11px]"
          style={{ color: '#78350F', lineHeight: 1.45 }}
        >
          Nên focus 1–2 khoá để đạt kết quả tốt nhất. Chất lượng hơn số lượng.
        </div>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Ẩn"
        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[12px] leading-none"
        style={{
          background: 'rgba(146,64,14,0.12)',
          color: '#92400E',
        }}
      >
        ×
      </button>
    </div>
  )
}
