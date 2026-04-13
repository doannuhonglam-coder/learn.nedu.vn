import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'
import { NotifModal } from '../../../modules/notifications/components/NotifModal'

export function AppShell() {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="min-h-screen max-w-[420px] mx-auto bg-white">
      <Topbar onNotifClick={() => setNotifOpen(true)} />
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
      <NotifModal open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  )
}
