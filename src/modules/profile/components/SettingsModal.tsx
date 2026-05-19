import { useState, useEffect } from 'react'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { toast } from '../../../shared/components/ui/Toast'
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '../../notifications/hooks/useNotifications'
import { useUpdatePersonalInfo } from '../hooks/useProfile'
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
  const [editMode, setEditMode] = useState(false)
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [phone, setPhone] = useState(profile.phone || '')
  const updateInfo = useUpdatePersonalInfo()

  // Notification preferences từ BE — toggle on/off sync /notifications/preferences.
  // Optimistic update ở mutation hook → toggle phản hồi tức thì.
  const { data: prefs } = useNotificationPreferences()
  const updatePrefs = useUpdateNotificationPreferences()
  const pushOn = prefs?.push_enabled ?? true
  const emailOn = prefs?.email_enabled ?? true

  // Reset edit state when modal reopens or profile changes
  useEffect(() => {
    if (open) {
      setEditMode(false)
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone || '')
    }
  }, [open, profile.full_name, profile.phone])

  const handleSaveInfo = async () => {
    const trimmedName = fullName.trim()
    if (!trimmedName) {
      toast('Họ tên không được trống', 'error')
      return
    }
    try {
      await updateInfo.mutateAsync({
        full_name: trimmedName,
        phone: phone.trim() || null,
      })
      toast('Đã lưu thông tin', 'success')
      setEditMode(false)
    } catch {
      toast('Lưu không được, thử lại sau ít phút', 'error')
    }
  }

  const handleCancelEdit = () => {
    setFullName(profile.full_name ?? '')
    setPhone(profile.phone || '')
    setEditMode(false)
  }

  // Password flow đã drop Phase 1 — học viên login bằng Google. Khi cần
  // "đổi mật khẩu", user thực hiện trực tiếp ở Google Account, không qua
  // auth-central. Section Bảo mật chỉ hiển thị thông tin static.

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
                  disabled={updateInfo.isPending}
                  className="text-[12px] font-medium text-i3 disabled:opacity-50"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSaveInfo}
                  disabled={updateInfo.isPending}
                  className="text-[12px] font-semibold text-gold-d disabled:opacity-50"
                >
                  {updateInfo.isPending ? 'Đang lưu…' : 'Lưu'}
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
                <ReadOnlyRow label="Họ và tên" value={profile.full_name ?? ''} />
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
              title="Thông báo trên thiết bị"
              sub="Lịch học · Hạn nộp · Cập nhật khoá học"
              on={pushOn}
              onChange={() => {
                // Note: chỉ toggle preference flag. Web Push browser subscription
                // (yêu cầu permission + service worker) là follow-up — khi
                // push_enabled=true mới prompt browser permission + đăng ký
                // qua /api/learn/push/subscribe.
                updatePrefs.mutate({ push_enabled: !pushOn })
                toast(pushOn ? 'Đã tắt thông báo' : 'Đã bật thông báo', 'success')
              }}
            />
            <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />
            <ToggleRow
              icon="📧"
              title="Email nhắc nhở"
              sub="Trước hạn nộp 48 giờ"
              on={emailOn}
              onChange={() => {
                updatePrefs.mutate({ email_enabled: !emailOn })
                toast(emailOn ? 'Đã tắt email' : 'Đã bật email', 'success')
              }}
            />
          </div>
        </div>

        {/* Security — Phase 1 login = Google → user đổi password ở Google Account */}
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase text-i3 mb-2 px-1"
            style={{ letterSpacing: '0.06em' }}
          >
            Bảo mật
          </div>
          <a
            href="https://myaccount.google.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-surface rounded-[14px] px-4 py-3.5 flex items-center gap-3 text-left transition-colors active:bg-s2"
            style={{ border: '1px solid rgba(26,24,22,0.10)' }}
          >
            <div className="text-[18px] flex-shrink-0">🔒</div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-ink">Quản lý tài khoản Google</div>
              <div className="text-[11px] text-i3 mt-0.5">
                Đổi mật khẩu + 2FA tại Google Account
              </div>
            </div>
            <span className="text-i3 text-[14px]">↗</span>
          </a>
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
