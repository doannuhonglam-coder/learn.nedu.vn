import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'
import { NotifModal } from '../../../modules/notifications/components/NotifModal'
import { useMe } from '../../hooks/useMe'
import { useAuthStore } from '../../stores/auth.store'

export function AppShell() {
  const [notifOpen, setNotifOpen] = useState(false)

  // Hydrate auth store từ /api/learn/me. auth-central /auth/me trả full_name
  // null khi vault canonical PII không sync với local persons → CallbackPage
  // setSession lưu null vào store, Topbar avatar fallback initials "?".
  // /api/learn/me là source-of-truth có full_name từ users table (set lúc
  // payment.controller.create từ customer.full_name).
  const { data: me } = useMe()
  const updateUser = useAuthStore((s) => s.updateUser)
  useEffect(() => {
    if (!me) return
    updateUser({
      full_name: me.full_name,
      avatar_url: me.avatar_url,
      student_code: me.learner_state?.student_code ?? null,
      consultant_name: me.learner_state?.consultant_name ?? null,
      activated_at: me.learner_state?.activated_at ?? null,
    })
  }, [me, updateUser])

  return (
    <div className="min-h-screen max-w-[420px] mx-auto" style={{ background: '#FAFAF8' }}>
      <Topbar onNotifClick={() => setNotifOpen(true)} />
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <NotifModal open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  )
}
