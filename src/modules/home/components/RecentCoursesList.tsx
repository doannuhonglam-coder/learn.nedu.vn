import { useNavigate } from 'react-router-dom'
import type { CourseSummary, CourseType } from '../../../shared/types'
import { Badge } from '../../../shared/components/ui/Badge'

interface RecentCoursesListProps {
  courses: CourseSummary[]
  onOpenCourse: (courseId: string) => void
}

const courseTypeConfig: Record<CourseType, { label: string; icon: string; variant: 'retreat' | 'cohort' | 'on-demand' | 'coaching' }> = {
  retreat: { label: 'Retreat', icon: '🌿', variant: 'retreat' },
  cohort: { label: 'Cohort', icon: '👥', variant: 'cohort' },
  on_demand: { label: 'On-demand', icon: '🎥', variant: 'on-demand' },
  coaching: { label: '1:1 Coaching', icon: '🤝', variant: 'coaching' },
}

export function RecentCoursesList({ courses, onOpenCourse }: RecentCoursesListProps) {
  const navigate = useNavigate()

  if (courses.length === 0) return null

  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-base text-brand-dark">Khoá Học Của Tôi</h3>
        <button onClick={() => navigate('/courses')} className="text-xs text-brand-gold font-medium">
          Xem tất cả →
        </button>
      </div>
      <div className="space-y-3">
        {courses.slice(0, 3).map((course) => {
          const config = courseTypeConfig[course.course_type]
          return (
            <button
              key={course.id}
              onClick={() => onOpenCourse(course.id)}
              className="w-full p-3 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors"
            >
              <Badge variant={config.variant}>
                {config.icon} {config.label}
              </Badge>
              <p className="text-sm font-medium text-brand-dark mt-1.5 truncate">{course.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{course.instructor_name}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
