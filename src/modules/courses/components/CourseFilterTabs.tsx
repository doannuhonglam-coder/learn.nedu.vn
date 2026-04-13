type FilterKey = 'all' | 'active' | 'on_demand' | 'completed'

interface CourseFilterTabsProps {
  activeFilter: FilterKey
  onFilterChange: (filter: FilterKey) => void
  counts: Record<FilterKey, number>
}

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang học' },
  { key: 'on_demand', label: 'On-demand' },
  { key: 'completed', label: 'Đã xong' },
]

export function CourseFilterTabs({ activeFilter, onFilterChange, counts }: CourseFilterTabsProps) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
            ${activeFilter === f.key
              ? 'bg-brand-dark text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {f.label} ({counts[f.key]})
        </button>
      ))}
    </div>
  )
}

export type { FilterKey }
