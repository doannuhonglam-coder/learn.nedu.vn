import { useState, type FormEvent } from 'react'
import { Button } from '../../../shared/components/ui/Button'
import { toast } from '../../../shared/components/ui/Toast'
import { useSubmitPii } from '../hooks/useProfile'
import {
  BirthplaceAutocomplete,
  type BirthplaceValue,
} from './BirthplaceAutocomplete'
import type { PiiInput } from '../../../shared/types'

interface Props {
  onDone: () => void
}

// Wizard form collect dob/tob/pob/gender cho vault compute 5-hệ thống
// (BaZi · Tử Vi · Cửu Tinh · Thần Số · Cung Hoàng Đạo).
//
// Apple Simplicity: 4 field essential, 1 column, label rõ, validate on submit.
//   - dob (date input, required, DƯƠNG LỊCH — nhắc rõ vì người VN dễ nhầm
//     lịch âm; vault tự convert âm khi cần)
//   - tob (time input, optional — "không nhớ" OK)
//   - pob (BirthplaceAutocomplete — Mapbox v6 backed, có lat/lng inline)
//   - gender (radio nam/nữ, required)
//
// Trên 5 hệ tử vi/bát tự, lat/lng giúp vault chính xác giờ-mặt-trời cục bộ
// → khuyến khích chọn từ dropdown thay vì gõ tay. Free-text vẫn được accept.
const MIN_BIRTH_YEAR = 1900
const TODAY = new Date().toISOString().slice(0, 10)
export function PiiCollectionForm({ onDone }: Props) {
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [pob, setPob] = useState<BirthplaceValue>({
    text: '',
    lat: null,
    lng: null,
    place_id: null,
  })
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const submit = useSubmitPii()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!dob || !gender) {
      toast('Vui lòng nhập ngày sinh và giới tính', 'error')
      return
    }
    // Year sanity guard — input[type=date] đã restrict, vẫn double-check.
    const year = Number(dob.slice(0, 4))
    if (year < MIN_BIRTH_YEAR || year > new Date().getFullYear()) {
      toast('Năm sinh không hợp lệ', 'error')
      return
    }

    const input: PiiInput = {
      dob,
      tob: tob || null,
      pob: pob.text.trim() || null,
      gender,
      birth_lat: pob.lat,
      birth_lng: pob.lng,
    }
    try {
      const result = await submit.mutateAsync(input)
      if (result.is_available) {
        toast('Đã tạo xong hồ sơ siêu hình!', 'success')
      } else {
        toast('Đã lưu thông tin, đang phân tích...', 'success')
      }
      onDone()
    } catch {
      toast('Có lỗi xảy ra, vui lòng thử lại', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[12px] leading-relaxed"
        style={{ color: '#8B5A15' }}
      >
        Để phân tích chính xác hồ sơ siêu hình, cần đôi nét về ngày giờ sinh.
        Bạn chỉ phải nhập một lần — chúng tôi sẽ lưu lại.
      </div>

      <div>
        <label
          className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5 block"
          style={{ letterSpacing: '0.06em' }}
        >
          Ngày sinh (Dương Lịch) <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          min={`${MIN_BIRTH_YEAR}-01-01`}
          max={TODAY}
          required
          className="w-full px-3.5 py-3 text-[14px] text-ink rounded-xl"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid rgba(245,183,49,0.45)',
          }}
        />
        <p className="text-[11px] text-i3 mt-1">
          Theo lịch Tây (Dương Lịch). Nếu chỉ nhớ ngày âm, dùng app tra lịch
          để đổi sang dương trước khi nhập.
        </p>
      </div>

      <div>
        <label
          className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5 block"
          style={{ letterSpacing: '0.06em' }}
        >
          Giờ sinh{' '}
          <span className="text-[10px] text-i3 normal-case">
            · không bắt buộc
          </span>
        </label>
        <input
          type="time"
          value={tob}
          onChange={(e) => setTob(e.target.value)}
          className="w-full px-3.5 py-3 text-[14px] text-ink rounded-xl"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid rgba(245,183,49,0.45)',
          }}
        />
        <p className="text-[11px] text-i3 mt-1">
          Bỏ trống nếu bạn không nhớ. Có giờ sinh thì BaZi + Tử Vi chính xác hơn.
        </p>
      </div>

      <div>
        <label
          className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5 block"
          style={{ letterSpacing: '0.06em' }}
        >
          Nơi sinh{' '}
          <span className="text-[10px] text-i3 normal-case">
            · không bắt buộc
          </span>
        </label>
        <BirthplaceAutocomplete value={pob} onChange={setPob} />
        <p className="text-[11px] text-i3 mt-1">
          Chọn từ gợi ý để hệ thống biết toạ độ — Tử Vi tính giờ địa phương
          chính xác hơn. Nếu không thấy, gõ tay cũng được.
        </p>
      </div>

      <div>
        <label
          className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5 block"
          style={{ letterSpacing: '0.06em' }}
        >
          Giới tính <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`flex-1 py-3 rounded-xl text-[13px] font-semibold transition-colors ${
              gender === 'male'
                ? 'bg-ink text-gold'
                : 'bg-surface text-i2 border border-border'
            }`}
          >
            Nam
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`flex-1 py-3 rounded-xl text-[13px] font-semibold transition-colors ${
              gender === 'female'
                ? 'bg-ink text-gold'
                : 'bg-surface text-i2 border border-border'
            }`}
          >
            Nữ
          </button>
        </div>
      </div>

      <Button
        className="w-full"
        type="submit"
        loading={submit.isPending}
      >
        {submit.isPending ? 'Đang phân tích…' : 'Tạo hồ sơ siêu hình'}
      </Button>
    </form>
  )
}
