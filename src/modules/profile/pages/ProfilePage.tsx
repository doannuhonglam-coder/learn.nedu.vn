import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useProfile, useMetaphysical, useStreak } from '../hooks/useProfile'
import { useHomeSummary } from '../../home/hooks/useHomeData'
import { useAuthStore } from '../../../shared/stores/auth.store'
import { ProfileHeader } from '../components/ProfileHeader'
import { NoisCommunitySection } from '../components/NoisCommunitySection'
import { JourneySection } from '../components/JourneySection'
import { AccountSection } from '../components/AccountSection'
import { MetaphysicalModal } from '../components/MetaphysicalModal'
import { SettingsModal } from '../components/SettingsModal'
import { SupportModal } from '../components/SupportModal'
import { StreakModal } from '../components/StreakModal'
import { CertificateModal } from '../../certificates/components/CertificateModal'

export default function ProfilePage() {
  const navigate = useNavigate()
  const clearSession = useAuthStore((s) => s.clearSession)
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: metaphysical } = useMetaphysical()
  const { data: streak } = useStreak()
  const { data: homeSummary } = useHomeSummary()
  const [metaModalOpen, setMetaModalOpen] = useState(false)
  const [certModalOpen, setCertModalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [streakOpen, setStreakOpen] = useState(false)

  const handleLogout = () => {
    if (confirm('Đăng xuất?')) {
      clearSession()
      navigate('/login', { replace: true })
    }
  }

  if (profileLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const streakDays = (streak?.current_streak_weeks || 0) * 7 + 7 // approx

  return (
    <div className="pb-6">
      <ProfileHeader
        profile={profile}
        stats={{
          courses: homeSummary?.stats.active_courses || 0,
          certificates: homeSummary?.stats.certificates_count || 0,
          progress: homeSummary?.stats.completion_percent || 0,
        }}
        onCoursesClick={() => navigate('/courses')}
        onCertificatesClick={() => setCertModalOpen(true)}
      />

      <NoisCommunitySection noiStatus={homeSummary?.noi_status || null} />

      <JourneySection
        metaphysical={metaphysical || null}
        streakDays={streakDays}
        onOpenBaZi={() => setMetaModalOpen(true)}
        onOpenCertificates={() => setCertModalOpen(true)}
        onOpenStreak={() => setStreakOpen(true)}
      />

      <AccountSection
        pendingPayment={homeSummary?.pending_payment || null}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSupport={() => setSupportOpen(true)}
      />

      {/* Logout */}
      <div className="px-4 mt-5">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-[14px] text-[14px] font-semibold transition-colors"
          style={{
            background: '#FFFFFF',
            color: '#1A1816',
            border: '1.5px solid rgba(26,24,22,0.10)',
          }}
        >
          Đăng xuất
        </button>
      </div>

      {/* Modals */}
      <MetaphysicalModal
        open={metaModalOpen}
        onClose={() => setMetaModalOpen(false)}
        profile={metaphysical || null}
        studentName={profile.full_name ?? ''}
        studentCode={profile.student_code}
      />
      <CertificateModal open={certModalOpen} onClose={() => setCertModalOpen(false)} />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
      />
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <StreakModal
        open={streakOpen}
        onClose={() => setStreakOpen(false)}
        currentStreakDays={streakDays}
      />
    </div>
  )
}
