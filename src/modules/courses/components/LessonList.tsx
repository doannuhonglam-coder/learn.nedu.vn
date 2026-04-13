import { useState } from 'react'
import type { ModuleSummary, LessonSummary } from '../../../shared/types'
import { LessonItem } from './LessonItem'

interface LessonListProps {
  modules: ModuleSummary[]
  lessons: LessonSummary[]
  onSelectLesson: (lessonId: string) => void
}

export function LessonList({ modules, lessons, onSelectLesson }: LessonListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const current = modules.find((m) => !m.is_locked && m.lessons_completed < m.lessons_count)
    return new Set(current ? [current.id] : modules.length > 0 ? [modules[0].id] : [])
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  // Assign lessons to modules based on order_index ranges
  const lessonsPerModule = Math.ceil(lessons.length / Math.max(modules.length, 1))

  return (
    <div className="space-y-2">
      {modules.map((mod, modIndex) => {
        const isExpanded = expandedModules.has(mod.id)
        const moduleLessons = lessons.slice(modIndex * lessonsPerModule, (modIndex + 1) * lessonsPerModule)
        const firstIncomplete = moduleLessons.find((l) => !l.is_completed && !l.is_locked)

        return (
          <div key={mod.id} className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-brand-dark truncate">{mod.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {mod.lessons_completed}/{mod.lessons_count} bài
                  {mod.is_locked && ' · 🔒'}
                </p>
              </div>
              <span className={`text-gray-400 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {isExpanded && (
              <div className="px-1 py-1">
                {moduleLessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    isCurrent={firstIncomplete?.id === lesson.id}
                    onSelect={onSelectLesson}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
