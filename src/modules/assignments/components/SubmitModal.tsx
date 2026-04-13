import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/ui/BottomSheet'
import { Button } from '../../../shared/components/ui/Button'
import { toast } from '../../../shared/components/ui/Toast'
import { assignmentsService } from '../services/assignments.service'
import type { AssignmentDetail } from '../../../shared/types'

interface SubmitModalProps {
  assignment: AssignmentDetail | null
  onClose: () => void
}

export function SubmitModal({ assignment, onClose }: SubmitModalProps) {
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  const submitMutation = useMutation({
    mutationFn: () => assignmentsService.submitAssignment(assignment!.id, { content }),
    onSuccess: () => {
      toast('Đã nộp bài thành công!', 'success')
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      onClose()
    },
    onError: () => {
      toast('Có lỗi xảy ra, vui lòng thử lại', 'error')
    },
  })

  if (!assignment) return null

  const hasSubmission = !!assignment.submission

  return (
    <BottomSheet open={!!assignment} onClose={onClose} title={assignment.title}>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400">Khoá học</p>
          <p className="text-sm font-medium text-brand-dark">{assignment.course_name}</p>
          <p className="text-xs text-gray-400 mt-1">Hạn nộp</p>
          <p className="text-sm text-brand-dark">{new Date(assignment.due_date).toLocaleDateString('vi-VN')}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 leading-relaxed">{assignment.description}</p>
        </div>

        <div className="text-xs text-gray-400">
          File cho phép: {assignment.allowed_file_types.join(', ')} · Tối đa {assignment.max_file_size_mb}MB
        </div>

        {/* Submitted — show submission */}
        {hasSubmission && assignment.submission && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-xs text-brand-green font-medium">Đã nộp lúc {new Date(assignment.submission.submitted_at).toLocaleDateString('vi-VN')}</p>
              <p className="text-sm text-gray-700 mt-1">{assignment.submission.content}</p>
            </div>
            {assignment.submission.grade !== null && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-medium">Điểm: {assignment.submission.grade}/10</p>
                {assignment.submission.feedback && (
                  <p className="text-sm text-gray-700 mt-1">{assignment.submission.feedback}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Not submitted — show form */}
        {!hasSubmission && (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài làm..."
              rows={6}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
            />
            <Button
              className="w-full"
              onClick={() => submitMutation.mutate()}
              loading={submitMutation.isPending}
              disabled={!content.trim()}
            >
              Nộp bài
            </Button>
          </>
        )}
      </div>
    </BottomSheet>
  )
}
