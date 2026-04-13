import { useAuthStore } from '../../../shared/stores/auth.store'

export function NotifBadge() {
  const count = useAuthStore((s) => s.notifCount)

  if (count === 0) return null

  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  )
}
