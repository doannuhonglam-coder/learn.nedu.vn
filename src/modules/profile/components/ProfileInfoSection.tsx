import type { StudentProfile } from '../../../shared/types'

interface ProfileInfoSectionProps {
  profile: StudentProfile
}

export function ProfileInfoSection({ profile }: ProfileInfoSectionProps) {
  const fields = [
    { label: 'Họ tên', value: profile.full_name },
    { label: 'Email', value: profile.email },
    { label: 'Số điện thoại', value: profile.phone || '—' },
    { label: 'Tư vấn viên', value: profile.consultant_name || '—' },
    { label: 'Ngày đăng ký', value: new Date(profile.created_at).toLocaleDateString('vi-VN') },
  ]

  return (
    <div className="mx-4 mt-4">
      <h3 className="font-display font-semibold text-sm text-brand-dark mb-2">Thông tin cơ bản</h3>
      <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between px-4 py-3">
            <p className="text-xs text-gray-400">{field.label}</p>
            <p className="text-sm text-brand-dark">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
