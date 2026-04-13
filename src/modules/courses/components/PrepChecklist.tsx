import { useState } from 'react'
import type { PrepChecklistItem } from '../../../shared/types'

interface PrepChecklistProps {
  items: PrepChecklistItem[]
}

export function PrepChecklist({ items }: PrepChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(() =>
    new Set(items.filter((i) => i.is_checked).map((i) => i.id))
  )

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const completedCount = checked.size
  const totalCount = items.length

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        {completedCount}/{totalCount} hoàn thành
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors
              ${checked.has(item.id) ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
          >
            <input
              type="checkbox"
              checked={checked.has(item.id)}
              onChange={() => toggle(item.id)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${checked.has(item.id) ? 'text-gray-400 line-through' : 'text-brand-dark'}`}>
                {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
              )}
              {item.due_date && (
                <p className="text-[11px] text-gray-400 mt-1">
                  Hạn: {new Date(item.due_date).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
