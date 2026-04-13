import type { MetaphysicalProfile } from '../../../shared/types'

interface MetaphysicalStripProps {
  profile: MetaphysicalProfile | null
  onOpen: () => void
}

export function MetaphysicalStrip({ profile, onOpen }: MetaphysicalStripProps) {
  if (!profile) {
    return (
      <div className="mx-4 mt-4 p-4 bg-purple-50 rounded-xl">
        <p className="text-sm text-gray-500">Chưa có dữ liệu siêu hình học</p>
        <p className="text-xs text-gray-400 mt-1">Liên hệ Nedu Team để tạo hồ sơ</p>
      </div>
    )
  }

  const tags: string[] = []
  if (profile.bazi) tags.push(`🀄 ${profile.bazi.day_master}`)
  if (profile.nine_star_ki) tags.push(`⭐ ${profile.nine_star_ki.star_name}`)
  if (profile.numerology) tags.push(`🔢 Life Path ${profile.numerology.life_path}`)
  if (profile.mbti) tags.push(`${profile.mbti.type}`)
  if (profile.enneagram) tags.push(`E${profile.enneagram.type}${profile.enneagram.wing ? `w${profile.enneagram.wing}` : ''}`)

  return (
    <div className="mx-4 mt-4">
      <h3 className="font-display font-semibold text-sm text-brand-dark mb-2">Hồ Sơ Siêu Hình Học</h3>
      <button
        onClick={onOpen}
        className="w-full p-3 bg-purple-50 rounded-xl flex items-center gap-3 text-left hover:bg-purple-100 transition-colors"
      >
        <span className="text-xl">🌿</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs text-brand-purple font-medium">{tag}</span>
            ))}
          </div>
        </div>
        <span className="text-gray-400 text-sm">›</span>
      </button>
      <button onClick={onOpen} className="text-xs text-brand-gold font-medium mt-1.5">
        Xem hồ sơ đầy đủ →
      </button>
    </div>
  )
}
