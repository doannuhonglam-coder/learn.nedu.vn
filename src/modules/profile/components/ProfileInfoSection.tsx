import type { StudentProfile } from '../../../shared/types'

interface ProfileInfoSectionProps {
  profile: StudentProfile
}

export function ProfileInfoSection({ profile }: ProfileInfoSectionProps) {
  const fields = [
    { label: 'Họ và tên', value: profile.full_name },
    { label: 'Email', value: profile.email },
    { label: 'Điện thoại', value: profile.phone || '—' },
    { label: 'Nguồn biết đến', value: 'YouTube NhiLe' },
    { label: 'Tư vấn viên', value: profile.consultant_name || '—' },
    { label: 'Ngày đăng ký', value: new Date(profile.created_at).toLocaleDateString('vi-VN') },
  ]

  return (
    <div className="px-4 mt-3">
      <div
        className="bg-surface rounded-[14px] px-4 py-1"
        style={{ border: '1px solid rgba(26,24,22,0.10)' }}
      >
        {fields.map((field, i) => (
          <div
            key={field.label}
            className="flex items-start justify-between py-2.5"
            style={i < fields.length - 1 ? { borderBottom: '1px solid rgba(26,24,22,0.10)' } : {}}
          >
            <div className="text-[12px] text-i3 font-medium">{field.label}</div>
            <div
              className="text-[12px] text-ink font-semibold text-right max-w-[60%]"
              style={{ lineHeight: 1.4 }}
            >
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
