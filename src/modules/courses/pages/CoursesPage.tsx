import { useState, useMemo } from 'react'
import { Spinner } from '../../../shared/components/ui/Spinner'
import { useCourses } from '../hooks/useCourses'
import { CourseFilterTabs, type FilterKey } from '../components/CourseFilterTabs'
import { CourseCard } from '../components/CourseCard'
import { CourseModal } from '../components/CourseModal'

export default function CoursesPage() {
  const { data: courses, isLoading } = useCourses()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [initialTab, setInitialTab] = useState<string | undefined>()

  // BE list trả cả active + completed (filter pending/cancelled). FE derive
  // completed = progress_percent === 100.
  const counts = useMemo(() => {
    if (!courses) return { all: 0, active: 0, on_demand: 0, completed: 0 }
    return {
      all: courses.length,
      active: courses.filter((c) => c.progress_percent < 100).length,
      on_demand: courses.filter((c) => c.course_type === 'on_demand').length,
      completed: courses.filter((c) => c.progress_percent >= 100).length,
    }
  }, [courses])

  const filtered = useMemo(() => {
    if (!courses) return []
    let result = [...courses]
    switch (filter) {
      case 'active':
        result = result.filter((c) => c.progress_percent < 100)
        break
      case 'on_demand':
        result = result.filter((c) => c.course_type === 'on_demand')
        break
      case 'completed':
        result = result.filter((c) => c.progress_percent >= 100)
        break
    }
    // Active (incomplete) first, completed last. BE đã pre-sort theo activated_at.
    return result.sort((a, b) => {
      const aDone = a.progress_percent >= 100
      const bDone = b.progress_percent >= 100
      if (!aDone && bDone) return -1
      if (aDone && !bDone) return 1
      return 0
    })
  }, [courses, filter])

  const handleOpenCourse = (runId: string, tab?: string) => {
    setSelectedRunId(runId)
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
          filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpenCourse={handleOpenCourse}
            />
          ))
        )}
      </div>

      <CourseModal
        runId={selectedRunId}
        initialTab={initialTab}
        onClose={() => { setSelectedRunId(null); setInitialTab(undefined) }}
      />
    </div>
  )
}
