import { useState, useEffect, useRef } from 'react'
import { coursesService } from '../services/courses.service'

interface LessonNoteEditorProps {
  lessonId: string
  initialContent: string | null
}

export function LessonNoteEditor({ lessonId, initialContent }: LessonNoteEditorProps) {
  const [content, setContent] = useState(initialContent || '')
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setContent(initialContent || '')
  }, [initialContent, lessonId])

  const handleChange = (value: string) => {
    setContent(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        await coursesService.saveLessonNotes(lessonId, value)
      } catch {
        // silently fail
      }
      setSaving(false)
    }, 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-500">Ghi chú cá nhân</label>
        {saving && <span className="text-[10px] text-gray-400">Đang lưu...</span>}
      </div>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Ghi chú của bạn cho bài học này..."
        rows={4}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
      />
    </div>
  )
}
