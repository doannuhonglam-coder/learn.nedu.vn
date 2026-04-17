import { useAuthStore } from '../../../shared/stores/auth.store'

export function NotifBadge() {
  const count = useAuthStore((s) => s.notifCount)

  if (count === 0) return null

  return (
    <span
      className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full"
      style={{ background: '#C0392B', border: '1.5px solid #FAFAF8' }}
    />
  )
}
