import { useState, useEffect } from 'react'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { toast } from '../../../shared/components/ui/Toast'
import { authService } from '../../auth/services/auth.service'
import { useAuthStore } from '../../../shared/stores/auth.store'
import type { StudentProfile } from '../../../shared/types'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  profile: StudentProfile
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative rounded-[12px] flex-shrink-0 transition-colors"
      style={{
        width: 42,
        height: 24,
        background: on ? '#F5B731' : 'rgba(26,24,22,0.10)',
      }}
    >
      <span
        className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform"
        style={{
          transform: on ? 'translateX(18px)' : 'translateX(0)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  )
}

export function SettingsModal({ open, onClose, profile }: SettingsModalProps) {
  const updateUser = useAuthStore((s) => s.updateUser)
  const [editMode, setEditMode] = useState(false)
  const [fullName, setFullName] = useState(profile.full_name)
  const [phone, setPhone] = useState(profile.phone || '')
  const [pushOn, setPushOn] = useState(true)
  const [emailOn, setEmailOn] = useState(true)
  const [changingPassword, setChangingPassword] = useState(false)

  // Reset edit state when modal reopens or profile changes
  useEffect(() => {
    if (open) {
      setEditMode(false)
      setFullName(profile.full_name)
      setPhone(profile.phone || '')
    }
  }, [open, profile.full_name, profile.phone])

  const handleSaveInfo = () => {
    const trimmedName = fullName.trim()
    if (!trimmedName) {
      toast('Họ tên không được trống', 'error')
      return
    }
    updateUser({
      full_name: trimmedName,
      phone: phone.trim() || null,
    })
    toast('Đã lưu thông tin', 'success')
    setEditMode(false)
  }

  const handleCancelEdit = () => {
    setFullName(profile.full_name)
    setPhone(profile.phone || '')
    setEditMode(false)
  }

  const handleChangePassword = async () => {
    setChangingPassword(true)
    try {
      await authService.forgotPassword(profile.email)
      toast('Đã gửi link đổi mật khẩu qua email', 'success')
    } catch {
      toast('Có lỗi xảy ra', 'error')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Cài đặt tài khoản">
      <div className="space-y-5">
        {/* Account info — editable */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <div
              className="font-mono text-[10px] font-bold uppercase text-i3"
              style={{ letterSpacing: '0.06em' }}
            >
              Thông tin tài khoản
            </div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="text-[12px] font-medium text-gold-d"
              >
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="text-[12px] font-medium text-i3"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSaveInfo}
                  className="text-[12px] font-semibold text-gold-d"
                >
                  Lưu
                </button>
              </div>
            )}
          </div>

          <div
            className="bg-surface rounded-[14px] px-4 py-1"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            {editMode ? (
              <>
                <EditableRow
                  label="Họ và tên"
                  value={fullName}
                  onChange={setFullName}
                  autoFocus
                />
                <EditableRow
                  label="Điện thoại"
                  value={phone}
                  onChange={setPhone}
                  type="tel"
                  placeholder="0901 234 567"
                  divider
                />
                <ReadOnlyRow label="Email" value={profile.email} hint="Không thể đổi" divider />
                <ReadOnlyRow
                  label="Tư vấn viên"
                  value={profile.consultant_name || '—'}
                  divider
                />
                <ReadOnlyRow
                  label="Ngày đăng ký"
                  value={new Date(profile.created_at).toLocaleDateString('vi-VN')}
                  divider
                />
              </>
            ) : (
              <>
                <ReadOnlyRow label="Họ và tên" value={profile.full_name} />
                <ReadOnlyRow label="Email" value={profile.email} divider />
                <ReadOnlyRow
                  label="Điện thoại"
                  value={profile.phone || '—'}
                  divider
                />
                <ReadOnlyRow label="Nguồn biết đến" value="YouTube NhiLe" divider />
                <ReadOnlyRow
                  label="Tư vấn viên"
                  value={profile.consultant_name || '—'}
                  divider
                />
                <ReadOnlyRow
                  label="Ngày đăng ký"
                  value={new Date(profile.created_at).toLocaleDateString('vi-VN')}
                  divider
                />
              </>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
            style={{ letterSpacing: '0.06em' }}
          >
            Thông báo
          </div>
          <div
            className="bg-surface rounded-[14px]"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <ToggleRow
              icon="🔔"
              title="Thông báo"
              sub="Lịch học · Hạn nộp · Học phí"
              on={pushOn}
              onChange={() => {
                setPushOn(!pushOn)
                toast(pushOn ? 'Đã tắt push' : 'Đã bật push', 'success')
              }}
            />
            <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />
            <ToggleRow
              icon="📧"
              title="Email nhắc nhở"
              sub="Trước hạn nộp 48 giờ"
              on={emailOn}
              onChange={() => {
                setEmailOn(!emailOn)
                toast(emailOn ? 'Đã tắt email' : 'Đã bật email', 'success')
              }}
            />
          </div>
        </div>

        {/* Security */}
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
            style={{ letterSpacing: '0.06em' }}
          >
            Bảo mật
          </div>
          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="w-full bg-surface rounded-[14px] px-4 py-3.5 flex items-center gap-3 text-left transition-colors active:bg-s2 disabled:opacity-60"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="text-[18px] flex-shrink-0">🔒</div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-ink">Đổi mật khẩu</div>
              <div className="text-[11px] text-i3 mt-0.5">
                {changingPassword ? 'Đang gửi...' : 'Gửi link đổi qua email'}
              </div>
            </div>
            <span className="text-i3 text-[14px]">›</span>
          </button>
        </div>

        {/* Language */}
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
            style={{ letterSpacing: '0.06em' }}
          >
            Ngôn ngữ
          </div>
          <div
            className="bg-surface rounded-[14px] px-4 py-3.5 flex items-center gap-3"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="text-[18px] flex-shrink-0">🌐</div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-ink">Tiếng Việt</div>
              <div className="text-[11px] text-i3 mt-0.5">Mặc định</div>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: '#FEF4D6', color: '#D4920A' }}
            >
              Đang dùng
            </span>
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}

function ReadOnlyRow({
  label,
  value,
  hint,
  divider,
}: {
  label: string
  value: string
  hint?: string
  divider?: boolean
}) {
  return (
    <div
      className="flex items-start justify-between py-2.5"
      style={divider ? { borderTop: '1px solid rgba(26,24,22,0.10)' } : {}}
    >
      <div className="text-[12px] text-i3 font-medium">{label}</div>
      <div className="text-right max-w-[60%]">
        <div
          className="text-[12px] text-ink font-semibold"
          style={{ lineHeight: 1.4 }}
        >
          {value}
        </div>
        {hint && <div className="text-[10px] text-i3 mt-0.5">{hint}</div>}
      </div>
    </div>
  )
}

function EditableRow({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoFocus,
  divider,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: 'text' | 'tel'
  placeholder?: string
  autoFocus?: boolean
  divider?: boolean
}) {
  return (
    <div
      className="flex items-center justify-between py-2 gap-3"
      style={divider ? { borderTop: '1px solid rgba(26,24,22,0.10)' } : {}}
    >
      <div className="text-[12px] text-i3 font-medium flex-shrink-0">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="flex-1 min-w-0 text-[12px] text-ink font-semibold text-right bg-transparent focus:outline-none px-2 py-1 rounded-md focus:bg-s2 transition-colors"
      />
    </div>
  )
}

function ToggleRow({
  icon,
  title,
  sub,
  on,
  onChange,
}: {
  icon: string
  title: string
  sub: string
  on: boolean
  onChange: () => void
}) {
  return (
    <div className="w-full flex items-center gap-3 px-4 py-3">
      <div className="text-[18px] flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-ink">{title}</div>
        <div className="text-[11px] text-i3 mt-0.5">{sub}</div>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  )
}
