import { SquircleIcon } from './SquircleIcon'

interface AccountSectionProps {
  onOpenSettings: () => void
  onOpenSupport: () => void
}

export function AccountSection({
  onOpenSettings,
  onOpenSupport,
}: AccountSectionProps) {
  return (
    <div className="px-4 mt-5">
      <div
        className="font-mono text-[11px] font-bold uppercase text-i3 mb-2 px-1"
        style={{ letterSpacing: '0.08em' }}
      >
        Tài Khoản
      </div>

      <div
        className="bg-surface rounded-[14px]"
        style={{ border: '1px solid rgba(26,24,22,0.10)' }}
      >
        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors rounded-t-[14px]"
        >
          <SquircleIcon kind="gear" size={32} />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">Cài đặt</div>
            <div className="text-[11px] text-i3 mt-0.5 truncate">
              Email · SĐT · Mật khẩu · Thông báo
            </div>
          </div>
          <span className="text-i3 text-[16px]">›</span>
        </button>

        <div style={{ borderTop: '1px solid rgba(26,24,22,0.08)' }} />

        {/* Support */}
        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-s2 transition-colors rounded-b-[14px]"
        >
          <SquircleIcon kind="chat" size={32} />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink">Liên hệ Nedu</div>
            <div className="text-[11px] text-i3 mt-0.5 truncate">
              Zalo · Email · Hotline 1800 NEDU
            </div>
          </div>
          <span className="text-i3 text-[16px]">›</span>
        </button>
      </div>
    </div>
  )
}
