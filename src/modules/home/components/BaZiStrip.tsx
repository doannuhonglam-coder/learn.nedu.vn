interface BaZiStripProps {
  onOpen: () => void
}

export function BaZiStrip({ onOpen }: BaZiStripProps) {
  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-display text-[16px] font-semibold text-ink">
          Hồ Sơ Phát Triển
        </h2>
        <button onClick={onOpen} className="text-[12px] font-medium text-gold-d">
          Chi tiết →
        </button>
      </div>

      <button
        onClick={onOpen}
        className="w-full rounded-[14px] p-4 flex gap-[14px] items-center text-left"
        style={{
          background: 'linear-gradient(135deg, #FDFAF5, #F0EBE0)',
          border: '1px solid rgba(245,183,49,0.25)',
          boxShadow: '0 2px 16px rgba(26,24,22,0.08)',
        }}
      >
        <div
          className="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-[22px]"
          style={{
            background: 'linear-gradient(135deg, #FEF4D6, #F4C07A)',
            border: '1px solid rgba(245,183,49,0.25)',
          }}
        >
          🌿
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[10px] font-bold uppercase mb-1"
            style={{ color: '#8B5A15', letterSpacing: '0.06em' }}
          >
            BaZi · Tử Vi · Nine Star Ki
          </div>
          <div className="font-display text-[15px] font-semibold text-ink mb-1.5">
            Nhâm Thân · Tứ Trụ
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['♑ Ma Kết', 'Sao 7 Kim', 'Life Path 7', 'Canh Kim Ngày'].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(245,183,49,0.10)',
                  color: '#8B5A15',
                  border: '1px solid rgba(245,183,49,0.25)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="text-[18px] text-i3">›</div>
      </button>
    </div>
  )
}
