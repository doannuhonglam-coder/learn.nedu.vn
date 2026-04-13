interface BaZiStripProps {
  onOpen: () => void
}

export function BaZiStrip({ onOpen }: BaZiStripProps) {
  return (
    <button
      onClick={onOpen}
      className="mx-4 mt-4 p-3 bg-purple-50 rounded-xl flex items-center gap-3 w-[calc(100%-2rem)] text-left hover:bg-purple-100 transition-colors"
    >
      <span className="text-xl">🌿</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-brand-purple">Nhâm Thân · Tứ Trụ</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">♑ Ma Kết</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">Sao 7 Kim</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">Life Path 7</span>
        </div>
      </div>
      <span className="text-gray-400 text-sm">›</span>
    </button>
  )
}
