import type { MetaphysicalProfile } from '../../../shared/types'

interface MetaphysicalStripProps {
  profile: MetaphysicalProfile | null
  onOpen: () => void
}

export function MetaphysicalStrip({ profile, onOpen }: MetaphysicalStripProps) {
  const tags: string[] = []
  if (profile?.bazi) tags.push(profile.bazi.day_master)
  if (profile?.nine_star_ki) tags.push(profile.nine_star_ki.star_name)
  if (profile?.numerology) tags.push(`Life Path ${profile.numerology.life_path}`)
  if (profile?.mbti) tags.push(profile.mbti.type)
  if (profile?.enneagram) tags.push(`Enneagram ${profile.enneagram.type}${profile.enneagram.wing ? `w${profile.enneagram.wing}` : ''}`)

  const displayTags = tags.length > 0 ? tags : ['♑ Ma Kết', 'Sao 7 Kim', 'Life Path 7', 'Canh Kim Ngày', 'Nhâm Thân']

  return (
    <div className="px-4 mt-3">
      <button
        onClick={onOpen}
        className="w-full bg-surface rounded-[14px] p-4 text-left"
        style={{ border: '1px solid rgba(26,24,22,0.10)' }}
      >
        <div
          className="font-mono text-[10px] font-semibold uppercase mb-1.5"
          style={{ color: '#D4920A', letterSpacing: '0.06em' }}
        >
          🌿 Hồ Sơ Phát Triển · BaZi & Phong Thủy
        </div>
        <div className="flex flex-wrap gap-1.5">
          {displayTags.map((tag) => (
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
        <div className="text-[12px] text-i2 mt-2">Xem hồ sơ đầy đủ →</div>
      </button>
    </div>
  )
}
