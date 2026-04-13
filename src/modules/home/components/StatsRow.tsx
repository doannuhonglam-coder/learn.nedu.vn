import { useNavigate } from 'react-router-dom'

interface StatsRowProps {
  activeCourses: number
  completionPercent: number
  certificatesCount: number
  onCertificatesClick: () => void
}

export function StatsRow({ activeCourses, completionPercent, certificatesCount, onCertificatesClick }: StatsRowProps) {
  const navigate = useNavigate()

  const stats = [
    { label: 'Khoá học', value: activeCourses, onClick: () => navigate('/courses') },
    { label: 'Hoàn thành', value: `${completionPercent}%`, onClick: () => navigate('/courses') },
    { label: 'Chứng chỉ', value: certificatesCount, onClick: onCertificatesClick },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 px-4 mt-4">
      {stats.map((stat) => (
        <button
          key={stat.label}
          onClick={stat.onClick}
          className="bg-gray-50 rounded-xl py-3 px-2 text-center hover:bg-gray-100 transition-colors"
        >
          <p className="text-xl font-bold text-brand-dark">{stat.value}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
        </button>
      ))}
    </div>
  )
}
