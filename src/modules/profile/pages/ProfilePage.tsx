import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useProfile, useMetaphysical } from '../hooks/useProfile'
import { useHomeSummary } from '../../home/hooks/useHomeData'
import { ProfileHeader } from '../components/ProfileHeader'
import { NoisCommunitySection } from '../components/NoisCommunitySection'
import { MetaphysicalStrip } from '../components/MetaphysicalStrip'
import { MetaphysicalModal } from '../components/MetaphysicalModal'
import { ProfileInfoSection } from '../components/ProfileInfoSection'
import { ProfileSettingsRows } from '../components/ProfileSettingsRows'
import { ComingSoonSection } from '../components/ComingSoonSection'
import { CertificateModal } from '../../certificates/components/CertificateModal'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: metaphysical } = useMetaphysical()
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
        stats={{
          courses: homeSummary?.stats.active_courses || 0,
          certificates: homeSummary?.stats.certificates_count || 0,
          progress: homeSummary?.stats.completion_percent || 0,
        }}
        onCoursesClick={() => navigate('/courses')}
        onCertificatesClick={() => setCertModalOpen(true)}
      />

      <NoisCommunitySection noiStatus={homeSummary?.noi_status || null} />

      <MetaphysicalStrip
        profile={metaphysical || null}
        onOpen={() => setMetaModalOpen(true)}
      />

      <ProfileInfoSection profile={profile} />

      <ProfileSettingsRows email={profile.email} />

      <ComingSoonSection />

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
