import { useState, useMemo } from 'react'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useEnrollments } from '../hooks/useCourses'
import { CourseFilterTabs, type FilterKey } from '../components/CourseFilterTabs'
import { CourseCard } from '../components/CourseCard'
import { CourseModal } from '../components/CourseModal'

export default function CoursesPage() {
  const { data: enrollments, isLoading } = useEnrollments()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [initialTab, setInitialTab] = useState<string | undefined>()

  const counts = useMemo(() => {
    if (!enrollments) return { all: 0, active: 0, on_demand: 0, completed: 0 }
    return {
      all: enrollments.length,
      active: enrollments.filter((e) => e.status === 'active').length,
      on_demand: enrollments.filter((e) => e.course.course_type === 'on_demand').length,
      completed: enrollments.filter((e) => e.status === 'completed').length,
    }
  }, [enrollments])

  const filtered = useMemo(() => {
    if (!enrollments) return []
    let result = [...enrollments]
    switch (filter) {
      case 'active':
        result = result.filter((e) => e.status === 'active')
        break
      case 'on_demand':
        result = result.filter((e) => e.course.course_type === 'on_demand')
        break
      case 'completed':
        result = result.filter((e) => e.status === 'completed')
        break
    }
    // Sort: active first, completed last
    return result.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1
      if (a.status !== 'active' && b.status === 'active') return 1
      return 0
    })
  }, [enrollments, filter])

  const handleOpenCourse = (courseId: string, tab?: string) => {
    setSelectedCourseId(courseId)
    setInitialTab(tab)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 pb-1">
        <h2 className="font-display font-semibold text-xl text-brand-dark">Khoá Học</h2>
      </div>

      <CourseFilterTabs activeFilter={filter} onFilterChange={setFilter} counts={counts} />

      <div className="px-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Không có khoá học nào</p>
        ) : (
          filtered.map((enrollment) => (
            <CourseCard
              key={enrollment.id}
              enrollment={enrollment}
              onOpenCourse={handleOpenCourse}
            />
          ))
        )}
      </div>

      <CourseModal
        courseId={selectedCourseId}
        initialTab={initialTab}
        onClose={() => { setSelectedCourseId(null); setInitialTab(undefined) }}
      />
    </div>
  )
}
