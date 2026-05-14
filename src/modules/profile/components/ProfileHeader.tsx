import { useRef, useState } from 'react'
import type { StudentProfile } from '../../../shared/types'
import { toast } from '../../../shared/components/ui/Toast'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'

interface ProfileHeaderProps {
  profile: StudentProfile
  stats: { courses: number; certificates: number; progress: number }
  onCoursesClick: () => void
  onCertificatesClick: () => void
}

const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5MB

export function ProfileHeader({
  profile,
  stats,
  onCoursesClick,
  onCertificatesClick,
}: ProfileHeaderProps) {
  const updateUser = useAuthStore((s) => s.updateUser)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const initials = profile.full_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // reset so picking same file again still fires onChange
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast('Vui lòng chọn file ảnh', 'error')
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast('Ảnh quá lớn (tối đa 5MB)', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      updateUser({ avatar_url: dataUrl })
      toast('📸 Đã cập nhật ảnh đại diện', 'success')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    updateUser({ avatar_url: null })
    toast('Đã xoá ảnh đại diện', 'success')
    setPickerOpen(false)
  }

  return (
    <div className="px-4">
      <div className="text-center pt-5 pb-4">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <button
            onClick={() => setPickerOpen(true)}
            className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-[28px] font-bold text-white border-[3px] border-white relative"
            style={{
              background: profile.avatar_url
                ? `url(${profile.avatar_url}) center/cover`
                : 'linear-gradient(135deg, #F5B731, #D4920A)',
              boxShadow: '0 4px 20px rgba(26,24,22,0.18)',
            }}
          >
            {!profile.avatar_url && initials}
          </button>
          {/* Camera badge */}
          <button
            onClick={() => setPickerOpen(true)}
            aria-label="Đổi ảnh"
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-[13px] transition-transform active:scale-95"
            style={{
              background: '#1A1816',
              border: '2px solid #FAFAF8',
              color: '#F5B731',
            }}
          >
            📷
          </button>
        </div>

        <div className="font-display text-[20px] font-semibold text-ink mb-[3px]">
          {profile.full_name}
        </div>
        <div className="text-[12px] text-i3 mb-4">
          Học viên · Nedu Education
          {profile.student_code ? ` · ID: ${profile.student_code}` : ''}
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onCoursesClick}
            className="flex-1 bg-surface rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">
              {stats.courses}
            </div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Khoá học
            </div>
          </button>
          <button
            onClick={onCertificatesClick}
            className="flex-1 bg-surface rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">
              {stats.certificates}
            </div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Chứng chỉ
            </div>
          </button>
          <button
            onClick={onCoursesClick}
            className="flex-1 bg-surface rounded-lg p-3 text-center"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="font-display text-[18px] font-bold text-gold-d">
              {stats.progress}%
            </div>
            <div
              className="text-[10px] text-i3 font-medium uppercase mt-0.5"
              style={{ letterSpacing: '0.04em' }}
            >
              Tiến độ
            </div>
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileSelected}
      />

      {/* Avatar picker */}
      <BottomSheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Ảnh đại diện">
        <div className="space-y-2">
          <button
            onClick={() => {
              fileInputRef.current?.click()
              setPickerOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors active:bg-s2 text-left"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
              style={{ background: '#FEF4D6' }}
            >
              🖼️
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-ink">Chọn từ thư viện</div>
              <div className="text-[11px] text-i3 mt-0.5">Tải ảnh từ máy (JPG, PNG · tối đa 5MB)</div>
            </div>
            <span className="text-i3 text-[16px]">›</span>
          </button>

          <button
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.capture = 'user'
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement
                const file = target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  updateUser({ avatar_url: reader.result as string })
                  toast('📸 Đã cập nhật ảnh đại diện', 'success')
                  setPickerOpen(false)
                }
                reader.readAsDataURL(file)
              }
              input.click()
            }}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors active:bg-s2 text-left"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
              style={{ background: '#FEF4D6' }}
            >
              📷
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-ink">Chụp ảnh mới</div>
              <div className="text-[11px] text-i3 mt-0.5">Mở camera để chụp ngay</div>
            </div>
            <span className="text-i3 text-[16px]">›</span>
          </button>

          {profile.avatar_url && (
            <button
              onClick={handleRemoveAvatar}
              className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors active:bg-s2 text-left"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
                style={{ background: '#FDECEA' }}
              >
                🗑️
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold" style={{ color: '#C0392B' }}>
                  Xoá ảnh đại diện
                </div>
                <div className="text-[11px] text-i3 mt-0.5">Quay về chữ cái mặc định</div>
              </div>
              <span className="text-i3 text-[16px]">›</span>
            </button>
          )}
        </div>
      </BottomSheet>
    </div>
  )
}
