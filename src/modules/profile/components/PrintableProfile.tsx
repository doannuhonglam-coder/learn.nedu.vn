import type { MetaphysicalProfile } from '../../../shared/types'

interface Props {
  profile: MetaphysicalProfile
  studentName: string
  studentCode: string | null
}

interface FacetRow {
  key: 'bat_tu' | 'cuu_tinh' | 'tu_vi' | 'than_so_hoc' | 'cung_hoang_dao'
  title: string
  subtitle: string
}

const FACETS: FacetRow[] = [
  { key: 'bat_tu', title: 'BÁT TỰ · TỨ TRỤ', subtitle: 'Ngũ hành ngày sinh' },
  { key: 'tu_vi', title: 'TỬ VI · MỆNH CỤC', subtitle: 'Đẩu số cung Mệnh · Thân' },
  { key: 'than_so_hoc', title: 'THẦN SỐ HỌC', subtitle: 'Con số chủ đạo' },
  { key: 'cuu_tinh', title: 'CỬU TINH · NINE STAR KI', subtitle: 'Năng lượng cá nhân' },
  { key: 'cung_hoang_dao', title: 'CUNG HOÀNG ĐẠO', subtitle: 'Astrology · Sun / Moon / Rising' },
]

/**
 * PrintableProfile — A4 portrait layout cho window.print() save-as-PDF.
 *
 * Design quy tắc (Apple Print Quality):
 *   - Hide trong normal render (.hidden print:block) — chỉ visible khi browser
 *     enter print media query.
 *   - `-webkit-print-color-adjust: exact` ép browser render đúng brand color
 *     (mặc định Chrome strip background colors khi print để tiết kiệm mực).
 *   - A4 portrait fixed width 794px (~210mm @ 96dpi) — đảm bảo layout không
 *     scale weird khi printer adjust.
 *   - Font: sans-serif system fallback (browser native Vietnamese, không cần
 *     embed). Heading dùng serif accent cho cảm giác tài liệu.
 *
 * Migrate Phase 2: BE generate via Puppeteer/Playwright server-side + R2
 * store + signed_url. FE call site đổi `window.print()` → fetch GET PDF blob.
 * Layout markup này có thể reuse cho BE template (puppeteer.setContent).
 */
export function PrintableProfile({ profile, studentName, studentCode }: Props) {
  const summary = profile.facets.summary as
    | {
        core_personality?: string
        communication_dos?: string[]
        communication_donts?: string[]
        real_need?: string
        timing_2026?: string
        opening_suggestion?: string
      }
    | null

  const issuedDate = profile.cached_at
    ? new Date(profile.cached_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

  return (
    <div
      id="printable-profile"
      className="hidden print:block fixed inset-0 z-[9999] bg-white text-black"
      style={{
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}
    >
      <div
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          padding: '18mm 16mm',
          background: '#FFFFFF',
          color: '#1A1816',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 12,
            borderBottom: '2px solid #1A1816',
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>
              nedu<span style={{ color: '#D4920A' }}>·</span>learn
            </div>
            <div
              style={{
                fontSize: 9,
                color: '#6B635A',
                marginTop: 2,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Hồ sơ siêu hình học · 5 hệ thống
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#6B635A' }}>Cấp ngày</div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>
              {issuedDate}
            </div>
          </div>
        </div>

        {/* Student */}
        <div
          style={{
            background: '#FEF4D6',
            border: '1px solid #F5B73140',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: '#8B5A15',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Học viên
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>
            {studentName}
          </div>
          {studentCode && (
            <div style={{ fontSize: 11, color: '#6B635A', marginTop: 1 }}>
              Mã học viên: {studentCode}
            </div>
          )}
        </div>

        {/* Core personality */}
        {summary?.core_personality && (
          <Section title="Đặc tính cốt lõi" titleColor="#8B5A15">
            <p style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {summary.core_personality}
            </p>
          </Section>
        )}

        {/* 5 facets — 2 col grid */}
        <Section title="Tổng quan 5 hệ thống">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginTop: 4,
            }}
          >
            {FACETS.map((f) => {
              const data = profile.facets[f.key]
              return (
                <FacetCard
                  key={f.key}
                  title={f.title}
                  subtitle={f.subtitle}
                  data={data}
                />
              )
            })}
          </div>
        </Section>

        {/* Communication */}
        {(summary?.communication_dos?.length || summary?.communication_donts?.length) ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 16,
            }}
          >
            {summary.communication_dos && summary.communication_dos.length > 0 && (
              <ListBlock
                title="✓ Nên giao tiếp"
                items={summary.communication_dos}
                tint="#16A34A"
                bg="#F0FDF4"
              />
            )}
            {summary.communication_donts && summary.communication_donts.length > 0 && (
              <ListBlock
                title="✗ Tránh"
                items={summary.communication_donts}
                tint="#C0392B"
                bg="#FDECEA"
              />
            )}
          </div>
        ) : null}

        {/* Real need + timing 2026 */}
        {summary?.real_need && (
          <Section title="Nhu cầu sâu thẳm">
            <p style={{ fontSize: 12, lineHeight: 1.6 }}>{summary.real_need}</p>
          </Section>
        )}
        {summary?.timing_2026 && (
          <Section title="Thời gian 2026">
            <p style={{ fontSize: 12, lineHeight: 1.6 }}>{summary.timing_2026}</p>
          </Section>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 12,
            borderTop: '1px solid #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 9,
            color: '#9C9690',
          }}
        >
          <div>© Nedu Education · Tài liệu nội bộ học viên</div>
          <div>learn.nedu.vn</div>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  titleColor,
  children,
}: {
  title: string
  titleColor?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: titleColor ?? '#1A1816',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function FacetCard({
  title,
  subtitle,
  data,
}: {
  title: string
  subtitle: string
  data: Record<string, unknown> | null
}) {
  return (
    <div
      style={{
        border: '1px solid #E5E5E5',
        borderRadius: 6,
        padding: '10px 12px',
        background: data ? '#FAFAF8' : '#F5F3EF',
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: '#1A1816',
        }}
      >
        {title}
      </div>
      <div
        style={{ fontSize: 9, color: '#6B635A', marginTop: 1, marginBottom: 6 }}
      >
        {subtitle}
      </div>
      {data ? (
        <div style={{ fontSize: 11, lineHeight: 1.5 }}>
          {Object.entries(data)
            .filter(([k]) => k !== 'label')
            .map(([k, v]) => (
              <div key={k} style={{ marginBottom: 2 }}>
                <span style={{ color: '#8A8480' }}>{k}: </span>
                <span style={{ color: '#1A1816', fontWeight: 600 }}>
                  {String(v)}
                </span>
              </div>
            ))}
        </div>
      ) : (
        <div style={{ fontSize: 10, color: '#9C9690', fontStyle: 'italic' }}>
          Đang phân tích...
        </div>
      )}
    </div>
  )
}

function ListBlock({
  title,
  items,
  tint,
  bg,
}: {
  title: string
  items: string[]
  tint: string
  bg: string
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${tint}30`,
        borderRadius: 6,
        padding: '10px 12px',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: tint,
          marginBottom: 6,
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 11, lineHeight: 1.55, marginBottom: 3 }}>
            • {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
