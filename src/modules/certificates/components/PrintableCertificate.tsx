import type { CertificateSummary } from '../../../shared/types'

interface Props {
  certificate: CertificateSummary
  studentName: string
}

/**
 * PrintableCertificate — A4 portrait giấy chứng nhận hoàn thành khoá học.
 *
 * Design phỏng theo giấy chứng nhận corporate (Apple/IBM/Coursera):
 *   - Ornate gold border outer frame
 *   - Center vertical alignment
 *   - Large script/serif "Certificate of Completion" title
 *   - Student name as the largest typographic element
 *   - Course name + cert metadata
 *   - Date + signature line
 *
 * Migrate Phase 2: BE template render qua Puppeteer + R2 store. Layout
 * markup này reuse được trực tiếp cho server-side (puppeteer.setContent).
 *
 * `WebkitPrintColorAdjust: exact` ép Chrome render đúng brand color khi print
 * (mặc định strip background colors để tiết kiệm mực).
 */
export function PrintableCertificate({ certificate, studentName }: Props) {
  const issuedDate = certificate.issued_at
    ? new Date(certificate.issued_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })

  return (
    <div
      id="printable-certificate"
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
          padding: '14mm',
          background: '#FFFFFF',
          color: '#1A1816',
          boxSizing: 'border-box',
        }}
      >
        {/* Outer ornate frame */}
        <div
          style={{
            border: '2px solid #D4920A',
            padding: 18,
            borderRadius: 8,
            minHeight: 'calc(297mm - 28mm)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Inner thin gold border for depth */}
          <div
            style={{
              border: '1px solid #F5B73160',
              padding: '32px 28px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center',
            }}
          >
            {/* Top — brand */}
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                nedu<span style={{ color: '#D4920A' }}>·</span>learn
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: '#8A6A00',
                  marginTop: 6,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Nedu Education
              </div>
            </div>

            {/* Middle — main certificate body */}
            <div style={{ width: '100%' }}>
              <div
                style={{
                  fontSize: 11,
                  color: '#6B635A',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                  fontWeight: 600,
                }}
              >
                Chứng nhận hoàn thành
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: '#4A4540',
                  marginBottom: 14,
                  fontStyle: 'italic',
                }}
              >
                Chứng nhận rằng
              </div>

              {/* Student name — hero element */}
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: '#1A1816',
                  letterSpacing: '-0.015em',
                  marginBottom: 4,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  lineHeight: 1.15,
                }}
              >
                {studentName}
              </div>

              {/* Gold underline accent */}
              <div
                style={{
                  width: 240,
                  height: 2,
                  background:
                    'linear-gradient(90deg, transparent, #D4920A, transparent)',
                  margin: '12px auto 20px',
                }}
              />

              <div
                style={{
                  fontSize: 14,
                  color: '#4A4540',
                  marginBottom: 12,
                }}
              >
                đã hoàn thành xuất sắc khoá học
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#1A1816',
                  marginBottom: 4,
                  fontFamily: '"Playfair Display", Georgia, serif',
                }}
              >
                {certificate.title}
              </div>
              <div style={{ fontSize: 13, color: '#6B635A' }}>
                {certificate.course_name}
              </div>
            </div>

            {/* Bottom — meta + signature */}
            <div style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  marginTop: 28,
                }}
              >
                {/* Date */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      borderBottom: '1px solid #1A1816',
                      paddingBottom: 4,
                      marginBottom: 4,
                      width: '70%',
                      margin: '0 auto 4px',
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {issuedDate}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: '#8A8480',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Ngày cấp
                  </div>
                </div>

                {/* Cert number */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  {/* Gold seal placeholder — circular */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      border: '2px solid #D4920A',
                      margin: '0 auto 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#FEF4D6',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        color: '#8B5A15',
                        letterSpacing: '0.06em',
                        fontWeight: 700,
                      }}
                    >
                      NEDU
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: '#8B5A15',
                        fontWeight: 700,
                        marginTop: 1,
                      }}
                    >
                      ★
                    </div>
                    <div
                      style={{
                        fontSize: 6,
                        color: '#8B5A15',
                        letterSpacing: '0.06em',
                        fontWeight: 600,
                      }}
                    >
                      EDUCATION
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      borderBottom: '1px solid #1A1816',
                      paddingBottom: 4,
                      marginBottom: 4,
                      width: '70%',
                      margin: '0 auto 4px',
                      fontFamily: '"Playfair Display", Georgia, cursive',
                      fontStyle: 'italic',
                      fontSize: 16,
                      color: '#4A4540',
                    }}
                  >
                    Nhi Le
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: '#8A8480',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Founder · Nedu
                  </div>
                </div>
              </div>

              {/* Cert number footer */}
              {certificate.certificate_no && (
                <div
                  style={{
                    marginTop: 18,
                    fontSize: 9,
                    color: '#9C9690',
                    letterSpacing: '0.06em',
                    textAlign: 'center',
                  }}
                >
                  Mã chứng chỉ: <strong style={{ color: '#6B635A' }}>{certificate.certificate_no}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verify URL */}
        <div
          style={{
            marginTop: 6,
            fontSize: 8,
            color: '#9C9690',
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          Verify tại learn.nedu.vn · © Nedu Education
        </div>
      </div>
    </div>
  )
}
