import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { toast } from '../../../shared/components/ui/Toast'
import { assignmentsService } from '../services/assignments.service'
import type { AssignmentDetail } from '../../../shared/types'

interface SubmitModalProps {
  assignment: AssignmentDetail | null
  onClose: () => void
}

export function SubmitModal({ assignment, onClose }: SubmitModalProps) {
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  // BE accept content?, file_url? — at least 1 required. FE gửi đúng trường có:
  // text-only → content; file-only → file_url; cả 2 → cả 2.
  const submitMutation = useMutation({
    mutationFn: () => {
      const trimmed = content.trim()
      return assignmentsService.submitAssignment(assignment!.id, {
        content: trimmed.length > 0 ? trimmed : undefined,
        file_url: file ? URL.createObjectURL(file) : undefined,
      })
    },
    onSuccess: () => {
      toast('Đã nộp bài thành công!', 'success')
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      setContent('')
      setFile(null)
      onClose()
    },
    onError: () => {
      toast('Có lỗi xảy ra, vui lòng thử lại', 'error')
    },
  })

  const canSubmit = content.trim().length > 0 || file !== null

  if (!assignment) return null

  const hasSubmission = !!assignment.submission
  const dueDate = new Date(assignment.due_date)
  const now = new Date()
  const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const maxBytes = assignment.max_file_size_mb * 1024 * 1024
    if (f.size > maxBytes) {
      toast(`File vượt quá ${assignment.max_file_size_mb}MB`, 'error')
      return
    }
    setFile(f)
  }

  return (
    <BottomSheet open={!!assignment} onClose={onClose} title={assignment.title}>
      <div className="space-y-4">
        {/* Hạn nộp pill */}
        <div
          className="rounded-xl px-3.5 py-2.5 flex items-center gap-2"
          style={{
            background: '#FDECEA',
            border: '1px solid rgba(185,79,46,0.20)',
          }}
        >
          <span className="text-[14px]">⏰</span>
          <span className="text-[12px] font-semibold" style={{ color: '#C0392B' }}>
            Hạn nộp: {dueDate.toLocaleDateString('vi-VN')}
            {daysLeft > 0 && ` · Còn ${daysLeft} ngày`}
            {daysLeft <= 0 && ' · Quá hạn'}
          </span>
        </div>

        {/* Requirements */}
        <div>
          <div
            className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5"
            style={{ letterSpacing: '0.06em' }}
          >
            Yêu cầu bài tập
          </div>
          <div
            className="rounded-xl px-3.5 py-3 text-[13px] text-i2"
            style={{
              background: '#FEF4D6',
              border: '1px solid rgba(245,183,49,0.25)',
              lineHeight: 1.55,
            }}
          >
            {assignment.description}
          </div>
        </div>

        {/* Graded submission view */}
        {hasSubmission && assignment.submission && (
          <>
            <div>
              <div
                className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5"
                style={{ letterSpacing: '0.06em' }}
              >
                Bài đã nộp
              </div>
              <div
                className="rounded-xl px-3.5 py-3 text-[13px] text-i2"
                style={{
                  background: '#F0FDF4',
                  border: '1px solid rgba(34,197,94,0.20)',
                  lineHeight: 1.55,
                }}
              >
                <div className="text-[11px] font-semibold mb-1" style={{ color: '#16A34A' }}>
                  ✓ Đã nộp lúc{' '}
                  {new Date(assignment.submission.submitted_at).toLocaleDateString('vi-VN')}
                </div>
                {assignment.submission.content}
              </div>
            </div>

            {assignment.submission.grade !== null && (
              <div
                className="rounded-xl px-3.5 py-3"
                style={{
                  background: '#FEF4D6',
                  border: '1px solid rgba(245,183,49,0.30)',
                }}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span
                    className="font-mono text-[10px] font-semibold uppercase"
                    style={{ color: '#8B5A15', letterSpacing: '0.06em' }}
                  >
                    Điểm
                  </span>
                  <span
                    className="font-display text-[20px] font-bold"
                    style={{ color: '#D4920A' }}
                  >
                    {assignment.submission.grade}/10
                  </span>
                </div>
                {assignment.submission.feedback && (
                  <p className="text-[12px] text-i2 leading-relaxed mt-2">
                    {assignment.submission.feedback}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Submission form */}
        {!hasSubmission && (
          <>
            <div>
              <div
                className="font-mono text-[10px] font-semibold uppercase text-i3 mb-1.5"
                style={{ letterSpacing: '0.06em' }}
              >
                Bài làm của bạn
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết câu trả lời của bạn tại đây..."
                rows={6}
                className="w-full px-3.5 py-3 text-[13px] text-ink rounded-xl resize-none focus:outline-none transition-colors"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(245,183,49,0.45)',
                  lineHeight: 1.55,
                }}
                onFocus={(e) => (e.target.style.borderColor = '#D4920A')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(245,183,49,0.45)')}
              />
            </div>

            {/* File upload zone */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl px-4 py-4 flex flex-col items-center gap-1 transition-colors"
              style={{
                background: file ? '#FEF4D6' : '#FFFFFF',
                border: `1.5px dashed ${file ? '#D4920A' : 'rgba(26,24,22,0.18)'}`,
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#8A8480" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-[12px] text-i3">
                {file ? file.name : `Đính kèm file (${assignment.allowed_file_types.join(', ')})`}
              </span>
              {!file && (
                <span className="text-[10px] text-i3">
                  Tối đa {assignment.max_file_size_mb}MB
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept={assignment.allowed_file_types.map((t) => `.${t}`).join(',')}
                onChange={handleFileChange}
              />
            </button>

            {/* CTAs */}
            <button
              onClick={() => submitMutation.mutate()}
              disabled={!canSubmit || submitMutation.isPending}
              className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-opacity disabled:opacity-50"
              style={{ background: '#1A1816', color: '#F5B731' }}
              title={!canSubmit ? 'Cần nhập nội dung hoặc đính kèm file' : undefined}
            >
              {submitMutation.isPending ? 'Đang nộp...' : 'Nộp Bài →'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-[13px] font-semibold transition-colors"
              style={{
                background: 'transparent',
                color: '#1A1816',
                border: '1.5px solid #1A1816',
              }}
            >
              Để sau
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  )
}
