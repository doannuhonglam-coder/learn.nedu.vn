import { useState } from 'react'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useProfile, useMetaphysical, useStreak } from '../hooks/useProfile'
import { useHomeSummary } from '../../home/hooks/useHomeData'
import { ProfileHeader } from '../components/ProfileHeader'
import { MetaphysicalStrip } from '../components/MetaphysicalStrip'
import { MetaphysicalModal } from '../components/MetaphysicalModal'
import { NoisCommunitySection } from '../components/NoisCommunitySection'
import { ProfileInfoSection } from '../components/ProfileInfoSection'
import { ProfileSettingsRows } from '../components/ProfileSettingsRows'
import { CertificateModal } from '../../certificates/components/CertificateModal'

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: metaphysical } = useMetaphysical()
  const { data: streak } = useStreak()
  const { data: homeSummary } = useHomeSummary()
  const [metaModalOpen, setMetaModalOpen] = useState(false)
  const [certModalOpen, setCertModalOpen] = useState(false)

  if (profileLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="pb-6">
      <ProfileHeader
        profile={profile}
        streak={streak || null}
        stats={{
          courses: homeSummary?.stats.active_courses || 0,
          certificates: homeSummary?.stats.certificates_count || 0,
          progress: homeSummary?.stats.completion_percent || 0,
        }}
        onCertificatesClick={() => setCertModalOpen(true)}
      />

      <MetaphysicalStrip
        profile={metaphysical || null}
        onOpen={() => setMetaModalOpen(true)}
      />

      <NoisCommunitySection noiStatus={homeSummary?.noi_status || null} />

      <ProfileInfoSection profile={profile} />

      <ProfileSettingsRows email={profile.email} />

      <MetaphysicalModal
        open={metaModalOpen}
        onClose={() => setMetaModalOpen(false)}
        profile={metaphysical || null}
        studentName={profile.full_name}
        studentCode={profile.student_code}
      />

      <CertificateModal open={certModalOpen} onClose={() => setCertModalOpen(false)} />
    </div>
  )
}
