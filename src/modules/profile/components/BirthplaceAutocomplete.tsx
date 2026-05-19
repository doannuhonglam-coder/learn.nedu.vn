import { useCallback, useEffect, useRef, useState } from 'react'
import {
  profileService,
  type PlaceSuggestion,
} from '../services/profile.service'

export interface BirthplaceValue {
  text: string
  lat: number | null
  lng: number | null
  place_id: string | null
}

interface Props {
  value: BirthplaceValue
  onChange: (value: BirthplaceValue) => void
  placeholder?: string
}

/**
 * Birthplace autocomplete — proxy qua BE `GET /api/learn/places/autocomplete`
 * (Mapbox token server-side). Pattern theo hieucon.vn: debounce 300ms,
 * abort signal cho query trước, dropdown render lat/lng-aware suggestion.
 *
 * Free-text fallback: nếu user gõ thẳng không chọn dropdown, vẫn save dưới
 * dạng `{ text, lat: null, lng: null, place_id: null }`. Vault compute
 * accept cả 2 case (lat/lng optional).
 */
export function BirthplaceAutocomplete({
  value,
  onChange,
  placeholder = 'VD: Hà Nội, TP HCM, Đà Nẵng',
}: Props) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  // Click-outside → close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  const handleType = useCallback(
    (text: string) => {
      onChange({ text, lat: null, lng: null, place_id: null })
      if (text.trim().length < 2) {
        setSuggestions([])
        setOpen(false)
        setLoading(false)
        return
      }
      if (debounceRef.current) clearTimeout(debounceRef.current)
      abortRef.current?.abort()
      setLoading(true)
      debounceRef.current = setTimeout(async () => {
        const ctrl = new AbortController()
        abortRef.current = ctrl
        try {
          const res = await profileService.searchPlaces(text.trim(), ctrl.signal)
          if (ctrl.signal.aborted) return
          setSuggestions(res.suggestions)
          setOpen(res.suggestions.length > 0)
        } catch (err) {
          if ((err as { name?: string })?.name === 'AbortError') return
          setSuggestions([])
          setOpen(false)
        } finally {
          if (!ctrl.signal.aborted) setLoading(false)
        }
      }, 300)
    },
    [onChange],
  )

  const handleSelect = useCallback(
    (s: PlaceSuggestion) => {
      const display = s.secondary ? `${s.text}, ${s.secondary}` : s.text
      onChange({
        text: display,
        lat: s.lat,
        lng: s.lng,
        place_id: s.place_id,
      })
      setOpen(false)
      setSuggestions([])
    },
    [onChange],
  )

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value.text}
        onChange={(e) => handleType(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-3.5 py-3 text-[14px] text-ink rounded-xl"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid rgba(245,183,49,0.45)',
        }}
      />

      {open && suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
          style={{
            border: '1px solid rgba(26,24,22,0.10)',
            boxShadow: '0 8px 24px rgba(26,24,22,0.12)',
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50 transition-colors border-b border-gray-50 last:border-b-0"
            >
              <div className="text-[14px] text-ink font-medium">{s.text}</div>
              {s.secondary && (
                <div className="text-[11px] text-i3 mt-0.5">{s.secondary}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {loading && value.text.trim().length >= 2 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-i3">
          Đang tìm…
        </div>
      )}
    </div>
  )
}
